import styles from './prescriptionTemplates.module.scss';
import { useState, useEffect } from 'react';

import Modal from '../../core/modal';
import TexFiled from '../../core/textField';
import Button from '../../core/button';
import {
    useDeleteFavoritePrescriptions,
    useGetFavoritePrescriptions,
    useImportRequests,
    useImportStatus,
    usePostFavoritePrescriptions
} from '../../../hooks/prescription';
import { LoadingIcon, PlusLineIcon, RemoveIcon } from '../../icons';
import { useForm } from 'react-hook-form';
import SearchBar from '../search/searchBar';
import { EmptyState } from '../emptyState';
import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';
import { isMobile } from 'react-device-detect';
import { useServices } from '@paziresh24/context/prescription/services-context';
import { toast } from 'react-toastify';
import { Overlay } from '../../core/overlay';
import { useLearnTour } from '../../../hooks/learn';
import isEmpty from 'lodash/isEmpty';

const PrescriptionTemplates = ({ isOpen, onClose }) => {
    const [prescriptionInfo] = useSelectPrescription();
    const [services, setServices] = useServices();

    const getFavoritePrescriptions = useGetFavoritePrescriptions({
        [prescriptionInfo.insuranceType + 'Items_null']: false
    });
    const postFavoritePrescriptions = usePostFavoritePrescriptions();
    const deleteFavoritePrescriptions = useDeleteFavoritePrescriptions();

    const [favoriteFolderNameModal, setFavoriteFolderNameModal] = useState(false);
    const [searchPrescriptionsValue, setSearchPrescriptionsValue] = useState('');

    const [taminInfo, setTaminInfo] = useState(false);

    const importRequests = useImportRequests();
    const importStatus = useImportStatus();
    const { tourState, setSteps } = useLearnTour();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const {
        register: register1,
        handleSubmit: handleSubmit1,
        formState: { errors: errors1 }
    } = useForm();

    const importRequestAction = data => {
        importRequests.mutate(
            {
                provider: prescriptionInfo.insuranceType,
                ...data
            },
            {
                onSuccess: data => {
                    toast.success(data.message);
                    importStatus.remove();
                    setTimeout(() => importStatus.refetch(), 0);
                    setTaminInfo(false);
                },

                onError: err => {
                    toast.error(err.response.data.message);
                }
            }
        );
    };
    const [intervalRequest, setIntervalRequest] = useState();

    useEffect(() => {
        if (isOpen) {
            getFavoritePrescriptions.refetch();
            importStatus.refetch();
        } else {
            clearInterval(intervalRequest);
        }
    }, [isOpen]);

    useEffect(() => {
        if (importStatus.isSuccess) {
            if (!isEmpty(importStatus.data)) {
                if (importStatus.data[importStatus.data.length - 1].status === 'FAILED') {
                    return clearInterval(intervalRequest);
                }
                setIntervalRequest(
                    setInterval(() => {
                        if (
                            importStatus.data[importStatus.data.length - 1].status === 'SUBMITTED'
                        ) {
                            getFavoritePrescriptions.refetch();
                            importStatus.refetch();
                        }
                    }, 5000)
                );
            }
        }
    }, [importStatus.data]);

    const addFavoritePrescriptions = data => {
        postFavoritePrescriptions.mutate(
            {
                name: data.name,
                [prescriptionInfo.insuranceType + 'Items']: services.filter(
                    item => item.item_id !== null
                )
            },
            {
                onSuccess: () => {
                    onClose(false);
                    setSteps(14);
                    getFavoritePrescriptions.refetch();
                    setFavoriteFolderNameModal(false);
                }
            }
        );
    };

    const addItemAction = prescription => {
        prescription[prescriptionInfo.insuranceType + 'Items'].map(item =>
            setServices(service => [
                ...service,
                {
                    id: service[service.length - 1].id + 1,
                    item_id: item.service.id,
                    service: { id: item.service.id, name: item.service.name },
                    use_instruction: item.use_instruction,
                    use_time: item.use_time,
                    how_to_use: item.how_to_use,
                    count: item.count,
                    service_type: item.service_type,
                    description: item.description
                }
            ])
        );
        onClose(false);
    };

    const deleteItemAction = id => {
        deleteFavoritePrescriptions.mutate(id, {
            onSuccess: () => {
                getFavoritePrescriptions.refetch();
            }
        });
    };

    return (
        <>
            <Modal title="پراستفاده ها" isOpen={isOpen} onClose={onClose} fullPage={isMobile}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <div
                        className={styles['add-item']}
                        onClick={() => {
                            setSteps(11);
                            setFavoriteFolderNameModal(true);
                        }}
                        aria-hidden
                        id="add_template_button_step"
                    >
                        <span>افزودن نسخه فعلی</span>
                        <PlusLineIcon />
                    </div>
                    <div
                        className={styles['add-item']}
                        onClick={() => setTaminInfo(true)}
                        aria-hidden
                    >
                        <span>ایمپورت نسخه ها</span>
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M5.75 9C5.75 5.54822 8.54822 2.75 12 2.75C14.9382 2.75 17.4045 4.7782 18.0719 7.51188C18.1301 7.75035 18.3014 7.94523 18.5304 8.03365C20.1226 8.64848 21.25 10.1935 21.25 12C21.25 13.39 20.5835 14.624 19.5496 15.4007C19.2184 15.6495 19.1516 16.1196 19.4003 16.4508C19.6491 16.782 20.1192 16.8488 20.4504 16.6C21.8454 15.5523 22.75 13.8817 22.75 12C22.75 9.69141 21.3898 7.70217 19.4293 6.78706C18.4768 3.58539 15.512 1.25 12 1.25C7.8612 1.25 4.48014 4.49432 4.26126 8.57854C2.49832 9.27243 1.25 10.9897 1.25 13C1.25 14.7591 2.20663 16.2939 3.62446 17.1141C3.983 17.3215 4.4418 17.199 4.6492 16.8404C4.85661 16.4819 4.73409 16.0231 4.37554 15.8157C3.40216 15.2526 2.75 14.202 2.75 13C2.75 11.4863 3.78548 10.2126 5.18784 9.85211C5.52413 9.76566 5.7571 9.45969 5.75099 9.11252C5.75033 9.0751 5.75 9.0376 5.75 9ZM12.75 12C12.75 11.5858 12.4142 11.25 12 11.25C11.5858 11.25 11.25 11.5858 11.25 12V19.1893L9.03033 16.9697C8.73744 16.6768 8.26256 16.6768 7.96967 16.9697C7.67678 17.2626 7.67678 17.7374 7.96967 18.0303L11.4697 21.5303C11.7626 21.8232 12.2374 21.8232 12.5303 21.5303L16.0303 18.0303C16.3232 17.7374 16.3232 17.2626 16.0303 16.9697C15.7374 16.6768 15.2626 16.6768 14.9697 16.9697L12.75 19.1893V12Z"
                                fill="#27BDA0"
                            />
                        </svg>
                    </div>
                </div>

                {importStatus.isSuccess &&
                    !isEmpty(importStatus.data) &&
                    importStatus.data[importStatus.data.length - 1]?.status !== 'SUCCESS' && (
                        <div
                            className={`${styles['box-message']} ${
                                importStatus.data[importStatus.data.length - 1].status === 'FAILED'
                                    ? styles['error']
                                    : styles['submitted']
                            }`}
                        >
                            {importStatus.data[importStatus.data.length - 1].status ===
                                'SUBMITTED' && (
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <span>درخواست ایمپورت شما ثبت شد.</span>
                                    <LoadingIcon />
                                </div>
                            )}
                            {importStatus.data[importStatus.data.length - 1].status ===
                                'FAILED' && (
                                <span>
                                    {importStatus.data[importStatus.data.length - 1].error_message}
                                </span>
                            )}
                        </div>
                    )}

                {getFavoritePrescriptions.isSuccess && !isEmpty(getFavoritePrescriptions.data) && (
                    <div className={styles['searchWrapper']}>
                        <SearchBar
                            label="جستجوی بین نسخه ها ..."
                            value={setSearchPrescriptionsValue}
                        />
                    </div>
                )}
                <div className={styles['items']}>
                    {getFavoritePrescriptions.isSuccess &&
                        getFavoritePrescriptions.data.map(
                            prescription =>
                                prescription[prescriptionInfo.insuranceType + 'Items'] &&
                                prescription.name
                                    .toLowerCase()
                                    .includes(searchPrescriptionsValue) && (
                                    <div className={styles['item']} key={prescription.id}>
                                        <span
                                            className={styles['item-text']}
                                            onClick={() => addItemAction(prescription)}
                                            aria-hidden
                                        >
                                            {prescription.name}
                                        </span>
                                        <div
                                            className={styles['item_icon']}
                                            onClick={() => deleteItemAction(prescription.id)}
                                            aria-hidden
                                        >
                                            <RemoveIcon />
                                        </div>
                                    </div>
                                )
                        )}
                    {getFavoritePrescriptions.isSuccess &&
                        isEmpty(getFavoritePrescriptions.data) && (
                            <EmptyState text="نسخه ای وجود ندارد" />
                        )}
                </div>

                {(getFavoritePrescriptions.isError || getFavoritePrescriptions.isLoading) && (
                    <Overlay />
                )}
            </Modal>

            <Modal
                title="نام نسخه"
                isOpen={favoriteFolderNameModal}
                onClose={setFavoriteFolderNameModal}
                id="name_template_button_step"
            >
                <form
                    onSubmit={handleSubmit(addFavoritePrescriptions)}
                    className={styles['favoritePrescriptionsName-wrapper']}
                >
                    <TexFiled
                        label="نام نسخه"
                        name="name"
                        error={errors.name}
                        {...register('name', {
                            required: true
                        })}
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        block
                        loading={postFavoritePrescriptions.isLoading}
                    >
                        تایید
                    </Button>
                </form>
            </Modal>
            <Modal title="اطلاعات ورود تامین اجتماعی" isOpen={taminInfo} onClose={setTaminInfo}>
                <form
                    onSubmit={handleSubmit1(importRequestAction)}
                    className={styles['info-wrapper']}
                >
                    <TexFiled
                        label="نام کاربری"
                        error={errors1.username}
                        {...register1('username', {
                            required: true
                        })}
                    />
                    <TexFiled
                        label="رمز عبور"
                        error={errors1.password}
                        {...register1('password', {
                            required: true
                        })}
                    />
                    <Button
                        type="submit"
                        variant="primary"
                        block
                        loading={importRequests.isLoading || importStatus.isLoading}
                    >
                        تایید
                    </Button>
                </form>
            </Modal>
        </>
    );
};

export default PrescriptionTemplates;
