import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import FixedWrapBottom from '@paziresh24/shared/ui/fixedWrapBottom';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';
import EditMessenger from 'apps/drapp/src/components/onlineVisit/editMessenger';
import { useConsultActivationStore } from 'apps/drapp/src/store/consultActivation.store';
import { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useActivationStore } from '../activation.store';

const ConsultMessenger = () => {
    const messengerRef = useRef<any>('');
    const router = useHistory();
    const setMessenger = useConsultActivationStore(state => state.setMessenger);
    const setSelectedService = useActivationStore(state => state.setSelectedService);

    useEffect(() => {
        setSelectedService(prev => prev.filter(service => service !== 'consult'));
    }, []);

    const handleSubmit = () => {
        const { eitaaNumber, whatsappNumber, eitaaId } = messengerRef.current;
        getSplunkInstance().sendEvent({
            group: 'activation-consult-whatsapp',
            type: 'click-whatsapp-num',
            event: {
                action: 'done'
            }
        });
        setMessenger([
            {
                type: 'eitaa_number',
                channel: eitaaNumber
            },
            {
                type: 'eitaa',
                channel: eitaaId
            },
            {
                type: 'whatsapp',
                channel: whatsappNumber
            }
        ]);

        router.push(`/activation/consult/cost/`);
    };

    return (
        <Container
            maxWidth="sm"
            className="h-full md:h-auto md:p-5 rounded-md pt-4 bg-white md:mt-8 md:shadow-2xl md:shadow-slate-300 flex flex-col space-y-5"
        >
            <EditMessenger
                title="لطفا شماره پیام رسان داخلی و خارجی خود را وارد کنید."
                description="شماره موبایل این پیام رسان ها در دسترس بیمار قرار میگیرد."
                ref={messengerRef}
            />
            <FixedWrapBottom className="border-t border-solid !bottom-0 border-[#e8ecf0]">
                <Button fullWidth variant="contained" size="large" onClick={handleSubmit}>
                    ادامه
                </Button>
            </FixedWrapBottom>
        </Container>
    );
};

export default ConsultMessenger;
