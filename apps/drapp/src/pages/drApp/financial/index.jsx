import styles from 'assets/styles/pages/drApp/consult.module.scss';
import { getToken } from '@paziresh24/utils/localstorage';
import { useEffect, useRef, useState } from 'react';
import { Overlay } from '@paziresh24/components/core/overlay';
import { toast } from 'react-toastify';
import { useGetBankInfo } from '@paziresh24/hooks/drapp/profile';
var bankInfoChecked = false;
const Financial = () => {
    const token = getToken();
    const iframe = useRef();
    const [loading, setLoading] = useState(true);
    const getBankInfo = useGetBankInfo();

    if (
        getBankInfo.isSuccess &&
        (getBankInfo.data.data === null || getBankInfo.data.data === '') &&
        !bankInfoChecked
    ) {
        toast.warning('پزشک گرامی لطفا اطلاعات بانکی خود را در قسمت `پروفایل من` وارد نمایید.');
        bankInfoChecked = true;
    }
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
