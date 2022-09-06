import Button from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useDrApp } from '@paziresh24/context/drapp';
import FixedWrapBottom from '@paziresh24/shared/ui/fixedWrapBottom';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';
import { addCommas, numberToWords, removeCommas } from '@persian-tools/persian-tools';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Modal from '@paziresh24/shared/ui/modal';
import { PaymentForm } from 'apps/drapp/src/components/molecules/payment/form';
import { usePaymentForm } from 'apps/drapp/src/components/molecules/payment/usePaymentForm';
import { useIbanInquiry } from 'apps/drapp/src/apis/payment/ibanInquiry';
import CartInfo from 'apps/drapp/src/components/molecules/payment/cartInfo';

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
    const [inquiryModal, setInquiryModal] = useState(false);
    const ibanInquiry = useIbanInquiry({
        card_number: formProps.cartNumber ?? ''
    });

    useEffect(() => {
        if (ibanInquiry.isSuccess) {
            setInquiryModal(true);
            setShouldShowTipCostModal(false);
        }
    }, [ibanInquiry.status]);

    const handleSubmit = async () => {
        submit({
            centerId: officeCenter.id,
            bankName: (ibanInquiry.data as any)?.bank_name,
            IBAN: (ibanInquiry.data as any)?.IBAN,
            depositOwners: (ibanInquiry.data as any)?.deposit_owners?.join(',')
        })
            .then(() => {
                if (formProps.isActivePayment) {
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
                    event: { value: formProps.isActivePayment ? 'active' : 'deActive' }
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
                setInquiryModal(false);
            });
    };

    return (
        <>
            <Container
                maxWidth="sm"
                className="h-full md:h-auto md:p-5 rounded-md pt-4 bg-white md:mt-8 md:shadow-2xl md:shadow-slate-300 flex flex-col space-y-5"
            >
                <Alert icon={false} className="!bg-[#F3F6F9]">
                    <Typography fontSize="0.9rem" fontWeight="medium">
                        بیش از 80 درصد بیمارانی که در هنگام دریافت نوبت، بیعانه پرداخت می کنند، در
                        مطب حاضر می شوند.
                    </Typography>
                </Alert>

                <Typography className="!leading-8">
                    همکاران شما بصورت میانگین مبلغ{' '}
                    <span className="font-medium">{addCommas(10000)}</span> تومان را در نظر گرفته
                    اند.
                </Typography>

                <PaymentForm
                    {...formProps}
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

                <FixedWrapBottom className="border-t border-solid !bottom-0 border-[#e8ecf0]">
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        loading={isLoading}
                        onClick={() => {
                            if (validate()) {
                                getSplunkInstance().sendEvent({
                                    group: 'activation-office-center',
                                    type: 'continue '
                                });
                                if (formProps.isActivePayment)
                                    return setShouldShowTipCostModal(true);
                                handleSubmit();
                            }
                        }}
                    >
                        ادامه
                    </Button>
                </FixedWrapBottom>
            </Container>
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
                <Button
                    variant="outlined"
                    onClick={() => {
                        ibanInquiry.remove();
                        ibanInquiry.refetch();
                    }}
                    loading={ibanInquiry.isLoading}
                >
                    ذخیره
                </Button>
            </Modal>
            <Modal title="تایید اطلاعات" onClose={setInquiryModal} isOpen={inquiryModal}>
                <span>آیا اطلاعات حساب مورد تایید می باشد؟ </span>
                <CartInfo info={ibanInquiry.data} />
                <div className="flex space-s-3 mt-1">
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleSubmit}
                        loading={isLoading}
                    >
                        تایید
                    </Button>
                    <Button fullWidth variant="outlined" onClick={() => setInquiryModal(false)}>
                        ویرایش
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export default CostConsultActivation;
