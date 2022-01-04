import styles from './deliverFactor.module.scss';
import Button from '@paziresh24/components/core/button';
import Modal from '@paziresh24/components/core/modal';
import { DeliverItemFactor } from '../deliverItemFactor';
import FixedWrapBottom from '@paziresh24/components/prescription/fixedWrapBottom';
import { useEffect } from 'react';
import { useState } from 'react';
import _ from 'lodash';
import { useDeliverPrescription } from '@paziresh24/hooks/prescription';
import { toast } from 'react-toastify';
import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';
import { useBackPage } from '@paziresh24/context/core/backPage';

const DeliverFactor = props => {
    const [prescriptionInfo] = useSelectPrescription();
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
                prescriptionId: prescriptionInfo.id,
                subscriptions: [...props.subscriptions]
            },
            {
                onSuccess: data => {
                    props.onClose(false);
                    if (_.isEmpty(backPage)) {
                        window.parent.postMessage(
                            {
                                drappEvent: ['backToTurning', 'successFinalize'],
                                prescriptionInfo: prescriptionInfo
                            },
                            '*'
                        );
                    } else {
                        window.parent.postMessage(
                            {
                                drappEvent: {
                                    action: 'BACK_PAGE',
                                    page: backPage
                                }
                            },
                            '*'
                        );
                    }
                },
                onError: err => {
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
        <Modal title="تایید نهایی نسخه" fullPage isOpen={props.isOpen} onClose={props.onClose}>
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
