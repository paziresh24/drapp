import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useDrApp } from '@paziresh24/context/drapp';
import FixedWrapBottom from '@paziresh24/shared/ui/fixedWrapBottom';
import PriceField from '@paziresh24/shared/ui/priceField';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';
import { addCommas, removeCommas } from '@persian-tools/persian-tools';
import { useConsultActivationStore } from 'apps/drapp/src/store/consultActivation.store';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

const CostConsultActivation = () => {
    const [{ doctor }] = useDrApp();
    const router = useHistory();
    const setPrice = useConsultActivationStore(state => state.setPrice);
    const price = useConsultActivationStore(state => state.price);
    const [fieldError, setFieldError] = useState(false);

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

        getSplunkInstance().sendEvent({
            group: 'activation-consult-cost',
            type: 'pricing',
            event: {
                action: 'avg-teammate',
                value: price * 10,
                avgPrice: 200000
            }
        });

        router.push(`/activation/consult/workhours`);
    };

    return (
        <Container
            maxWidth="sm"
            className="h-full md:h-auto md:p-5 rounded-md pt-4 bg-white md:mt-8 md:shadow-2xl md:shadow-slate-300 flex flex-col space-y-5"
        >
            <Typography>
                همکاران شما بصورت میانگین مبلغ{' '}
                <span className="font-medium">{addCommas(200000)}</span> تومان را در نظر گرفته اند.
            </Typography>
            <PriceField
                label="مبلغ هر ویزیت (تومان)"
                onChange={e => setPrice(+e.target.value)}
                value={price ? price.toString() : ''}
                placeholder={addCommas(200000)}
                limit={7}
                error={fieldError}
                helperText={fieldError ? 'لطفا مبلغ را وارد کنید.' : ''}
                onFocus={() => setFieldError(false)}
                fullWidth
                InputLabelProps={{
                    shrink: true
                }}
            />
            <div className="bg-[#FFFCF5] border-2 border-solid border-[#FFECC7] rounded-lg leading-6 p-3 text-sm font-medium">
                جهت دریافت مبالغ پرداختی بیماران، لطفا پس از تکمیل ثبت نام در قسمت تنظیمات پرداخت
                شماره کارت خود را وارد نمایید.
            </div>
            <FixedWrapBottom className="border-t border-solid !bottom-0 border-[#e8ecf0]">
                <Button fullWidth variant="contained" size="large" onClick={handleSubmit}>
                    ادامه
                </Button>
            </FixedWrapBottom>
        </Container>
    );
};

export default CostConsultActivation;
