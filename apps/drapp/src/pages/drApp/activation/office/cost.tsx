import Button from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useDrApp } from '@paziresh24/context/drapp';
import FixedWrapBottom from '@paziresh24/shared/ui/fixedWrapBottom';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';
import { addCommas } from '@persian-tools/persian-tools';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Modal from '@paziresh24/shared/ui/modal';
import { PaymentForm } from '../../../../components/payment/form';
import { usePaymentForm } from '../../../../components/payment/usePaymentForm';
import { useIbanInquiry } from 'apps/drapp/src/apis/payment/ibanInquiry';
import CartInfo from '../../../../components/payment/cartInfo';

const CostConsultActivation = () => {
    const [doctorInfo]: [
        {
            centers: any[];
            center: any;
        },
        any
    ] = useDrApp();
    const router = useHistory();
    const officeCenter = doctorInfo?.centers.find(center => center.type_id === 1);
    const [shouldShowTipCostModal, setShouldShowTipCostModal] = useState(false);
    const { validate, submit, isLoading, ...formProps } = usePaymentForm();

    const handleSubmit = async ({ isActivePayment = true }: { isActivePayment?: boolean }) => {
        submit({
            centerId: officeCenter.id,
            isActivePayment
        })
            .then(() => {
                if (isActivePayment) {
                    getSplunkInstance().sendEvent({
                        group: 'activation-office-center',
                        type: 'price-value',
                        event: { value: +formProps.price * 10, action: 'done' }
                    });
                    getSplunkInstance().sendEvent({
                        group: 'activation-office-center',
                        type: 'enter-cardnum',
                        event: { action: 'done' }
                    });
                }
                getSplunkInstance().sendEvent({
                    group: 'activation-office-center',
                    type: 'save',
                    event: { value: isActivePayment ? 'active' : 'deActive' }
                });
                router.push(`/activation/office/duration`);
            })
            .catch(error => {
                getSplunkInstance().sendEvent({
                    group: 'activation-office-center',
                    type: 'unsuccessful-save',
                    event: {
                        error: error.response?.data?.message
                    }
                });
                setShouldShowTipCostModal(false);
            });
    };

    return (
        <>
            <Container
                maxWidth="sm"
                className="flex flex-col h-full pt-4 space-y-5 bg-white rounded-md md:h-auto md:p-5 md:mt-8 md:shadow-2xl md:shadow-slate-300"
            >
                <Alert icon={false} className="!bg-[#F3F6F9]">
                    <Typography fontSize="0.9rem" fontWeight="medium">
                        دریافت بیعانه به هنگام ثبت نوبت اینترنتی باعث می شود کسانی که نوبت گرفته
                        اند، مقید به حضور حتمی و به موقع در مطب شوند.
                    </Typography>
                </Alert>

                <Typography className="!leading-8">
                    همکاران شما بصورت میانگین مبلغ{' '}
                    <span className="font-medium">{addCommas(50000)}</span> تومان را در نظر گرفته
                    اند.
                </Typography>

                <PaymentForm
                    {...formProps}
                    priceLable="قیمت بیعانه"
                    showBankNumberField={false}
                    clickPriceFiled={() =>
                        getSplunkInstance().sendEvent({
                            group: 'activation-office-center',
                            type: 'price-value',
                            event: { action: 'click' }
                        })
                    }
                    clickCartNumberFiled={() =>
                        getSplunkInstance().sendEvent({
                            group: 'activation-office-center',
                            type: 'enter-cardnum',
                            event: { action: 'click' }
                        })
                    }
                />
                <div className="bg-[#FFFCF5] border-2 border-solid border-[#FFECC7] rounded-lg leading-6 p-3 text-sm font-medium">
                    جهت دریافت مبالغ پرداختی بیعانه بیماران، لطفا پس از تکمیل ثبت نام، در قسمت
                    تنظیمات پرداخت، شماره کارت خود را وارد نمایید.
                </div>

                <FixedWrapBottom className="border-t border-solid !bottom-0 border-[#e8ecf0]">
                    <div className="flex w-full space-s-3">
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            loading={isLoading}
                            onClick={() => {
                                if (validate({ cardNumberValidate: false })) {
                                    getSplunkInstance().sendEvent({
                                        group: 'activation-office-center',
                                        type: 'continue '
                                    });
                                    setShouldShowTipCostModal(true);
                                }
                            }}
                        >
                            ادامه
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            className="grayscale opacity-90"
                            size="large"
                            loading={isLoading}
                            onClick={() => {
                                handleSubmit({
                                    isActivePayment: false
                                });
                            }}
                        >
                            انصراف
                        </Button>
                    </div>
                </FixedWrapBottom>
            </Container>
            <Modal
                title="نکات بیعانه"
                noHeader
                onClose={setShouldShowTipCostModal}
                isOpen={shouldShowTipCostModal}
            >
                <ul className="pr-4 space-y-2 list-disc">
                    <li>بیمار در صورتی موفق به اخذ نوبت می شود که بیعانه را پرداخت نماید.</li>
                    <li>
                        اسامی بیمارانی که در لیست بیماران مشاهده می کنید تماما پرداخت بیعانه را
                        انجام داده اند.
                    </li>
                    <li>
                        در صورتی که بیمار نوبت خود را تا 5 ساعت پیش از ساعت نوبت لغو نماید، وجه
                        پرداختی بیمار استرداد می گردد.
                    </li>
                </ul>
                <Button variant="outlined" onClick={() => handleSubmit({})} loading={isLoading}>
                    ذخیره
                </Button>
            </Modal>
        </>
    );
};

export default CostConsultActivation;
