/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import styles from '@assets/styles/pages/drApp/auth.module.scss';

// HOOKS
import { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { getToken } from '@paziresh24/utils/localstorage';
import { useGetLatestVersion } from '@paziresh24/hooks/core';

// COMPONENTS
import LoginHero from '@components/molecules/login/loginHero';
import Form from '@components/molecules/login/form';
import * as serviceWorkerRegistration from '../../../serviceWorkerRegistration';

const Auth = () => {
    const history = useHistory();
    const [focus, setFocus] = useState(false);

    useEffect(() => {
        if (getToken()) return history.replace('/');
    }, []);

    return (
        <div className={styles.wrapper}>
            <Form setFocus={setFocus} focus={focus} />
            <LoginHero focus={focus} setFocus={setFocus} />
        </div>
    );
};

export default Auth;
