import Button from '@mui/lab/LoadingButton';
import { useDrApp } from '@paziresh24/context/drapp';
import { addCommas } from '@persian-tools/persian-tools';
import { Fragment, useEffect, useState } from 'react';
import { useGetFinancial } from '../../apis/payment/getFinancial';
import { useSubmitSettlement } from '../../apis/payment/submitSettlement';
import { useConfirmSettlement } from '../../apis/payment/confirmSettlement';
import { toast } from 'react-toastify';
import TransactionCard from './transactionCard';
import axios from 'axios';
import CartInfo from './cartInfo';
import Modal from '@paziresh24/shared/ui/modal';
import { convertTimeStampToPersianDate } from '@paziresh24/shared/utils';
import Chips from '@paziresh24/shared/ui/chips';
import { useGetBooks } from '../../apis/booking/books';
import moment from 'jalali-moment';
import CONSULT_CENTER_ID from '@paziresh24/constants/consultCenterId';
import { useFeatureIsOn, useFeatureValue } from '@growthbook/growthbook-react';
import { Alert } from '@mui/material';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';

type Status =
    | 'system_reject'
    | 'request'
    | 'reject'
    | 'in_progress'
    | 'paid'
    | 'doctor_confirmation'
    | 'doctor_confirmation_reject'
    | 'failed_request'
    | 'unknown';

const nextYearDate = moment().add(1, 'jYear').unix();

const Financial = () => {
    const [{ center }] = useDrApp();
    const getfinancial = useGetFinancial({ centerId: center.id });
    const submitSettlement = useSubmitSettlement();
    const confirmSettlement = useConfirmSettlement();
    const [inquiryModal, setInquiryModal] = useState(false);
    const [deletedModal, setDeletedModal] = useState(false);
    const inventory =
        (getfinancial.data?.data?.doctor_share ?? 0) / 10 -
        (getfinancial.data?.data?.paid_cost ?? 0) / 10;
    const shouldShowDeletedNotice = useFeatureIsOn('payment:deleted-books-notice|enabled');
    const settlementWarning = useFeatureValue('payment:settlement-warning', {
        title: '',
        text: '',
        disabledSettlementButton: false
    });
    const unannouncedAppointmentsPopupDuringSettlement = useFeatureIsOn(
        'unannounced_appointments_popup_during_settlement'
    );
    const [unannouncedAppointmentsModal, setUnannouncedAppointmentsModal] = useState(false);

    useEffect(() => {
        getSplunkInstance().sendEvent({
            group: 'paziresh24-stock-button',
            type: 'paziresh24-stock-button-view'
        });
    }, []);

    const getBooks = useGetBooks(
        {
            center_id: center.id,
            from: 0,
            to: nextYearDate,
            payment_status: [4, 5, 6, 7],
            deleted_after: +(
                getfinancial.data?.data?.doctor_payments?.filter(
                    (item: any) => item.status === 'paid'
                )[0]?.send_request_at ?? ''
            ),
            inserted_before: +(
                getfinancial.data?.data?.doctor_payments?.filter(
                    (item: any) => item.status === 'paid'
                )[0]?.send_request_at ?? ''
            )
        },
        {
            enabled:
                !!getfinancial.data?.data &&
                center.id === CONSULT_CENTER_ID &&
                shouldShowDeletedNotice
        }
    );

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
                <div className="h-5 rounded-full w-36 bg-slate-300 animate-pulse" />
                <div className="rounded-lg h-96 bg-slate-300 animate-pulse" />
            </div>
        );

    const paymentStatus = {
        request: 'در انتظار پرداخت',
        reject: 'درخواست رد شده',
        in_progress: 'در صف پرداخت',
        paid: 'پرداخت شده',
        doctor_confirmation: 'در انتظار تایید درخواست توسط پزشک',
        doctor_confirmation_reject: 'رد شده توسط پزشک',
        failed_request: 'درخواست با خطا مواجه شده است',
        unknown: 'نا مشخص',
        system_reject: 'رد شده توسط سیستم'
    };

    const getTagStatusColor = (status: Status) => {
        switch (status) {
            case 'paid':
                return 'sucsess';
            case 'request':
            case 'in_progress':
                return 'gray';
            default:
                return 'error';
        }
    };

    return (
        <>
            <div className="flex flex-col space-y-4">
                {settlementWarning.text && (
                    <Alert severity="warning">
                        <div className="flex flex-col">
                            <span className="font-bold">{settlementWarning.title}</span>
                            <span>{settlementWarning.text}</span>
                        </div>
                    </Alert>
                )}
                <div className="p-5 space-s-4 bg-gradient-to-br from-[#4f4f8f] to-[#1A1D4E] h-32 flex justify-evenly items-stretch rounded-xl shadow-lg">
                    <div className="flex flex-col items-center justify-center h-full space-y-2">
                        <span className="text-sm text-white opacity-80">کل درآمد</span>
                        <span className="text-lg font-bold text-white">
                            {addCommas((getfinancial.data?.data?.doctor_share ?? 0) / 10)}
                        </span>
                        <span className="text-xs text-white">تومان</span>
                    </div>
                    <div className="bg-white w-[0.15rem] rounded-full opacity-20 h-30" />
                    <div className="flex flex-col items-center justify-center h-full space-y-2">
                        <span className="text-sm text-white opacity-80">پرداخت شده</span>
                        <span className="text-lg font-bold text-white">
                            {addCommas((getfinancial.data?.data?.paid_cost ?? 0) / 10)}
                        </span>
                        <span className="text-xs text-white">تومان</span>
                    </div>
                    <div className="bg-white w-[0.15rem] rounded-full opacity-20 h-30" />
                    <div className="flex flex-col items-center justify-center h-full space-y-2">
                        <span className="text-sm text-white opacity-80">موجودی</span>
                        <span className="text-lg font-bold text-white">{addCommas(inventory)}</span>
                        <span className="text-xs text-white"> تومان</span>
                    </div>
                </div>
                {!settlementWarning.disabledSettlementButton && (
                    <Button
                        variant="contained"
                        onClick={() => {
                            if (
                                unannouncedAppointmentsPopupDuringSettlement &&
                                center.id == CONSULT_CENTER_ID
                            )
                                return setUnannouncedAppointmentsModal(true);
                            return handleSubmit();
                        }}
                        loading={submitSettlement.isLoading}
                    >
                        درخواست تسویه حساب
                    </Button>
                )}
               {/* <a
                    href="https://www.sadrun.ir/paziresh24/"
                    target="_blank"
                    className="w-full"
                    onClick={() => {
                        getSplunkInstance().sendEvent({
                            group: 'paziresh24-stock-button',
                            type: 'paziresh24-stock-button-click'
                        });
                    }}
                >
                    <Button variant="contained" className="w-full">
                        پیوستن به جمع سهامداران پذیرش ۲۴
                    </Button>
                </a> */}
          

                {(getBooks.data as any)?.meta?.total > 0 && shouldShowDeletedNotice && (
                    <div className="p-4 bg-orange-100 rounded-md">
                        <span className="text-sm font-medium text-orange-700">
                            پزشک گرامی بعد از آخرین درخواست تسویه ی شما،{' '}
                            {(getBooks.data as any)?.meta?.total} نوبت به درخواست بیماران حذف و مبلغ
                            نوبت ها از مانده حساب شما کسر گردیده است.
                        </span>
                        <div
                            onClick={() => setDeletedModal(true)}
                            className="inline-block mr-1 text-sm font-medium text-orange-900 underline cursor-pointer"
                        >
                            مشاهده نوبت ها
                        </div>
                    </div>
                )}
                {getfinancial.data?.data?.doctor_payments?.length > 0 && (
                    <span className="text-sm font-bold">گزارش مالی</span>
                )}
                <div className="px-4 rounded-lg bg-slate-100">
                    {getfinancial.data?.data?.doctor_payments?.map(
                        (transaction: any, index: number, array: any[]) => (
                            <Fragment key={index}>
                                <TransactionCard
                                    amount={
                                        <>
                                            <div className="text-sm font-medium">
                                                {addCommas((+transaction.cost ?? 0) / 10)} تومان
                                            </div>
                                            <Chips
                                                theme={getTagStatusColor(
                                                    transaction.status as Status
                                                )}
                                                className="!p-0 !px-2"
                                            >
                                                {paymentStatus[transaction.status as Status]}
                                            </Chips>
                                        </>
                                    }
                                    date={convertTimeStampToPersianDate(
                                        transaction.send_request_at ?? transaction?.insert_at
                                    )}
                                    rowNumber={index + 1}
                                    detailes={{
                                        'وضعیت': paymentStatus[transaction.status as Status],
                                        'شماره شبا (کارت)': transaction.shaba,
                                        'کدپیگیری': transaction.tracker_id
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
            <Modal title="نوبت های حذف شده" isOpen={deletedModal} onClose={setDeletedModal}>
                <div className="flex flex-col space-y-3 overflow-auto h-96">
                    {getBooks.data?.data?.map((item: any) => (
                        <div
                            key={item.id}
                            className="flex flex-col p-4 space-y-1 border border-solid rounded-md border-slate-100"
                        >
                            <span className="font-semibold">{item.display_name}</span>
                            <div className="flex text-sm space-s-2">
                                <span>
                                    زمان نوبت:{' '}
                                    {moment(item.from * 1000)
                                        .locale('fa')
                                        .format('jYYYY/jMM/jDD HH:mm')}
                                </span>
                                <span>کدپیگیری: {item.ref_id}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </Modal>
            <Modal
                title=""
                noHeader
                noBodyPadding
                isOpen={unannouncedAppointmentsModal}
                onClose={setUnannouncedAppointmentsModal}
                fullPage
            >
                <iframe
                    src="https://opium-dashboard.paziresh24.com/uncertain-book-status-list/"
                    frameBorder="0"
                    className="h-full"
                ></iframe>
                <div className="min-h-[4rem] flex gap-3 p-4 border-t border-solid border-slate-200">
                    <Button
                        loading={submitSettlement.isLoading}
                        onClick={() => {
                            setUnannouncedAppointmentsModal(false);
                            handleSubmit();
                        }}
                        variant="contained"
                        fullWidth
                    >
                        تسویه حساب
                    </Button>
                    <Button
                        onClick={() => setUnannouncedAppointmentsModal(false)}
                        variant="outlined"
                        fullWidth
                    >
                        انصراف
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export default Financial;
