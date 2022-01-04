import { useEffect, useState } from 'react';

import styles from './addPrescription.module.scss';

import { useHistory } from 'react-router-dom';

import CirclePlusIcon from '../../icons/public/circlePlus';
import Modal from '../../core/modal';
import TextField from '../../core/textField';
import Button from '../../core/button';
import { useMe } from '@paziresh24/context/prescription/me-context';
import { v4 as uuid } from 'uuid';
import { useAddPrescription } from '../../../hooks/prescription';
import { toast } from 'react-toastify';
import { CSSTransition } from 'react-transition-group';
import { useForm } from 'react-hook-form';

const AddPrescription = props => {
    const history = useHistory();
    const [openModal, setOpenModal] = useState(false);
    const [me] = useMe();
    const mutation = useAddPrescription();
    const uuidInstance = uuid();
    const [show, setShow] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        setShow(true);
    }, []);

    useEffect(() => {
        if (mutation.isSuccess) return history.push(`/${mutation.data.result.id}`);
        if (mutation.isError) {
            setOpenModal(false);
            return (
                !toast.isActive('add') &&
                toast.error(mutation.error.response?.data.message || 'خطا در دریافت اطلاعات.', {
                    toastId: 'add'
                })
            );
        }
    }, [mutation.status]);

    const actionButtonAddPrescription = data => {
        mutation.mutate({
            ...data,
            identifier: uuidInstance
        });
    };

    return (
        <>
            <CSSTransition
                in={show}
                timeout={300}
                classNames={{
                    enterDone: styles['show']
                }}
            >
                <button className={styles['button']} onClick={() => setOpenModal(true)} {...props}>
                    <CirclePlusIcon className={styles['icon']} />
                    <span>افزودن</span>
                </button>
            </CSSTransition>
            <Modal title="اطلاعات بیمار" isOpen={openModal} onClose={setOpenModal}>
                <form
                    className={styles['wrapper']}
                    onSubmit={handleSubmit(actionButtonAddPrescription)}
                >
                    <TextField
                        type="tel"
                        name="patientNationalCode"
                        label="کدملی/کداتباع *"
                        error={errors.patientNationalCode}
                        {...register('patientNationalCode', {
                            required: true,
                            maxLength: 12,
                            minLength: 10
                        })}
                    />
                    <TextField
                        type="tel"
                        name="patientCell"
                        label="شماره موبایل"
                        error={errors.patientCell}
                        {...register('patientCell', {
                            required: false,
                            maxLength: 11,
                            minLength: 11
                        })}
                    />
                    <Button variant="primary" loading={mutation.isLoading} type="submit">
                        افزودن
                    </Button>
                </form>
            </Modal>
        </>
    );
};

export { AddPrescription };
