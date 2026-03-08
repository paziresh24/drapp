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
                src="https://providers.paziresh24.com/app/rules"
                title="consult"
                ref={iframe}
                className={styles['iframe']}
            />
        </div>
    );
};

export default ConsultTerm;
