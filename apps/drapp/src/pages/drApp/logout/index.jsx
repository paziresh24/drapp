/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { useEffect } from 'react';
import { clearToken } from '@paziresh24/utils/localstorage';
import { useLogout } from '@paziresh24/hooks/drapp/auth';
import { useDrApp } from '@paziresh24/context/drapp';
import { Loading } from '@paziresh24/shared/ui/loading';

const LogOut = () => {
    const logout = useLogout();
    const [, setInfo] = useDrApp();

    useEffect(() => {
        logout.mutate(null, {
            onSuccess: () => {
                setInfo('');
                clearToken();
                window.location = 'auth';
            }
        });
    }, []);

    return <Loading show={true} />;
};

export default LogOut;
