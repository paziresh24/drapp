import axios from 'axios';
import { getApps } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';
import app from './config';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';

const getOrRegisterServiceWorker = () => {
    if ('serviceWorker' in navigator) {
        return window.navigator.serviceWorker
            .getRegistration('/firebase-cloud-messaging-push-scope')
            .then((serviceWorker: any) => {
                if (serviceWorker) {
                    return serviceWorker;
                }
                return window.navigator.serviceWorker
                    .register('/firebase-messaging-sw.js')
                    .then((serviceWorker: any) => {
                        console.log('success registering SW');
                    })
                    .catch(err => {
                        console.log('registering failed', err);
                    });
            });
    }
    throw new Error('The browser doesn`t support service worker.');
};

const firebaseCloudMessaging = {
    init: async (id: string) => {
        if (getApps().length) {
            try {
                const messaging = getMessaging(app);
                const status = await Notification.requestPermission();

                if (status && status === 'granted') {
                    const serviceWorkerRegistration = await getOrRegisterServiceWorker();

                    const currentToken = await getToken(messaging, {
                        vapidKey:
                            'BLDC9m-xU9lW32bJyeCVCBPIDVpA3OD0T_V_bqe_uy0UuOO1r8HwuzhAX0qbXOhwxVduP_oiVkgfLmw9WlJnRaQ',
                        serviceWorkerRegistration
                    });
                    if (currentToken) {
                        if (localStorage.getItem('fcm_token') !== currentToken) {
                            localStorage.setItem('fcm_token', currentToken);
                            await axios.post(
                                `${window._env_.P24_API_GATEWAY_BASE_URL}/v1/notification/subscribers`,
                                {
                                    user_id: id,
                                    client_id: currentToken,
                                    user_agent: window.navigator.userAgent,
                                    terminal: 'drapp'
                                }
                            );
                        }
                        getSplunkInstance().sendEvent({
                            group: 'notification',
                            type: 'web-push-notification-granted',
                            event: {
                                user_id: id,
                                terminal: 'drapp'
                            }
                        });
                        return currentToken;
                    } else {
                        console.log(
                            'No registration token available. Request permission to generate one.'
                        );
                    }
                }

                if (status && status === 'denied') {
                    getSplunkInstance().sendEvent({
                        group: 'notification',
                        type: 'web-push-notification-denied',
                        event: {
                            user_id: id,
                            terminal: 'drapp'
                        }
                    });
                }
            } catch (error) {
                getSplunkInstance().sendEvent({
                    group: 'notification',
                    type: 'web-push-notification-error',
                    event: {
                        user_id: id,
                        terminal: 'drapp',
                        error
                    }
                });
                console.error(error);
                return null;
            }
        }
    }
};
export { firebaseCloudMessaging };
