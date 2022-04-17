import styles from 'assets/styles/pages/drApp/consult.module.scss';
import { useEffect, useRef, useState } from 'react';
import { Overlay } from '@paziresh24/shared/ui/overlay';

const ConsultTerm = () => {
    const [loading, setLoading] = useState(true);
    const iframe = useRef();

    useEffect(() => {
        iframe.current.addEventListener('load', () => {
            setLoading(false);
        });
    }, []);

    return (
        <div className={styles['iframeWrapper']}>
            {loading && <Overlay />}
            <iframe
                src={`${window._env_.P24_BASE_URL_CONSULT}/home/talking-with-consult-patient/`}
                title="consult"
                ref={iframe}
                className={styles['iframe']}
            />
        </div>
    );
};

export default ConsultTerm;
