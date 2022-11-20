import { useDrApp } from '@paziresh24/context/drapp';
import { EditIcon } from '@paziresh24/shared/icon';
import Button from '@paziresh24/shared/ui/button';
import Modal from '@paziresh24/shared/ui/modal';
import TextField from '@paziresh24/shared/ui/textField';
import { useChangePhoneNumber } from 'apps/drapp/src/apis/changePhoneNumber/otp';
import { useUpdatePhoneNumber } from 'apps/drapp/src/apis/changePhoneNumber/update';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

export const ChangePhoneNumber = () => {
    const [isOpen, setIsOpen] = useState(false);
    const changePhoneNumberOtp = useChangePhoneNumber();
    const updatePhoneNumber = useUpdatePhoneNumber();

    const [
        {
            doctor: { cell }
        }
    ] = useDrApp();
    const [newPhoneNumber, setNewPhoneNumber] = useState('');
    const [isGetCode, setIsGetCode] = useState(false);
    const [code, setCode] = useState('');

    const handleOtp = useCallback(async () => {
        try {
            const data = await changePhoneNumberOtp.mutateAsync({
                username: newPhoneNumber
            });
            setIsGetCode(true);
        } catch (e) {
            toast.error(e.response.data.message);
        }
    }, [newPhoneNumber]);

    const handleUpdate = useCallback(async () => {
        try {
            const data = await updatePhoneNumber.mutateAsync({
                username: newPhoneNumber,
                password: code
            });
            localStorage.setItem('token', data.access_token);
            window.location.reload();
        } catch (e) {
            toast.error(e.response.data.message);
        }
    }, [newPhoneNumber, code]);

    return (
        <>
            <div className="flex space-s-2">
                <TextField label="شماره موبایل" type="tel" readOnly defaultValue={`0${cell}`} />
                <Button
                    variant="secondary"
                    onClick={e => {
                        e.preventDefault();
                        setIsGetCode(false);
                        setCode('');
                        setNewPhoneNumber('');
                        setIsOpen(true);
                    }}
                >
                    ویرایش
                </Button>
            </div>
            <Modal title="ویرایش شماره موبایل" isOpen={isOpen} onClose={setIsOpen}>
                <div className="flex flex-col space-y-3">
                    <TextField
                        autoFocus
                        label="شماره موبایل جدید"
                        type="tel"
                        value={newPhoneNumber}
                        disabled={isGetCode}
                        onChange={e => setNewPhoneNumber(e.target.value)}
                    />

                    {isGetCode && (
                        <>
                            <span className="text-sm">
                                کد ارسال شده به شماره موبایل جدید را وارد کنید.
                            </span>
                            <TextField
                                label="کد تایید"
                                type="tel"
                                value={code}
                                autoFocus
                                onChange={e => setCode(e.target.value)}
                            />
                        </>
                    )}
                    {!isGetCode && (
                        <Button block onClick={handleOtp} loading={changePhoneNumberOtp.isLoading}>
                            ارسال کد تایید
                        </Button>
                    )}
                    {isGetCode && (
                        <Button block onClick={handleUpdate} loading={updatePhoneNumber.isLoading}>
                            ویرایش شماره موبایل
                        </Button>
                    )}
                </div>
            </Modal>
        </>
    );
};

export default ChangePhoneNumber;
