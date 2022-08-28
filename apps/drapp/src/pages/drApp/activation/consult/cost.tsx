import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useDrApp } from '@paziresh24/context/drapp';
import FixedWrapBottom from '@paziresh24/shared/ui/fixedWrapBottom';
import PriceField from '@paziresh24/shared/ui/priceField';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';
import { addCommas, removeCommas } from '@persian-tools/persian-tools';
import { useConsultActivationStore } from 'apps/drapp/src/store/consultActivation.store';
import { round } from 'lodash';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { costs } from './costAvg';

const CostConsultActivation = () => {
    const [{ doctor }] = useDrApp();
    const router = useHistory();
    const setPrice = useConsultActivationStore(state => state.setPrice);
    const price = useConsultActivationStore(state => state.price);
    const [fieldError, setFieldError] = useState(false);

    const priceExpertise = costs.find(
        cost => +cost.expertiseId === +doctor.expertises[0].expertise.id
    )?.avg;
    const priceAvarage = priceExpertise ? round(Math.floor(+priceExpertise), -3) / 10 : 0;

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
                avgPrice: priceAvarage
            }
        });

        router.push(`/activation/consult/workhours`);
    };

    return (
        <Container
            maxWidth="sm"
            className="h-full md:h-auto md:p-5 rounded-md pt-4 bg-white md:mt-8 md:shadow-2xl md:shadow-slate-300 flex flex-col space-y-5"
        >
            <Alert icon={false} className="!bg-[#F3F6F9]">
                <Typography fontSize="0.9rem" fontWeight="medium">
                    لازم به ذکر است 30 درصد از مبلغ تعیین شده به پذیرش24 اختصاص می یابد.
                </Typography>
            </Alert>
            {priceAvarage ? (
                <Typography>
                    همکاران شما بصورت میانگین مبلغ{' '}
                    <span className="font-medium">{addCommas(priceAvarage)}</span> تومان را در نظر
                    گرفته اند.
                </Typography>
            ) : null}
            <PriceField
                label="مبلغ هر ویزیت (تومان)"
                onChange={e => setPrice(+e.target.value)}
                value={price ? price.toString() : ''}
                limit={7}
                error={fieldError}
                helperText={fieldError ? 'لطفا مبلغ را وارد کنید.' : ''}
                onFocus={() => setFieldError(false)}
                fullWidth
            />
            <FixedWrapBottom className="border-t border-solid !bottom-0 border-[#e8ecf0]">
                <Button fullWidth variant="contained" size="large" onClick={handleSubmit}>
                    ادامه
                </Button>
            </FixedWrapBottom>
        </Container>
    );
};

export default CostConsultActivation;
