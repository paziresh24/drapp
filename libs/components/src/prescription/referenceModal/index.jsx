import Button from '../../core/button';
import Modal from '../../core/modal';
import TextField from '../../core/textField';
import { useGetPrescriptionReference } from '@paziresh24/hooks/prescription';
import { useForm } from 'react-hook-form';
import { useDrApp } from '@paziresh24/context/drapp';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router';
import { useState, useEffect } from 'react';

const ReferenceModal = ({ isOpen, onClose, nationalCodeDefaultValue }) => {
    const history = useHistory();
    const [info] = useDrApp();
    const getPrescriptionReference = useGetPrescriptionReference();
    const [nationalCode, setNationalCode] = useState('');
    const [trackingCode, setTrackingCode] = useState('');

    useEffect(() => {
        setNationalCode(nationalCodeDefaultValue);
    }, [nationalCodeDefaultValue]);

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
                code: data.trackingCode,
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
            <TextField
                type="tel"
                label="کدملی/کداتباع بیمار"
                name="nationalCode"
                value={nationalCode}
                onChange={e => setNationalCode(e.target.value)}
            />
            <TextField
                type="tel"
                label="کد پیگیری"
                name="code"
                value={trackingCode}
                onChange={e => setTrackingCode(e.target.value)}
            />
            <Button
                type="submit"
                variant="primary"
                block
                onClick={() => submitForm({ nationalCode, trackingCode })}
                loading={getPrescriptionReference.isLoading}
            >
                تایید
            </Button>
        </Modal>
    );
};

export default ReferenceModal;
