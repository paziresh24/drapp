import Button from '@mui/lab/LoadingButton';
import { useDrApp } from '@paziresh24/context/drapp';
import { addCommas } from '@persian-tools/persian-tools';
import { Fragment, useState } from 'react';
import { useGetFinancial } from '../../apis/payment/getFinancial';
import { useSubmitSettlement } from '../../apis/payment/submitSettlement';
import { useConfirmSettlement } from '../../apis/payment/confirmSettlement';
import { toast } from 'react-toastify';
import Transaction from './transaction';
import axios from 'axios';
import CartInfo from './cartInfo';
import Modal from '@paziresh24/shared/ui/modal';

const Financial = () => {
    const [{ center }] = useDrApp();
    const getfinancial = useGetFinancial({ centerId: center.id });
    const submitSettlement = useSubmitSettlement();
    const confirmSettlement = useConfirmSettlement();
    const [inquiryModal, setInquiryModal] = useState(false);
    const inventory =
        (getfinancial.data?.data?.doctor_share ?? 0) / 10 -
        (getfinancial.data?.data?.paid_cost ?? 0) / 10;

    const handleSubmit = async () => {
        try {
            await submitSettlement.mutateAsync({ centerId: center.id });
            setInquiryModal(true);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message);
            }
        }
    };
    const handleConfirm = async (confirm: boolean) => {
        try {
            const data = await confirmSettlement.mutateAsync({
                centerId: center.id,
                detailes: {
                    confirm_code: submitSettlement.data?.data.confirmation_code,
                    is_confirm: confirm ? 1 : 0
                }
            });
            setInquiryModal(false);
            toast[confirm ? 'success' : 'error']((data as any)?.message);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message);
            }
        }
    };
    if (getfinancial.isLoading || getfinancial.isError)
        return (
            <div className="flex flex-col space-y-4">
                <div className="h-32 rounded-xl bg-slate-300 animate-pulse" />
                <div className="h-5 w-36 rounded-full bg-slate-300 animate-pulse" />
                <div className="h-96 rounded-lg bg-slate-300 animate-pulse" />
            </div>
        );

    return (
        <>
            <div className="flex flex-col space-y-4">
                <div className="p-5 space-s-4 bg-gradient-to-br from-[#4f4f8f] to-[#1A1D4E] h-32 flex justify-evenly items-stretch rounded-xl shadow-lg">
                    <div className="space-y-2 h-full flex flex-col justify-center items-center">
                        <span className="text-sm text-white opacity-80">کل درآمد</span>
                        <span className="text-lg font-bold text-white">
                            {addCommas((getfinancial.data?.data?.doctor_share ?? 0) / 10)}
                        </span>
                        <span className="text-xs text-white">تومان</span>
                    </div>
                    <div className="bg-white w-[0.15rem] rounded-full opacity-20 h-30" />
                    <div className="space-y-2 h-full flex flex-col justify-center items-center">
                        <span className="text-sm text-white opacity-80">پرداخت شده</span>
                        <span className="text-lg font-bold text-white">
                            {addCommas((getfinancial.data?.data?.paid_cost ?? 0) / 10)}
                        </span>
                        <span className="text-xs text-white">تومان</span>
                    </div>
                    <div className="bg-white w-[0.15rem] rounded-full opacity-20 h-30" />
                    <div className="space-y-2 h-full flex flex-col justify-center items-center">
                        <span className="text-sm text-white opacity-80">موجودی</span>
                        <span className="text-lg font-bold text-white">{addCommas(inventory)}</span>
                        <span className="text-xs text-white"> تومان</span>
                    </div>
                </div>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    loading={submitSettlement.isLoading}
                >
                    درخواست تسویه حساب
                </Button>
                {getfinancial.data?.data?.doctor_payments?.length && (
                    <span className="text-sm font-bold">گزارش مالی</span>
                )}
                <div className="rounded-lg bg-slate-200 px-4">
                    {getfinancial.data?.data?.doctor_payments?.map(
                        (transaction: any, index: number, array: any[]) => (
                            <Fragment key={index}>
                                <Transaction
                                    amount={transaction.cost}
                                    date={transaction.jalali_date_time}
                                    rowNumber={index + 1}
                                    status={transaction.status}
                                    detailes={{
                                        shaba: transaction.shaba,
                                        settlementDate: transaction.send_request_at,
                                        trackerId: transaction.tracker_id
                                    }}
                                />
                                {array.length !== index + 1 && <hr className="border-slate-300" />}
                            </Fragment>
                        )
                    )}
                </div>
            </div>
            <Modal
                title="تایید اطلاعات"
                onClose={() => {
                    setInquiryModal(false);
                    handleConfirm(false);
                }}
                isOpen={inquiryModal}
            >
                <span>آیا اطلاعات حساب مورد تایید می باشد؟ </span>
                <CartInfo
                    info={{
                        bank_name: submitSettlement.data?.data?.shaba_inquiry?.bank,
                        deposit_owners:
                            submitSettlement.data?.data?.shaba_inquiry?.accountOwnersList?.map(
                                (item: any) => `${item.firstName} ${item.lastName}`
                            ),
                        shaba: submitSettlement.data?.data?.shaba,
                        amount_payable: `${addCommas(inventory)} تومان`,
                        account_number: submitSettlement.data?.data?.shaba_inquiry?.accountNumber,
                        account_status: submitSettlement.data?.data?.shaba_inquiry?.accountStatus
                    }}
                />
                <div className="flex mt-1 space-s-3">
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={() => handleConfirm(true)}
                        loading={confirmSettlement.isLoading}
                    >
                        تایید
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => handleConfirm(false)}
                        loading={confirmSettlement.isLoading}
                    >
                        رد کردن
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export default Financial;
