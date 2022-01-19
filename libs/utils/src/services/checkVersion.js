import { getLatestVersion } from 'apis/core/getLatestVersion';
import * as serviceWorkerRegistration from 'apps/drapp/src/serviceWorkerRegistration';
import { captureMessage } from '@sentry/react';

export const checkVersion = () => {
    getLatestVersion()
        .then(latestVersion => {
            window.__drapp = {
                version: latestVersion.name,
                changeLog: latestVersion.changeLog
            };
            if (latestVersion.name !== localStorage.getItem('APP_VERSION')) {
                localStorage.setItem('APP_VERSION', latestVersion.name);
                if ('serviceWorker' in navigator) {
                    caches.keys().then(keys =>
                        keys.forEach(key =>
                            caches.delete(key).then(() => {
                                serviceWorkerRegistration.unregister();
                                window.location.reload();
                            })
                        )
                    );
                }
            }
            return { changeLog: latestVersion.changeLog, name: latestVersion.name };
        })
        .catch(err => {
            captureMessage('error: get latest version');
        });
};
