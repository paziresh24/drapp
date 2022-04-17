import styles from 'assets/styles/pages/drApp/consult.module.scss';
import { getToken } from '@paziresh24/utils/localstorage';
import { useEffect, useRef, useState } from 'react';
import { Overlay } from '@paziresh24/shared/ui/overlay';

const Qa = () => {
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
                src={`https://www.paziresh24.com/handelQaLogin?isWebView=1&access_token=${token}`}
                title="consult"
                ref={iframe}
                className={styles['iframe']}
            />
        </div>
    );
};

export default Qa;
