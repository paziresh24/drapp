import styles from './deliverCase.module.scss';
import Button from '@paziresh24/components/core/button';
import Modal from '@paziresh24/components/core/modal';
import { DeliverItem } from '../deliverItem';
import FixedWrapBottom from '@paziresh24/components/prescription/fixedWrapBottom';
import { Loading } from '@paziresh24/components/prescription/loading';
import {
    useDeliverPrescriptionInfo,
    useDeliverPrescriptionPriceInfo
} from '@paziresh24/hooks/prescription';
import { useEffect } from 'react';
import { useState } from 'react';
import _ from 'lodash';
import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';
import { DeliverFactor } from '../deliverFactor';

const DeliverCase = props => {
    const [prescriptionInfo] = useSelectPrescription();
    const deliverPrescriptionInfo = useDeliverPrescriptionInfo({
        // printCode: props.trackingCode,
        // nationalCode: props.nationalCode
        prescriptionId: prescriptionInfo?.id
    });
    const deliverPrescriptionPriceInfo = useDeliverPrescriptionPriceInfo();
    const [factorModal, setFactorModal] = useState(false);
    const [data, setData] = useState([]);
    const [subscriptions, setSubscriptions] = useState({});

    useEffect(() => {
        if (props.isOpen) {
            deliverPrescriptionInfo.refetch();
        }
    }, [props.isOpen]);

    const submit = () => {
        setData(Object.values(subscriptions));
        deliverPrescriptionPriceInfo.mutate(
            {
                prescriptionId: prescriptionInfo.id,
                subscriptions: Object.values(subscriptions)
            },
            {
                onSuccess: () => {
                    setFactorModal(true);
                    props.onClose(false);
                }
            }
        );
    };

    return (
        <>
            <Modal
                title="اقلام را برای ارائه انتخاب کنید."
                fullPage
                isOpen={props.isOpen}
                onClose={props.onClose}
            >
                <div className={styles['confirmModal-col']}>
                    <div className={styles['deliverItems']}>
                        {deliverPrescriptionInfo.isLoading && <Loading />}

                        {deliverPrescriptionInfo.isSuccess &&
                            deliverPrescriptionInfo.data.data.map(item => (
                                <DeliverItem
                                    key={item.serviceNationalNumber}
                                    title={item.name}
                                    nationalNumber={item.serviceNationalNumber}
                                    numberCanBeDelivered={item.numberCanBeDelivered}
                                    setSubscriptions={setSubscriptions}
                                />
                            ))}
                    </div>
                    <FixedWrapBottom>
                        <Button
                            block
                            variant="primary"
                            disabled={_.isEmpty(subscriptions)}
                            loading={deliverPrescriptionPriceInfo.isLoading}
                            onClick={submit}
                        >
                            ثبت
                        </Button>
                    </FixedWrapBottom>
                </div>
            </Modal>
            <DeliverFactor
                isOpen={factorModal}
                onClose={setFactorModal}
                data={deliverPrescriptionPriceInfo.data?.data}
                subscriptions={data}
                setSubscriptions={setSubscriptions}
                printCode={props.trackingCode}
                nationalCode={props.nationalCode}
            />
        </>
    );
};

export { DeliverCase };
