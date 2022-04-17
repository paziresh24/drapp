import styles from './deliverItem.module.scss';
import { CircleminusIcon, CirclePlusIcon } from '@paziresh24/shared/icon/public/duotone';
import Modal from '@paziresh24/shared/ui/modal';
import Button from '@paziresh24/shared/ui/button';
import Counter from '@paziresh24/shared/ui/counter';
import { CheckBox } from '@paziresh24/shared/ui/checkBox';

import { useState } from 'react';
import { useRef } from 'react';

import classNames from 'classnames';

const DeliverItem = props => {
    const [openModal, setOpenModal] = useState(false);
    const [count, setCount] = useState();
    const [select, setSelect] = useState(false);
    const isOutOfPrescription = useRef();

    const submit = () => {
        setOpenModal(false);
        setSelect(true);

        props.setSubscriptions(prev => ({
            ...prev,
            [props.nationalNumber]: {
                nationalNumber: props.nationalNumber,
                count,
                isOutOfPrescription: isOutOfPrescription.current.checked
            }
        }));
    };

    const itemAction = () => {
        if (props.numberCanBeDelivered !== 0) {
            if (!select) {
                return setOpenModal(true);
            }
            setCount(null);
            props.setSubscriptions(prev => {
                delete prev[props.nationalNumber];
                return { ...prev };
            });
            setSelect(false);
        }
    };

    return (
        <>
            <div
                className={classNames({
                    [styles['wrapper']]: true,
                    [styles['disabled']]: props.numberCanBeDelivered === 0
                })}
            >
                <div className={styles['title']}>
                    <span>{props.title}</span>
                    {select && <span>تعداد {count}</span>}
                </div>
                <div className={styles['actions']}>
                    <div className={styles['actionButton']} onClick={itemAction} aria-hidden>
                        {!select ? (
                            <>
                                <CirclePlusIcon className={styles['icon']} />
                                <span>افزودن</span>
                            </>
                        ) : (
                            <>
                                <CircleminusIcon className={styles['icon']} />
                                <span>حذف</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <Modal title="افزودن" isOpen={openModal} onClose={setOpenModal}>
                <span>تعداد قابل ارائه {props.numberCanBeDelivered} عدد است.</span>
                <Counter max={+props.numberCanBeDelivered} value={setCount} />
                <CheckBox title="آیا خدمت خارج نسخه هست؟" ref={isOutOfPrescription} />
                <Button block variant="primary" onClick={submit}>
                    ثبت
                </Button>
            </Modal>
        </>
    );
};

export { DeliverItem };
