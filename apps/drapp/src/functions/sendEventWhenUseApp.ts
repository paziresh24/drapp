import { getSplunkInstance } from '@paziresh24/shared/ui/provider';

export const sendEventWhenUseApp = () => {
    // twa (cafebazaar)
    if (document.referrer.includes('android-app://')) {
        return getSplunkInstance().sendEvent({
            group: 'pwa',
            type: 'bazaar',
            event: {
                event_action: 'load'
            }
        });
    }

    // pwa
    if (window.matchMedia('(display-mode: standalone)').matches) {
        return getSplunkInstance().sendEvent({
            group: 'pwa',
            type: 'webapp',
            event: {
                event_action: 'load'
            }
        });
    }
};
