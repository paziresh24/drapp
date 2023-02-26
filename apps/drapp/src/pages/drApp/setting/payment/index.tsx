import { PaymentForm } from 'apps/drapp/src/components/payment/form';
import { usePaymentForm } from 'apps/drapp/src/components/payment/usePaymentForm';
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
import CartInfo from 'apps/drapp/src/components/payment/cartInfo';
import { useIbanInquiry } from 'apps/drapp/src/apis/payment/ibanInquiry';
import { useGetPaymentSetting } from 'apps/drapp/src/apis/payment/getPaymentSetting';
import { Tab, Tabs } from '@mui/material';
import Financial from 'apps/drapp/src/components/payment/finacial';
import { useHistory, useLocation } from 'react-router-dom';

const PaymentPage = () => {
    const [{ doctor, center }] = useDrApp();
    const router = useHistory();
    const location = useLocation();
    const { validate, submit, isLoading, ...formProps } = usePaymentForm();
    const [shouldShowTipCostModal, setShouldShowTipCostModal] = useState(false);
    const centerType = center.id === CONSULT_CENTER_ID ? 'consult' : 'office';
    const getSetting = usePaymentSettingStore(state => state.setting);
    const [inquiryModal, setInquiryModal] = useState(false);
    const ibanInquiry = useIbanInquiry({
        card_number: formProps.cartNumber ?? ''
    });
    const getPaymentSetting = useGetPaymentSetting({ center_id: center?.id });
    const [tab, setTab] = useState(getSetting.active ? 0 : 1);

    useEffect(() => {
        getPaymentSetting.remove();
        getPaymentSetting.refetch();
        setTab(getSetting.active ? 0 : 1);
    }, [center, getSetting.active]);

    useEffect(() => {
        if (ibanInquiry.isSuccess) {
            setInquiryModal(true);
            setShouldShowTipCostModal(false);
        }
    }, [ibanInquiry.status]);

    useEffect(() => {
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

    const handleSubmit = async ({ isActivePayment = true }: { isActivePayment?: boolean }) => {
        submit({
            centerId: center.id,
            bankName: (ibanInquiry.data as any)?.bank_name,
            IBAN: (ibanInquiry.data as any)?.IBAN,
            depositOwners: (ibanInquiry.data as any)?.deposit_owners?.join(','),
            isActivePayment
        })
            .then(() => {
                if (isActivePayment) {
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
                    if (location.search.includes('active-payment-popup'))
                        getSplunkInstance().sendEvent({
                            group: 'payment-popup',
                            type: 'active-payment-now',
                            event: {
                                action: 'payment-activation-done'
                            }
                        });
                }
                getSplunkInstance().sendEvent({
                    group: `setting-payment-${centerType}`,
                    type: 'save',
                    event: { value: isActivePayment ? 'active' : 'deActive' }
                });
                toast.success(
                    isActivePayment
                        ? 'تنظیمات پرداخت شما با موفقیت ثبت شد.'
                        : 'تنظیمات پرداخت بیعانه شما غیرفعال شد.'
                );
                router.push('/');
                setInquiryModal(false);
                ibanInquiry.remove();
            })
            .catch(error => {
                getSplunkInstance().sendEvent({
                    group: `setting-payment-${centerType}`,
                    type: 'unsuccessful-save',
                    event: {
                        error: error.response?.data?.message
                    }
                });
                setInquiryModal(false);
            });
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    return (
        <Container
            maxWidth="sm"
            className="flex flex-col h-full !px-4 pt-2 md:pt-1 bg-white rounded-md md:h-auto md:p-5 md:mt-8 md:shadow-2xl md:shadow-slate-300"
        >
            <Tabs
                variant="fullWidth"
                className="border-b border-solid border-slate-200"
                onChange={handleTabChange}
                value={tab}
            >
                <Tab label="گزارش مالی" disabled={!getSetting.active} />
                <Tab label="تنظیمات" />
            </Tabs>

            <div className="px-0 pt-4">
                {tab === 0 && <Financial />}
                {tab === 1 && (
                    <div className="flex flex-col space-y-5">
                        {center.id !== CONSULT_CENTER_ID && (
                            <>
                                <Alert icon={false} className="!bg-[#F3F6F9]">
                                    <Typography fontSize="0.9rem" fontWeight="medium">
                                        دریافت بیعانه به هنگام ثبت نوبت اینترنتی باعث می شود کسانی
                                        که نوبت گرفته اند، مقید به حضور حتمی و به موقع در مطب شوند.
                                    </Typography>
                                </Alert>

                                <Typography className="!leading-8">
                                    همکاران شما بصورت میانگین مبلغ{' '}
                                    <span className="font-medium">{addCommas(10000)}</span> تومان را
                                    در نظر گرفته اند.
                                </Typography>
                            </>
                        )}
                        <PaymentForm
                            {...formProps}
                            selectBoxPrice={center.id !== CONSULT_CENTER_ID}
                            priceLable={
                                center.id !== CONSULT_CENTER_ID ? 'قیمت بیعانه' : 'مبلغ ویزیت'
                            }
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
                                loading={isLoading || ibanInquiry.isLoading}
                                onClick={() => {
                                    if (validate()) {
                                        getSplunkInstance().sendEvent({
                                            group: `setting-payment-${centerType}`,
                                            type: 'continue '
                                        });
                                        if (center.id !== CONSULT_CENTER_ID)
                                            return setShouldShowTipCostModal(true);

                                        ibanInquiry.remove();
                                        ibanInquiry.refetch();
                                    }
                                }}
                            >
                                {center.id !== CONSULT_CENTER_ID ? 'فعالسازی' : 'ذخیره'}
                            </Button>
                            {center.id !== CONSULT_CENTER_ID && (
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    className="grayscale opacity-90"
                                    size="large"
                                    loading={isLoading || ibanInquiry.isLoading}
                                    onClick={() => {
                                        handleSubmit({
                                            isActivePayment: false
                                        });
                                    }}
                                >
                                    انصراف
                                </Button>
                            )}
                        </FixedWrapBottom>
                        <Modal
                            title="نکات بیعانه"
                            noHeader
                            onClose={setShouldShowTipCostModal}
                            isOpen={shouldShowTipCostModal}
                        >
                            <ul className="pr-4 space-y-2 list-disc">
                                <li>
                                    بیمار در صورتی موفق به اخذ نوبت می شود که بیعانه را پرداخت
                                    نماید.
                                </li>
                                <li>
                                    اسامی بیمارانی که در لیست بیماران مشاهده می کنید تماما پرداخت
                                    بیعانه را انجام داده اند.
                                </li>
                                <li>
                                    در صورتی که بیمار نوبت خود را تا 5 ساعت پیش از ساعت نوبت لغو
                                    نماید، وجه پرداختی بیمار استرداد می گردد.
                                </li>
                            </ul>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    ibanInquiry.remove();
                                    ibanInquiry.refetch();
                                }}
                                loading={ibanInquiry.isLoading}
                            >
                                تایید
                            </Button>
                        </Modal>
                        <Modal
                            title="تایید اطلاعات"
                            onClose={() => {
                                setInquiryModal(false);
                                ibanInquiry.remove();
                            }}
                            isOpen={inquiryModal}
                        >
                            <span>آیا اطلاعات حساب مورد تایید می باشد؟ </span>
                            <CartInfo info={ibanInquiry.data} />
                            <div className="flex mt-1 space-s-3">
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={() => handleSubmit({})}
                                    loading={isLoading}
                                >
                                    تایید
                                </Button>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={() => {
                                        ibanInquiry.remove();
                                        setInquiryModal(false);
                                    }}
                                >
                                    ویرایش
                                </Button>
                            </div>
                        </Modal>
                    </div>
                )}
            </div>
        </Container>
    );
};

export default PaymentPage;
