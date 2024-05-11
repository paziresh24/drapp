import { useEffect, useState } from 'react';
import styles from '@assets/styles/pages/drApp/superMenu.module.scss';
import { useHistory, Link } from 'react-router-dom';
import { useDrApp } from '@paziresh24/context/drapp/index';
import NoImage from '@assets/image/noimage.png';
import Modal from '@paziresh24/shared/ui/modal';
import Button from '@mui/lab/LoadingButton';
import { PenIcon, StarIcon } from '@paziresh24/shared/icon';
import { toast } from 'react-toastify';
import { baseURL } from '@paziresh24/utils/baseUrl';
import Menu from '@components/superMeu/menu';
import { ChevronIcon } from '@paziresh24/shared/icon';
import { useCreateCenter } from '@paziresh24/hooks/drapp/auth';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import { MainMenuData, SubMenuData } from '@configs/menu';
import { StatusBar } from '@components/turning/statusBar';
import { getCookie } from '@paziresh24/utils/cookie';
import { CenterList } from 'apps/drapp/src/components/centerList';
import { removeZeroStartNumber } from 'apps/drapp/src/functions/removeZeroStartNumber';

const SuperMenu = () => {
    const history = useHistory();
    const [info, setInfo] = useDrApp();
    const [userCompleteProfile, setUserCompleteProfile] = useState();
    const [isCenterSelectOpen, setIsCenterSelectOpen] = useState(false);
    const [centerActiveModal, setCenterActiveModal] = useState(false);
    const createCenter = useCreateCenter();

    useEffect(() => {
        if (info) {
            if (!info.doctor?.image) {
                setUserCompleteProfile(70);
            } else {
                setUserCompleteProfile(100);
            }
        }
    }, [info]);

    const createCenterAction = () => {
        createCenter.mutate(
            {
                ignore_shahkar: true,
                mobile: removeZeroStartNumber(info.doctor.cell),
                nationalCode: info.doctor.national_code,
                medical_code: info.doctor.medical_code
            },
            {
                onSuccess: () => {
                    window.location.reload();
                },
                onError: err => {
                    toast.error(err.response.data.message);
                }
            }
        );
    };

    document.querySelector('body').addEventListener('click', e => {
        if (isCenterSelectOpen === true) {
            e.stopPropagation();
            setIsCenterSelectOpen(false);
        }
    });

    return (
        <div className={styles.wrapper}>
            <div className={styles['userInfoWrapper']}>
                <div className={styles['info']}>
                    <img
                        src={
                            info.doctor.image
                                ? baseURL('UPLOADER') + info.doctor.image
                                : null ?? NoImage
                        }
                        onClick={() => {
                            history.push('/profile');
                        }}
                        aria-hidden
                        alt="avatar"
                    />
                    <div className="w-full">
                        <span
                            className={`${styles['user-name']}  mb-4`}
                            onClick={() => {
                                history.push('/profile');
                            }}
                            aria-hidden
                        >
                            <b>{`${info.doctor.name} ${info.doctor.family}`}</b>
                            <PenIcon data-tip data-for="profileIcon" />
                        </span>
                        {userCompleteProfile !== 100 && (
                            <div className={styles['user-profile-complete-score']}>
                                <div className={styles['status']}>
                                    <span>درصد تکمیل پروفایل: &nbsp; ٪{userCompleteProfile}</span>
                                </div>
                                <div className={styles['status-bar']}>
                                    <span style={{ width: `${userCompleteProfile}%` }} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <CenterList />
            </div>
            <Menu items={MainMenuData()} />
            <Menu items={SubMenuData()} />

            <StatusBar />
        </div>
    );
};

export default SuperMenu;
