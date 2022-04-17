import styles from './providerItem.module.scss';

import Chips from '@paziresh24/shared/ui/chips';
import { useState } from 'react';
import { useEffect } from 'react';
import { sendEvent, digitsFaToEn } from '@paziresh24/utils';
import TextField from '@paziresh24/shared/ui/textField';
import Button from '@paziresh24/shared/ui/button';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
    useCreateTaminDoctor,
    useUpdateTaminDoctor
} from '@paziresh24/hooks/prescription/insurances';
import Import from '../details/ToolBox/Import';
import isEmpty from 'lodash/isEmpty';
import { useDrApp } from '@paziresh24/context/drapp/index';
import TaminIcon from '@paziresh24/shared/icon/prescription/tamin';
import SalamatIcon from '@paziresh24/shared/icon/prescription/salamat';
import { isMobile } from 'react-device-detect';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';

const CenterItem = ({ isAuth, insurance, provider, refetch }) => {
    const createTaminDoctor = useCreateTaminDoctor();
    const updateTaminDoctor = useUpdateTaminDoctor();
    const [isOpen, setIsOpen] = useState(false);
    const [importModal, setImportModal] = useState(false);
    const [isImport, setIsImport] = useState(false);
    const [isAuthentication, setIsAuthentication] = useState(false);
    const [info] = useDrApp();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        if (isAuth) {
            setIsAuthentication(true);
        }
    }, [isAuth]);

    const loginAction = data => {
        if (isEmpty(insurance)) {
            createTaminDoctor.mutate(
                {
                    docId: digitsFaToEn(data.docId),
                    nationalCode: digitsFaToEn(data.nationalCode),
                    mobileNo: digitsFaToEn(data.mobileNo),
                    username: digitsFaToEn(data.taminUsername),
                    password: digitsFaToEn(data.taminPassword)
                },
                {
                    onSuccess: () => {
                        getSplunkInstance().sendEvent({
                            group: 'prescription',
                            type: 'providers-authentication',
                            event: {
                                provider: 'tamin'
                            }
                        });
                        isImport && setImportModal(true);
                        setIsAuthentication(true);
                        refetch();
                        toast.success('اطلاعات شما ثبت شد.');
                    },
                    onError: error => {
                        sendEvent('epsubscribe', 'prescription', 'epsubscribe');
                        getSplunkInstance().sendEvent({
                            group: 'prescription',
                            type: 'providers-authentication-error',
                            event: {
                                provider: 'tamin',
                                error
                            }
                        });
                        console.clear();
                        const statusCode = error.response?.status;
                        if (statusCode === 401) {
                            toast.error('اطلاعات وارد شده نادرست می باشد.');
                        } else {
                            toast.error(error.response.data.message);
                        }
                    }
                }
            );
        } else {
            updateTaminDoctor.mutate(
                {
                    id: insurance.id,
                    docId: digitsFaToEn(data.docId),
                    nationalCode: digitsFaToEn(data.nationalCode),
                    mobileNo: digitsFaToEn(data.mobileNo),
                    username: digitsFaToEn(data.taminUsername),
                    password: digitsFaToEn(data.taminPassword)
                },
                {
                    onSuccess: () => {
                        isImport && setImportModal(true);
                        getSplunkInstance().sendEvent({
                            group: 'prescription',
                            type: 'providers-authentication-edit',
                            event: {
                                provider: 'tamin'
                            }
                        });
                        setIsAuthentication(true);
                        refetch();
                        toast.success('اطلاعات شما ویرایش شد.');
                    },
                    onError: error => {
                        sendEvent('epsubscribe', 'prescription', 'epsubscribe');
                        getSplunkInstance().sendEvent({
                            group: 'prescription',
                            type: 'providers-authentication-error',
                            event: {
                                provider: 'tamin',
                                error
                            }
                        });
                        console.clear();
                        const statusCode = error.response?.status;
                        if (statusCode === 401) {
                            toast.error('اطلاعات وارد شده نادرست می باشد.');
                        } else {
                            toast.error(error.response.data.message);
                        }
                    }
                }
            );
        }
    };

    const providers = {
        tamin: {
            name: 'بیمه تامین اجتماعی',
            icon: <TaminIcon />
        },
        salamat: {
            name: 'بیمه سلامت',
            icon: <SalamatIcon />
        }
    };

    return (
        <div className={styles.centerItem}>
            <div
                style={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                }}
                onClick={() => setIsOpen(prev => !prev)}
                aria-hidden
            >
                <div className={styles.centerInfo}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {isMobile && (
                            <div
                                className={styles['provider-name']}
                                id={
                                    provider === 'tamin'
                                        ? 'taminPorviderItem'
                                        : 'salamatPorviderItem'
                                }
                            >
                                {providers[provider].icon}
                                <span>{providers[provider].name}</span>
                            </div>
                        )}
                        {!isMobile && (
                            <span className={styles.centerName}>
                                {info.doctor.name + ' ' + info.doctor.family}
                            </span>
                        )}
                        <svg
                            width="16"
                            height="17"
                            viewBox="0 0 16 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M11.5308 4.02608C11.7901 3.76669 12.2107 3.7667 12.4701 4.02609C12.7294 4.28547 12.7294 4.706 12.4701 4.96538L12.0076 5.42782C11.5077 5.39169 11.1044 4.98848 11.0683 4.48855L11.5308 4.02608ZM9.89609 5.66072L5.43088 10.1259C4.62411 10.9326 4.32353 11.2421 4.11738 11.6061C3.9618 11.8809 3.8606 12.1858 3.70134 12.7947C4.31025 12.6355 4.61515 12.5343 4.88995 12.3787C5.25403 12.1726 5.56344 11.872 6.3702 11.0652L10.8354 6.60002C10.4453 6.37627 10.1199 6.05086 9.89609 5.66072ZM13.5307 2.96545C12.6856 2.12026 11.3153 2.12024 10.4701 2.96541L4.37023 9.06522L4.29668 9.13874C3.58832 9.84682 3.13084 10.3041 2.81208 10.8671C2.49333 11.4301 2.33657 12.0576 2.09384 13.0294L2.06863 13.1302L1.9394 13.6472C1.87551 13.9028 1.95039 14.1731 2.13668 14.3594C2.32296 14.5457 2.59333 14.6206 2.84891 14.5567L3.36586 14.4275L3.46675 14.4022C4.43846 14.1595 5.06602 14.0028 5.629 13.684C6.19197 13.3653 6.64926 12.9078 7.35733 12.1994L7.35734 12.1994L7.43086 12.1259L13.5307 6.02604C14.3759 5.18088 14.3759 3.81062 13.5307 2.96545Z"
                                fill="#27BDA0"
                            />
                        </svg>
                    </div>
                    <span className={styles.centerAddress}>احراز هویت تامین اجتماعی</span>
                </div>
                {isAuthentication ? (
                    <Chips theme="sucsess">احراز هویت شده</Chips>
                ) : (
                    <Chips theme="error">احراز هویت نشده</Chips>
                )}
            </div>

            {isOpen && (
                <form
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        gap: '1rem',
                        width: '100%'
                    }}
                    onSubmit={handleSubmit(loginAction)}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            gap: '1rem'
                        }}
                    >
                        <TextField
                            defaultValue={insurance?.docId ?? info.doctor?.medical_code}
                            label="کد نظام پزشکی"
                            error={errors.docId}
                            {...register('docId', { required: true })}
                        />
                        <div style={{ display: 'flex', width: '100%', gap: '1rem' }}>
                            <TextField
                                defaultValue={insurance && insurance?.nationalCode}
                                label="کدملی"
                                error={errors.nationalCode}
                                {...register('nationalCode', { required: true })}
                            />
                            <TextField
                                defaultValue={insurance && insurance?.mobileNo}
                                label="شماره موبایل"
                                error={errors.mobileNo}
                                {...register('mobileNo', { required: true })}
                            />
                        </div>
                    </div>
                    <div
                        className="flex w-full space-y-2 lg:space-y-0 lg:space-s-5 flex-col lg:flex-row lg:justify-between"
                        style={{
                            display: 'flex',
                            width: '100%',
                            gap: '1rem',
                            justifyContent: 'space-between'
                        }}
                    >
                        <div className="flex space-s-2 items-center cursor-pointer">
                            <label className={`${styles.checkbox} ${styles.bounce}`}>
                                <input
                                    type="checkbox"
                                    id="taminImportCheckbox"
                                    value={isImport}
                                    onChange={() => setIsImport(prev => !prev)}
                                />
                                <svg viewBox="0 0 21 21">
                                    <polyline points="5 10.75 8.5 14.25 16 6" />
                                </svg>
                            </label>
                            <label htmlFor="taminImportCheckbox" className={styles.importLabel}>
                                انتقال پراستفاده های من از پنل تامین اجتماعی
                            </label>
                        </div>

                        <Button
                            className="self-end "
                            size="small"
                            style={{ padding: '0 5rem' }}
                            type="submit"
                            loading={createTaminDoctor.isLoading || updateTaminDoctor.isLoading}
                        >
                            ثبت
                        </Button>
                    </div>
                </form>
            )}

            <Import
                isOpen={importModal}
                onClose={setImportModal}
                provider={provider}
                taminId={insurance?.id}
            />
        </div>
    );
};

export { CenterItem };
