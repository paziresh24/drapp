import { PaymentForm } from 'apps/drapp/src/components/molecules/payment/form';
import { usePaymentForm } from 'apps/drapp/src/components/molecules/payment/usePaymentForm';
import Button from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { addCommas } from '@persian-tools/persian-tools';
import FixedWrapBottom from '@paziresh24/shared/ui/fixedWrapBottom';
import Modal from '@paziresh24/shared/ui/modal';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDrApp } from '@paziresh24/context/drapp';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';
import CONSULT_CENTER_ID from '@paziresh24/constants/consultCenterId';
import { usePaymentSettingStore } from 'apps/drapp/src/store/paymentSetting.store';

const PaymentPage = () => {
    const [{ center }] = useDrApp();
    const { validate, submit, isLoading, ...formProps } = usePaymentForm();
    const [shouldShowTipCostModal, setShouldShowTipCostModal] = useState(false);
    const centerType = center.id === CONSULT_CENTER_ID ? 'consult' : 'office';
    const getSetting = usePaymentSettingStore(state => state.setting);

    useEffect(() => {
        console.log(getSetting);
        if (getSetting?.active) {
            formProps.setCartNumber(getSetting?.card_number);
            formProps.setPrice(
                getSetting?.deposit_amount ? (+getSetting?.deposit_amount / 10)?.toString() : ''
            );
            return;
        }
        formProps.setCartNumber('');
        formProps.setPrice('');
    }, [getSetting]);

    const handleSubmit = async () => {
        submit({
            centerId: center.id
        })
            .then(() => {
                if (formProps.isActivePayment) {
                    getSplunkInstance().sendEvent({
                        group: `setting-payment-${centerType}`,
                        type: 'price-value',
                        event: { value: +formProps.price * 10, action: 'done' }
                    });
                    getSplunkInstance().sendEvent({
                        group: `setting-payment-${centerType}`,
                        type: 'enter-cardnum',
                        event: { action: 'done' }
                    });
                }
                getSplunkInstance().sendEvent({
                    group: `setting-payment-${centerType}`,
                    type: 'save',
                    event: { value: formProps.isActivePayment ? 'active' : 'deActive' }
                });
                toast.success('تنظیمات پرداخت شما با موفقیت ثبت شد.');
                setShouldShowTipCostModal(false);
            })
            .catch(error => {
                getSplunkInstance().sendEvent({
                    group: `setting-payment-${centerType}`,
                    type: 'unsuccessful-save',
                    event: {
                        error: error.response?.data?.message
                    }
                });
                setShouldShowTipCostModal(false);
            });
    };

    return (
        <Container
            maxWidth="sm"
            className="h-full md:h-auto md:p-5 rounded-md pt-4 bg-white md:mt-8 md:shadow-2xl md:shadow-slate-300 flex flex-col space-y-5"
        >
            {center.id !== CONSULT_CENTER_ID && (
                <>
                    <Alert icon={false} className="!bg-[#F3F6F9]">
                        <Typography fontSize="0.9rem" fontWeight="medium">
                            بیش از 80 درصد بیمارانی که در هنگام دریافت نوبت، بیعانه پرداخت می کنند،
                            در مطب حاضر می شوند.
                        </Typography>
                    </Alert>

                    <Typography className="!leading-8">
                        همکاران شما بصورت میانگین مبلغ{' '}
                        <span className="font-medium">{addCommas(10000)}</span> تومان را در نظر
                        گرفته اند.
                    </Typography>
                </>
            )}

            <PaymentForm
                {...formProps}
                toggleable={center.id !== CONSULT_CENTER_ID}
                clickPriceFiled={() =>
                    getSplunkInstance().sendEvent({
                        group: `setting-payment-${centerType}`,
                        type: 'price-value',
                        event: { action: 'click' }
                    })
                }
                clickCartNumberFiled={() =>
                    getSplunkInstance().sendEvent({
                        group: `setting-payment-${centerType}`,
                        type: 'enter-cardnum',
                        event: { action: 'click' }
                    })
                }
            />

            <FixedWrapBottom className="border-t border-solid border-[#e8ecf0]">
                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    loading={isLoading}
                    onClick={() => {
                        if (validate()) {
                            getSplunkInstance().sendEvent({
                                group: `setting-payment-${centerType}`,
                                type: 'continue '
                            });
                            if (center.id !== CONSULT_CENTER_ID && formProps.isActivePayment)
                                return setShouldShowTipCostModal(true);
                            handleSubmit();
                        }
                    }}
                >
                    ذخیره
                </Button>
            </FixedWrapBottom>
            <Modal
                title="نکات بیعانه"
                noHeader
                onClose={setShouldShowTipCostModal}
                isOpen={shouldShowTipCostModal}
            >
                <ul className="list-disc pr-4 space-y-2">
                    <li>بیمار در صورتی موفق به اخذ نوبت می شود که بیعانه را پرداخت نماید.</li>
                    <li>
                        اسامی بیمارانی ک در لیست بیماران مشاهده می کنید تماما پرداخت بیعانه را انجام
                        داده اند.
                    </li>
                    <li>
                        در صورتی که بیمار نوبت خود را تا 24 ساعت پیش از ساعت نوبت لغو نماید، وجه
                        پرداختی بیمار استرداد می گردد.
                    </li>
                    <li>مبالغ به صورت روزانه به شماره کارت درج شده واریز می گردد.</li>
                </ul>
                <Button variant="outlined" onClick={handleSubmit} loading={isLoading}>
                    تایید
                </Button>
            </Modal>
        </Container>
    );
};

export default PaymentPage;
