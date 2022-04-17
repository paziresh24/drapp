import styles from 'assets/styles/pages/drApp/consult.module.scss';
import { getToken } from '@utils/localstorage';
import { useEffect, useRef, useState } from 'react';
import { Overlay } from '@paziresh24/shared/ui/overlay';
import { useHistory, useLocation } from 'react-router';

const Wallet = () => {
    const token = getToken();
    const history = useHistory();
    const location = useLocation();
    const iframe = useRef();
    const [loading, setLoading] = useState(true);
    const [room_id, setRoomId] = useState();

    useEffect(() => {
        iframe.current.addEventListener('load', () => {
            history.replace();
            setLoading(false);
        });
    }, []);

    return (
        <div className={styles['iframeWrapper']}>
            {loading && <Overlay />}
            <iframe
                src="http://localhost:3002/seller"
                title="consult"
                ref={iframe}
                allow="camera *;microphone *"
                className={styles['iframe']}
            />
        </div>
    );
};

export default Wallet;
