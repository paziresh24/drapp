import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useDrApp } from '@paziresh24/context/drapp';
import FixedWrapBottom from '@paziresh24/shared/ui/fixedWrapBottom';
import BankNumberField from '@paziresh24/shared/ui/bankNumberField';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';
import { addCommas, numberToWords, removeCommas } from '@persian-tools/persian-tools';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Autocomplete, Checkbox, FormControl, FormControlLabel, TextField } from '@mui/material';
import Modal from '@paziresh24/shared/ui/modal';

const costs = [
    {
        label: '10,000 تومان',
        value: '10000'
    },
    {
        label: '20,000 تومان',
        value: '20000'
    },
    {
        label: '30,000 تومان',
        value: '30000'
    },
    {
        label: '40,000 تومان',
        value: '40000'
    },
    {
        label: '50,000 تومان',
        value: '50000'
    },
    {
        label: '100,000 تومان',
        value: '100000'
    }
];

const CostConsultActivation = () => {
    const router = useHistory();
    const [price, setPrice] = useState('');
    const [fieldError, setFieldError] = useState(false);
    const [cartNumber, setCartNumber] = useState('');
    const [shouldShowTipCostModal, setShouldShowTipCostModal] = useState(false);

    const handleSubmit = () => {
        if (!+price) {
            setFieldError(true);
            return;
        }
        getSplunkInstance().sendEvent({
            group: 'activation-consult-cost',
            type: 'pricing',
            event: {
                action: 'done'
            }
        });
        router.push(`/activation/office/duration`);
    };

    console.log(price);

    return (
        <>
            <Container
                maxWidth="sm"
                className="h-full md:h-auto md:p-5 rounded-md pt-4 bg-white md:mt-8 md:shadow-2xl md:shadow-slate-300 flex flex-col space-y-5"
            >
                <Alert icon={false} className="!bg-[#F3F6F9]">
                    <Typography fontSize="0.9rem" fontWeight="medium">
                        بیش از 80 درصد بیمارانی که در هنگام دریافت نوبت، بیعانه پرداخت می کنند، در
                        مطب حاظر می شوند.
                    </Typography>
                </Alert>

                <Typography className="!leading-8">
                    همکاران شما بصورت میانگین مبلغ{' '}
                    <span className="font-medium">{addCommas(10000)}</span> تومان را در نظر گرفته
                    اند.
                </Typography>
                <FormControl className="space-y-4 w-full">
                    <Autocomplete
                        disablePortal
                        options={costs}
                        fullWidth
                        onChange={(e, newValue) => {
                            setPrice(newValue?.value ?? '');
                        }}
                        onFocus={() => setFieldError(false)}
                        renderInput={params => (
                            <TextField
                                {...params}
                                error={fieldError}
                                label="مبلغ بیعانه"
                                helperText={
                                    fieldError
                                        ? 'لطفا مبلغ را وارد کنید.'
                                        : price
                                        ? `${numberToWords(+price)} تومان`
                                        : ''
                                }
                            />
                        )}
                    />
                    <BankNumberField
                        onChange={e => setCartNumber(e.target.value)}
                        value={cartNumber}
                        fullWidth
                    />
                    <FormControlLabel
                        control={<Checkbox />}
                        label="تمایل به فعالسازی بیعانه ندارم."
                    />
                </FormControl>

                <FixedWrapBottom className="border-t border-solid !bottom-0 border-[#e8ecf0]">
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        onClick={() => setShouldShowTipCostModal(true)}
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
                <Button variant="outlined">ذخیره</Button>
            </Modal>
        </>
    );
};

export default CostConsultActivation;
