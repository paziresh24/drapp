import styles from 'assets/styles/pages/drApp/consult.module.scss';
import { getToken } from '@paziresh24/utils/localstorage';
import { useEffect, useRef, useState } from 'react';
import { Overlay } from '@paziresh24/components/core/overlay';

const ConsultTurning = () => {
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
                src={`${process.env.REACT_APP_BASE_URL_CONSULT}/panel/doctor/?isWebView=1&access_token=${token}#my-turn`}
                title="consult"
                ref={iframe}
                className={styles['iframe']}
            />
        </div>
    );
};

export default ConsultTurning;
