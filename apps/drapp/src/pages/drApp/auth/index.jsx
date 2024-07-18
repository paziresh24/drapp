/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import styles from '@assets/styles/pages/drApp/auth.module.scss';

// HOOKS
import { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { getToken } from '@paziresh24/utils/localstorage';
import { useGetLatestVersion } from '@paziresh24/hooks/core';

// COMPONENTS
import LoginHero from '@components/login/loginHero';
import Form from '@components/login/form';
import Helmet from 'react-helmet';
import * as serviceWorkerRegistration from '../../../serviceWorkerRegistration';
import AppInstallBanner from '@components/appInstallBanner';
import { sendEventWhenUseApp } from 'apps/drapp/src/functions/sendEventWhenUseApp';
import { Mobile } from '@paziresh24/hooks/device';
import { useGetInfo } from '@paziresh24/hooks/drapp/home';

const Auth = () => {
    const history = useHistory();
    const [focus, setFocus] = useState(false);
    const getLatestVersion = useGetLatestVersion();
    const user = useGetInfo();

    useEffect(() => {
        user.refetch();
    }, []);

    useEffect(() => {
        sendEventWhenUseApp();
        if (user.data) return history.replace(`/${window.location.search}`);
    }, [user.data]);

    useEffect(() => {
        if (
            getLatestVersion.isSuccess &&
            localStorage.getItem('APP_VERSION') !== getLatestVersion.data.name
        ) {
            localStorage.setItem('APP_VERSION', getLatestVersion.data.name);
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
    }, [getLatestVersion.status]);

    return (
        <div className={styles.wrapper}>
            <Helmet>
                <title>اپلیکیشن نوبت دهی</title>
            </Helmet>
            <Form setFocus={setFocus} focus={focus} />
            <LoginHero focus={focus} setFocus={setFocus} />
            <Mobile>
                <AppInstallBanner />
            </Mobile>
        </div>
    );
};

export default Auth;
