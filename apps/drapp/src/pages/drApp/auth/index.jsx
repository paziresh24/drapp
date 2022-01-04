/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import styles from '@assets/styles/pages/drApp/auth.module.scss';

// HOOKS
import { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { getToken } from '@paziresh24/utils/localstorage';
import { useGetLatestVersion } from '@paziresh24/hooks/core';

// COMPONENTS
import LoginHero from '@paziresh24/components/doctorApp/login/loginHero';
import Form from '@paziresh24/components/doctorApp/login/form';
import * as serviceWorkerRegistration from '../../../serviceWorkerRegistration';

const Auth = () => {
    const history = useHistory();
    const getLatestVersion = useGetLatestVersion();
    const [focus, setFocus] = useState(false);

    useEffect(() => {
        if (getToken()) return history.replace('/');
    }, []);

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
            <Form setFocus={setFocus} focus={focus} />
            <LoginHero focus={focus} setFocus={setFocus} />

            {/* <div className={styles['wrapper']}>
                <LoginHero />
            </div>

            <Link to="/" className={styles.brand}>
                پذیرش24
            </Link> */}
        </div>
    );
};

export default Auth;
