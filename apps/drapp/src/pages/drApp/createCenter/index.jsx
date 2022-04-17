import styles from './createCenter.module.scss';
import TextField from '@paziresh24/shared/ui/textField';
import Button from '@paziresh24/shared/ui/button';
import { useCreateCenter } from '@paziresh24/hooks/drapp/auth';
import { useGetInfo } from '@paziresh24/hooks/drapp/home';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { digitsFaToEn } from '@paziresh24/utils';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';

const CreateCenter = () => {
    const getinfo = useGetInfo();
    const [nationalCode, setNationalCode] = useState();
    const createCenter = useCreateCenter();

    useEffect(() => {
        getinfo.refetch();
    }, []);

    const createCenterAction = () => {
        createCenter.mutate(
            {
                ignore_shahkar: true,
                mobile: `0${getinfo.data.data.cell}`,
                nationalCode: digitsFaToEn(nationalCode)
            },
            {
                onSuccess: () => {
                    getSplunkInstance().sendEvent({
                        group: 'register',
                        type: 'successful',
                        event: {
                            cellPhone: digitsFaToEn(`0${getinfo.data.data.cell}`),
                            nationalCode: digitsFaToEn(nationalCode)
                        }
                    });
                    location = '/';
                },
                onError: err => {
                    getSplunkInstance().sendEvent({
                        group: 'register',
                        type: 'unsuccessful',
                        event: {
                            cellPhone: digitsFaToEn(`0${getinfo.data.data.cell}`),
                            nationalCode: digitsFaToEn(nationalCode),
                            error: err.response?.data
                        }
                    });
                    toast.error(err.response.data.message);
                }
            }
        );
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.form}>
                <span style={{ fontWeight: '500', alignSelf: 'flex-start' }}>
                    برای ساخت مطب، کد ملی خود را وارد کنید.
                </span>
                <TextField label="کدملی" onChange={e => setNationalCode(e.target.value)} />
                <Button block onClick={createCenterAction} loading={createCenter.isLoading}>
                    ایجاد مطب
                </Button>
            </div>
            <a className={styles['support-wrapper']} href="tel:02125015555">
                <svg
                    width="21"
                    height="21"
                    viewBox="0 0 21 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect
                        width="20"
                        height="20"
                        transform="translate(0.805908 0.421875)"
                        fill="white"
                    />
                    <path
                        d="M19.1142 15.697C19.1142 15.997 19.0475 16.3053 18.9059 16.6053C18.7642 16.9053 18.5809 17.1886 18.3392 17.4553C17.9309 17.9053 17.4809 18.2303 16.9725 18.4386C16.4725 18.647 15.9309 18.7553 15.3475 18.7553C14.4975 18.7553 13.5892 18.5553 12.6309 18.147C11.6725 17.7386 10.7142 17.1886 9.7642 16.497C8.80587 15.797 7.89753 15.022 7.03087 14.1636C6.17253 13.297 5.39753 12.3886 4.70587 11.4386C4.02253 10.4886 3.47253 9.53862 3.07253 8.59696C2.67253 7.64696 2.47253 6.73862 2.47253 5.87196C2.47253 5.30529 2.57253 4.76362 2.77253 4.26362C2.97253 3.75529 3.2892 3.28862 3.73087 2.87196C4.2642 2.34696 4.84753 2.08862 5.4642 2.08862C5.69753 2.08862 5.93087 2.13862 6.1392 2.23862C6.35587 2.33862 6.54753 2.48862 6.69753 2.70529L8.63087 5.43029C8.78087 5.63862 8.8892 5.83029 8.9642 6.01362C9.0392 6.18862 9.08087 6.36362 9.08087 6.52196C9.08087 6.72196 9.02253 6.92196 8.90587 7.11362C8.79753 7.30529 8.6392 7.50529 8.4392 7.70529L7.80587 8.36362C7.7142 8.45529 7.67253 8.56362 7.67253 8.69696C7.67253 8.76362 7.68087 8.82196 7.69753 8.88862C7.72253 8.95529 7.74753 9.00529 7.7642 9.05529C7.9142 9.33029 8.17253 9.68862 8.5392 10.122C8.9142 10.5553 9.3142 10.997 9.74753 11.4386C10.1975 11.8803 10.6309 12.2886 11.0725 12.6636C11.5059 13.0303 11.8642 13.2803 12.1475 13.4303C12.1892 13.447 12.2392 13.472 12.2975 13.497C12.3642 13.522 12.4309 13.5303 12.5059 13.5303C12.6475 13.5303 12.7559 13.4803 12.8475 13.3886L13.4809 12.7636C13.6892 12.5553 13.8892 12.397 14.0809 12.297C14.2725 12.1803 14.4642 12.122 14.6725 12.122C14.8309 12.122 14.9975 12.1553 15.1809 12.2303C15.3642 12.3053 15.5559 12.4136 15.7642 12.5553L18.5225 14.5136C18.7392 14.6636 18.8892 14.8386 18.9809 15.047C19.0642 15.2553 19.1142 15.4636 19.1142 15.697Z"
                        stroke="#27BDA0"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                    />
                </svg>
                <div className={styles['support-content']}>
                    <span style={{ fontSize: '1rem', fontWeight: '600' }}>
                        پشتیبانی: 02125015555
                    </span>
                </div>
            </a>
        </div>
    );
};
export default CreateCenter;
