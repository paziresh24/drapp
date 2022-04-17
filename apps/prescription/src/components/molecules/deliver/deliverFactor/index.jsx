import styles from './deliverFactor.module.scss';
import Button from '@paziresh24/shared/ui/button';
import Modal from '@paziresh24/shared/ui/modal';
import { DeliverItemFactor } from '../deliverItemFactor';
import FixedWrapBottom from '../../fixedWrapBottom';
import { useEffect } from 'react';
import { useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import { useDeliverPrescription } from '@paziresh24/hooks/prescription';
import { toast } from 'react-toastify';
import { useBackPage } from '@paziresh24/context/core/backPage';
import { useHistory } from 'react-router';
import { isMobile } from 'react-device-detect';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';

const DeliverFactor = props => {
    const history = useHistory();
    const [calculated, setCalculated] = useState({
        total: 0,
        orgAmount: 0,
        insuredAmount: 0
    });
    const deliverPrescription = useDeliverPrescription();
    const [backPage] = useBackPage();

    useEffect(() => {
        props.data &&
            props.data.map(item =>
                setCalculated(prev => ({
                    total: prev.total + item.priceInfo.calculated.total,
                    orgAmount: prev.orgAmount + item.priceInfo.calculated.orgAmount,
                    insuredAmount: prev.insuredAmount + item.priceInfo.calculated.insuredAmount
                }))
            );
    }, [props.data]);

    const submit = () => {
        deliverPrescription.mutate(
            {
                prescriptionId: props.prescriptionInfo.id,
                subscriptions: [...props.subscriptions]
            },
            {
                onSuccess: data => {
                    props.onClose(false);
                    if (isEmpty(backPage)) {
                        history.push('/', {
                            prescriptionInfo: props.prescriptionInfo
                        });
                    } else {
                        history.push('/consult/', {
                            room_id: backPage
                        });
                    }
                    getSplunkInstance().sendEvent({
                        group: 'prescription',
                        type: 'deliver',
                        event: { prescription_info: props.prescriptionInfo }
                    });
                },
                onError: err => {
                    getSplunkInstance().sendEvent({
                        group: 'prescription',
                        type: 'deliver-error',
                        event: { error: err, prescription_info: props.prescriptionInfo }
                    });
                    !toast.isActive('deliverPrescription') &&
                        toast.error(err.response.data.message, {
                            toastId: 'deliverPrescription'
                        });
                }
            }
        );
    };

    const closeDeliver = () => {
        props.onClose(false);
        setCalculated({ total: 0, orgAmount: 0, insuredAmount: 0 });
        props.setSubscriptions({});
    };

    return (
        <Modal
            title="تایید نهایی نسخه"
            fullPage={isMobile}
            isOpen={props.isOpen}
            onClose={props.onClose}
        >
            <div className={styles['confirmModal-col']}>
                <div className={styles['deliverItems']}>
                    {props.data &&
                        props.data.map(item => (
                            <DeliverItemFactor
                                key={item.serviceNationalNumber}
                                name={item.name}
                                count={
                                    props.subscriptions.find(
                                        sub => sub.nationalNumber === item.serviceNationalNumber
                                    ).count
                                }
                                total={item.priceInfo.calculated.total}
                                orgAmount={item.priceInfo.calculated.orgAmount}
                                insuredAmount={item.priceInfo.calculated.insuredAmount}
                            />
                        ))}
                </div>
                <div className={styles['deliverDetails']}>
                    <div className={styles['deliverDetails_row']}>
                        <span className={styles['deliverDetails_title']}>مجموع</span>
                        <span className={styles['deliverDetails_value']}>{calculated?.total}</span>
                    </div>
                    <div className={styles['deliverDetails_row']}>
                        <span className={styles['deliverDetails_title']}>سهم سازمان</span>
                        <span className={styles['deliverDetails_value']}>
                            {calculated?.orgAmount}
                        </span>
                    </div>
                    <div className={styles['deliverDetails_row']}>
                        <span className={styles['deliverDetails_title']}>پرداختی بیمار</span>
                        <span className={styles['deliverDetails_value']}>
                            {calculated?.insuredAmount}
                        </span>
                    </div>
                </div>

                <FixedWrapBottom>
                    <Button
                        block
                        variant="primary"
                        onClick={submit}
                        loading={deliverPrescription.isLoading}
                    >
                        تایید
                    </Button>
                    <Button block variant="secondary" onClick={closeDeliver}>
                        لغو
                    </Button>
                </FixedWrapBottom>
            </div>
        </Modal>
    );
};

export { DeliverFactor };
