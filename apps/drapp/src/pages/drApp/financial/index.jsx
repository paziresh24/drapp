import styles from 'assets/styles/pages/drApp/consult.module.scss';
import { getToken } from '@paziresh24/utils/localstorage';
import { useEffect, useRef, useState } from 'react';
import { Overlay } from '@paziresh24/shared/ui/overlay';

const Financial = () => {
    const token = getToken();
    const iframe = useRef();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        iframe.current.addEventListener('load', () => {
            setLoading(false);
        });
    }, []);

    return (
        <div className={styles['iframeWrapper']}>
            {loading && <Overlay />}
            <iframe
                src={`https://www.paziresh24.com/panel/doctor/?isWebView=1&access_token=${token}#payments-info`}
                title="consult"
                ref={iframe}
                className={styles['iframe']}
            />
        </div>
    );
};

export default Financial;
