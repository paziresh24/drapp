import styles from 'assets/styles/pages/drApp/consult.module.scss';
import { getToken } from '@paziresh24/utils/localstorage';
import { useEffect, useRef, useState } from 'react';
import { Overlay } from '@paziresh24/components/core/overlay';
import { useHistory, useLocation } from 'react-router';

const Consult = () => {
    const token = getToken();
    const history = useHistory();
    const location = useLocation();
    const iframe = useRef();
    const [loading, setLoading] = useState(true);
    const [room_id, setRoomId] = useState();

    useEffect(() => {
        if (location.state?.room_id) setRoomId(location.state?.room_id);
        iframe.current.addEventListener('load', () => {
            history.replace();
            setLoading(false);
        });

        window.addEventListener('message', function (e) {
            if (e.data.drappEvent && e.data.drappEvent?.action === 'CREATE_PRESCRIPTION') {
                history.push(
                    `/prescription/create?patient_nationalcode=${e.data.drappEvent.patient_nationalcode}&patient_cell=${e.data.drappEvent.patient_cell}&book_id=${e.data.drappEvent.book_Id}&back_page=${e.data.drappEvent.room_id}`
                );
            }
        });
    }, []);

    return (
        <div className={styles['iframeWrapper']}>
            {loading && <Overlay />}
            <iframe
                src={`${
                    process.env.REACT_APP_BASE_URL_CONSULT
                }/panel/doctor/?drapp_embed=1&access_token=${token}${
                    room_id ? `&drapp_embed_success_insurance=${room_id}` : ''
                }#consult`}
                title="consult"
                ref={iframe}
                allow="camera *;microphone *"
                className={styles['iframe']}
            />
        </div>
    );
};

export default Consult;
