import Button from '../../core/button';
import Modal from '../../core/modal';
import TextField from '../../core/textField';
import { useGetPrescriptionReference } from '@paziresh24/hooks/prescription';
import { useForm } from 'react-hook-form';
import { useDrApp } from '@paziresh24/context/drapp';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router';

const ReferenceModal = ({ isOpen, onClose, nationalCodeDefaultValue }) => {
    const history = useHistory();
    const [info] = useDrApp();
    const getPrescriptionReference = useGetPrescriptionReference();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const submitForm = data => {
        const tags = [];
        tags.push({
            type: 'center_id',
            value: info.center.id
        });
        info.center?.referral_id &&
            tags.push({
                type: 'siam',
                value: info.center.referral_id
            });

        return getPrescriptionReference.mutate(
            {
                code: data.code,
                nationalCode: data.nationalCode,
                identifier: info.center.id,
                tags
            },
            {
                onError: error => {
                    toast.error(error.response.data.message);
                },
                onSuccess: data => {
                    return history.push(`/prescription/patient/${data.prescription.id}`);
                }
            }
        );
    };

    return (
        <Modal title="ارجاع" isOpen={isOpen} onClose={onClose}>
            <form
                style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                onSubmit={handleSubmit(submitForm)}
            >
                <TextField
                    type="tel"
                    label="کدملی/کداتباع بیمار"
                    name="nationalCode"
                    defaultValue={nationalCodeDefaultValue}
                    error={errors.nationalCode}
                    {...register('nationalCode', {
                        required: true,
                        maxLength: 12,
                        minLength: 10
                    })}
                />
                <TextField
                    type="tel"
                    label="کد پیگیری"
                    name="code"
                    error={errors.code}
                    {...register('code', {
                        required: true
                    })}
                />
                <Button
                    type="submit"
                    variant="primary"
                    block
                    loading={getPrescriptionReference.isLoading}
                >
                    تایید
                </Button>
            </form>
        </Modal>
    );
};

export default ReferenceModal;
