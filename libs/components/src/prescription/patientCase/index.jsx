import styles from './patientCase.module.scss';

import Modal from '@components/core/modal';
import Button from '@components/core/button';
import { useEffect, useState } from 'react';
import Item from './item';
import { Loading } from '@components/prescription/loading';
import { useParams } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';
import FixedWrapBottom from '../fixedWrapBottom';
import {
    useGetItemServices,
    useDeletePrescription,
    useGetPrescriptions
} from '@paziresh24/hooks/prescription';
import isEmpty from 'lodash/isEmpty';
import { useServices } from '@paziresh24/context/prescription/services-context';
import { Overlay } from '../../core/overlay';
import { EmptyState } from '../emptyState';
import { useLearnTour } from '../../../hooks/learn';

const PatientCase = ({ isOpen, onClose }) => {
    const { prescriptionId } = useParams();
    const [prescriptionInfo] = useSelectPrescription();
    const [prescriptionIds, setPrescriptionIds] = useState([]);
    const getPrescriptions = useGetPrescriptions({
        patientNationalCode: prescriptionInfo.patientNationalCode
    });
    const getItemServices = useGetItemServices({
        prescriptionId: getPrescriptions.isSuccess && getPrescriptions.data.map(item => item.id)
    });
    const [deletePrescriptionModal, setDeletePrescriptionModal] = useState(false);
    const deletePrescription = useDeletePrescription();
    const [dropDownShow, setDropDownShow] = useState(false);

    const [itemsSelect, setItemsSelect] = useState([]);
    const [items, setItems] = useState([]);
    const { tourState, setSteps } = useLearnTour();

    useEffect(() => {
        if (isOpen) {
            getPrescriptions.refetch();
        }
    }, [isOpen]);

    useEffect(() => {
        if (getPrescriptions.isSuccess) {
            getItemServices.refetch();
        }
    }, [getPrescriptions.status]);

    const deletePrescriptionAction = async () => {
        deletePrescription.mutate(deletePrescriptionModal);
    };

    document.querySelector('body').addEventListener('click', () => {
        if (dropDownShow) {
            setDropDownShow(false);
        }
    });
    const [services, setServices] = useServices();

    const addItemService = () => {
        itemsSelect.map(item =>
            setServices(service => [
                ...service,
                {
                    ...item,
                    item_id: item.service.id,
                    id: service[service.length - 1].id + 1,
                    service_type: item.service_type.id
                }
            ])
        );
        modalOnClose(false);

        setItemsSelect([]);
    };

    const modalOnClose = () => {
        onClose(false);
        setSteps(18);
    };

    return (
        <>
            <Modal
                title="سوابق بیمار"
                isOpen={isOpen}
                onClose={modalOnClose}
                fullPage={isMobile}
                maxWidth="60%"
                id="show_pcase_button_step"
            >
                {getPrescriptions.isSuccess &&
                    getItemServices.isSuccess &&
                    Array.isArray(getItemServices.data[0]) && (
                        <div className={styles['itemsWrapper']}>
                            {getPrescriptions.data.map(item =>
                                getItemServices.data.map(
                                    prescriptions =>
                                        prescriptions.find(
                                            service => service.prescription_id === item.id
                                        ) && (
                                            <div className={styles.item}>
                                                <span className={styles.itemInfo}>
                                                    تجویز شده در{' '}
                                                    {new Date(item.created_at).toLocaleDateString(
                                                        'fa'
                                                    )}{' '}
                                                    توسط دکتر {item.doctor_additional_data.fullName}
                                                </span>
                                                {prescriptions.map(
                                                    service =>
                                                        service.prescription_id === item.id && (
                                                            <Item
                                                                setItemsSelect={setItemsSelect}
                                                                service={service}
                                                                prescription={item}
                                                            />
                                                        )
                                                )}
                                            </div>
                                        )
                                )
                            )}
                            {isEmpty(getItemServices.data) && (
                                <EmptyState text="سابقه ای وجود ندارد" />
                            )}
                        </div>
                    )}
                {getPrescriptions.isSuccess &&
                    getItemServices.isSuccess &&
                    !Array.isArray(getItemServices.data[0]) && (
                        <div className={styles['itemsWrapper']}>
                            <div className={styles.item}>
                                <span className={styles.itemInfo}>
                                    تجویز شده در{' '}
                                    {new Date(
                                        getPrescriptions.data[0].created_at
                                    ).toLocaleDateString('fa')}{' '}
                                    توسط دکتر{' '}
                                    {getPrescriptions.data[0].doctor_additional_data.fullName}
                                </span>
                                {getItemServices.data.map(service => (
                                    <Item
                                        key={service.id}
                                        setItemsSelect={setItemsSelect}
                                        service={service}
                                        prescription={getPrescriptions.data[0]}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                {(getPrescriptions.isError ||
                    getPrescriptions.isLoading ||
                    getItemServices.isLoading) && (
                    <div className={styles['itemsWrapper']}>
                        <Overlay />
                    </div>
                )}

                <FixedWrapBottom>
                    <div className={styles.actionsWrapper}>
                        <Button size="small" onClick={addItemService}>
                            افزودن
                        </Button>
                    </div>
                </FixedWrapBottom>
            </Modal>
            <Modal
                title="آیا از حذف نسخه مطمئن می باشید؟"
                isOpen={deletePrescriptionModal}
                onClose={setDeletePrescriptionModal}
            >
                <div className={styles['confirmModal-row']}>
                    <Button
                        block
                        variant="primary"
                        theme="error"
                        onClick={deletePrescriptionAction}
                        loading={deletePrescription.isLoading}
                    >
                        بله و حذف
                    </Button>
                    <Button
                        block
                        variant="secondary"
                        theme="error"
                        onClick={() => setDeletePrescriptionModal(false)}
                    >
                        لغو عملیات
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export default PatientCase;
