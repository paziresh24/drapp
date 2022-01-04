import styles from 'assets/styles/pages/drApp/consult.module.scss';
import { getToken } from '@paziresh24/utils/localstorage';
import { useEffect, useRef, useState } from 'react';
import { Overlay } from '@paziresh24/components/core/overlay';
import { useLocation, useHistory } from 'react-router-dom';
import queryString from 'query-string';
import { toast } from 'react-toastify';
import { useDrApp } from '@paziresh24/context/drapp/index';
import { baseURL } from '@paziresh24/utils/baseUrl';

const Create = () => {
    const token = getToken();
    const history = useHistory();
    const [info] = useDrApp();

    const iframe = useRef();
    const [loading, setLoading] = useState(true);
    const { search } = useLocation();
    const urlParams = queryString.parse(search);

    useEffect(() => {
        iframe.current.addEventListener('load', () => {
            setLoading(false);
        });

        window.addEventListener('message', function (e) {
            if (e.data?.drappEvent && e.data?.drappEvent?.action === 'BACK_PAGE') {
                history.push('/consult/', {
                    room_id: e.data.drappEvent.page
                });
            }

            if (
                e.data?.drappEvent &&
                Array.isArray(e.data?.drappEvent) &&
                e.data?.drappEvent?.includes('successFinalize')
            ) {
                !toast.isActive('finalizePrescription') &&
                    toast.success('نسخه با موفقیت ثبت شد.', {
                        toastId: 'finalizePrescription'
                    });
            }

            if (
                e.data?.drappEvent &&
                Array.isArray(e.data?.drappEvent) &&
                e.data?.drappEvent?.includes('backToTurning')
            ) {
                history.push('/turning');
            }
        });
    }, []);

    const tags = [];
    tags.push({
        type: 'center_id',
        value: info.center.id
    });
    info.center.referral_id &&
        tags.push({
            type: 'siam',
            value: info.center.referral_id
        });

    return (
        <div className={styles['iframeWrapper']}>
            {loading && <Overlay />}
            <iframe
                src={`${baseURL(
                    'PRESCRIPTION_IFRAM'
                )}/create?isDoctorApp=1&access_token=${token}&patient_nationalcode=${
                    urlParams.patient_nationalcode
                }&patient_cell=${urlParams.patient_cell}&book_id=${urlParams.book_id}${
                    urlParams.back_page && `&back_page=${urlParams.back_page}`
                }&tags=${JSON.stringify(tags)}&identifier=${info.center.id}${
                    info.center.local_base_url ? `&baseURL=${info.center.local_base_url}` : ''
                }`}
                title="Prescription"
                ref={iframe}
                className={styles['iframe']}
                allow="*"
            />
        </div>
    );
};

export default Create;
