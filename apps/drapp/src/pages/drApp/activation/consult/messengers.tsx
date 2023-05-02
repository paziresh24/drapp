import { Button } from '@mui/material';
import Container from '@mui/material/Container';
import FixedWrapBottom from '@paziresh24/shared/ui/fixedWrapBottom';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';
import EditMessenger from 'apps/drapp/src/components/onlineVisit/editMessenger';
import { useConsultActivationStore } from 'apps/drapp/src/store/consultActivation.store';
import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useActivationStore } from '../activation.store';
import { phoneNumberValidator } from '@persian-tools/persian-tools';
import { isMessengerIdHasValid } from 'apps/drapp/src/functions/isMessengerIdHasValid';
import { toast } from 'react-toastify';

const ConsultMessenger = () => {
    const [messengerError, setMessengerError] = useState({
        eitaaNumberError: false,
        eitaaIdError: false,
        whatsappNumberError: false
    });
    const messengerRef = useRef<any>('');
    const router = useHistory();
    const setMessenger = useConsultActivationStore(state => state.setMessenger);
    const setSelectedService = useActivationStore(state => state.setSelectedService);

    useEffect(() => {
        setSelectedService(prev => prev.filter(service => service !== 'consult'));
    }, []);

    const handleSubmit = () => {
        const { eitaaNumber, whatsappNumber, eitaaId } = messengerRef.current;
        setMessengerError({
            ...(!!eitaaId.length && {
                eitaaNumberError: !phoneNumberValidator(eitaaNumber)
            }),
            ...(!!eitaaNumber.length && { eitaaIdError: !isMessengerIdHasValid(eitaaId) }),
            ...(whatsappNumber && { whatsappNumberError: !phoneNumberValidator(whatsappNumber) })
        });

        if (
            (phoneNumberValidator(eitaaNumber) && isMessengerIdHasValid(eitaaId)) ||
            phoneNumberValidator(whatsappNumber)
        ) {
            getSplunkInstance().sendEvent({
                group: 'drapp-visit-online',
                type: 'app',
                event: {
                    action: 'done'
                }
            });
            setMessenger(
                [
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
                ].filter(messenger => !!messenger.channel.length)
            );
            router.push(`/activation/consult/cost/`);
            return;
        }
        if (!whatsappNumber.length && !eitaaNumber.length && !eitaaId.length)
            return toast.error('لطفا اطلاعات یکی از پیام رسان ها را صحیح وارد کنید.');
    };

    return (
        <Container
            maxWidth="sm"
            className="h-full md:h-auto md:p-5 rounded-md pt-4 bg-white md:mt-8 md:shadow-2xl md:shadow-slate-300 flex flex-col space-y-5"
        >
            <EditMessenger
                title="لطفا شماره و نام کاربری پیام رسان ایتا یا شماره واتساپ خود را وارد."
                description="شماره موبایل این پیام رسان ها در دسترس بیمار قرار میگیرد."
                eitaaIdError={messengerError.eitaaIdError}
                eitaaNumberError={messengerError.eitaaNumberError}
                whtasappNumberError={messengerError.whatsappNumberError}
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
