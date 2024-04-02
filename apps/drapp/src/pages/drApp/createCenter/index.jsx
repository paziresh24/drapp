import styles from './createCenter.module.scss';
import TextField from '@paziresh24/shared/ui/textField';
import Button from '@paziresh24/shared/ui/button';
import { useCreateCenter } from '@paziresh24/hooks/drapp/auth';
import { useGetInfo } from '@paziresh24/hooks/drapp/home';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { digitsFaToEn } from '@paziresh24/shared/utils/digitsFaToEn';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';
import { removeZeroStartNumber } from 'apps/drapp/src/functions/removeZeroStartNumber';

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
                mobile: removeZeroStartNumber(getinfo.data.data.cell),
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
            <a
                className={styles['support-wrapper']}
                href="https://support.paziresh24.com/?utm_source=drpanel&utm_medium=p24&utm_campaign=telblock"
                target="_blank"
                rel="noreferrer"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    x="0px"
                    y="0px"
                    viewBox="0 0 1000 1000"
                    enableBackground="new 0 0 1000 1000"
                    className="w-6 h-6"
                >
                    <g>
                        <path d="M520.1,10c9.2,0.9,18.3,1.7,27.5,2.6c60.9,6.5,118.2,24.8,170.9,56.1c103.4,61.3,171.2,150.1,203,266.1c9.7,35.3,14.1,71.4,14.3,108c0.1,36.9,0,73.8,0,110.7c0,17.7-4.1,34.3-11.7,50.3c-3,6.3-4.3,13.5-6.3,20.3c-45.1,153.2-172.9,270.5-329.8,302.5c-10.8,2.2-21.7,3.9-32.6,5.3c-3.7,0.5-4.9,2.3-6.1,5.4c-12.7,33.5-45,54.4-81,52.6c-34.8-1.7-65.2-26.6-74.2-60.6c-10.8-40.7,11.1-82.8,50.7-97.5c39.4-14.6,83.6,3.2,101.8,41.3c1.9,4.1,4,5,8.2,4.3c131.7-22.1,227.9-92.8,288.8-211.5c0.5-1,1-2.1,1.8-3.8c-4.3,0.4-8,1-11.7,1.2c-62.9,3.5-115.3-45.8-115.5-108.7c-0.1-36.1-0.1-72.3,0-108.4c0.1-63.1,52.1-112.6,115-109c10.4,0.6,20.7,4,31,6.2c1,0.2,1.9,0.6,3.1,1C833,208.2,700.3,69.3,509.7,64.7c-195.5-4.8-339.1,133.3-376.5,279c7.5-1.8,15-4.1,22.7-5.5c56.9-10.5,115.1,30.3,124.5,87.4c1.2,7.3,1.8,14.7,1.8,22.1c0.2,35.4,0.2,70.8,0.1,106.2c-0.2,52.6-35.6,96.2-86.9,107.3c-59.2,12.8-119.1-27.9-129-87.7c-1-6.1-1.7-12.3-1.7-18.5c-0.1-38.1-0.9-76.2,0.1-114.3c3.5-139.5,60.2-253,169.4-339.7C290,56.6,353.8,29.1,424,16.7c16.9-3,34.2-4,51.3-6c1.6-0.2,3.2-0.5,4.9-0.8C493.5,10,506.8,10,520.1,10z M227.9,500.5c0-18,0-36,0-54c-0.1-31.1-24.1-55.4-54.5-55.4c-30.2,0-54.3,24.4-54.3,55.1c-0.1,35.8-0.1,71.7,0,107.5c0,4.2,0.4,8.5,1.3,12.6c6.1,27,31.6,45.4,58.4,42.4c28.2-3.2,48.9-26,49.1-54.2C228,536.4,227.9,518.4,227.9,500.5z M772.4,500c0,17.8-0.1,35.7,0.1,53.5c0,4.3,0.4,8.8,1.4,13c6.3,27,31.9,45.3,58.5,42.1c28.4-3.4,48.8-26.1,48.9-54.5c0.1-36.1,0.1-72.3,0-108.4c0-4.2-0.5-8.5-1.5-12.6c-6.3-26.8-31.6-44.9-58.3-41.9c-28.3,3.2-48.9,26-49.1,54.3C772.3,463.7,772.4,481.9,772.4,500z" />
                    </g>
                </svg>
                <div className={styles['support-content']}>
                    <span style={{ fontSize: '1rem', fontWeight: '600' }}>ارتباط با پشتیبانی</span>
                </div>
            </a>
        </div>
    );
};
export default CreateCenter;
