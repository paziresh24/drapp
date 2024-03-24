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
import { useDrApp } from '@paziresh24/context/drapp';
import CONSULT_CENTER_ID from '@paziresh24/constants/consultCenterId';
import { useUpdateMessengers } from '@paziresh24/hooks/drapp/profile';
import { useChangeBookingStatus } from 'apps/drapp/src/apis/booking/changeBookingStatus';

const ConsultMessenger = () => {
    const [info] = useDrApp();
    const [messengerError, setMessengerError] = useState({
        eitaaNumberError: false,
        eitaaIdError: false,
        whatsappNumberError: false
    });
    const messengerRef = useRef<any>('');
    const router = useHistory();
    const setMessenger = useConsultActivationStore(state => state.setMessenger);
    const setSelectedService = useActivationStore(state => state.setSelectedService);
    const updateMessengers = useUpdateMessengers();
    const changeStatus = useChangeBookingStatus();

    useEffect(() => {
        setSelectedService(prev => prev.filter(service => service !== 'consult'));
    }, []);

    const handleSubmit = async () => {
        const { eitaaNumber, whatsappNumber, eitaaId, isEnabledSecureCall } = messengerRef.current;
        setMessengerError({
            ...((eitaaNumber || eitaaId) && {
                eitaaNumberError: !phoneNumberValidator(eitaaNumber),
                eitaaIdError: !isMessengerIdHasValid(eitaaId)
            }),
            ...(whatsappNumber && { whatsappNumberError: !phoneNumberValidator(whatsappNumber) })
        });
        if (!whatsappNumber.length && !eitaaNumber.length && !eitaaId.length)
            return toast.error('لطفا اطلاعات یکی از پیام رسان ها را صحیح وارد کنید.');
        if (
            (eitaaNumber || eitaaId
                ? phoneNumberValidator(eitaaNumber) && isMessengerIdHasValid(eitaaId)
                : true) &&
            (whatsappNumber ? phoneNumberValidator(whatsappNumber) : true)
        ) {
            getSplunkInstance().sendEvent({
                group: 'drapp-visit-online',
                type: 'app',
                event: {
                    action: 'done'
                }
            });
            if (info.centers.some((item: any) => item.id === CONSULT_CENTER_ID)) {
                changeStatus.mutateAsync({
                    status: true,
                    user_center_id: info.centers.find((item: any) => item.id === CONSULT_CENTER_ID)
                        ?.user_center_id
                });
                updateMessengers.mutate(
                    {
                        online_channels: [
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
                            },
                            {
                                type: 'secure_call',
                                channel: isEnabledSecureCall ? '02125015000' : ''
                            }
                        ].filter(messenger => !!messenger.channel.length) as any
                    },
                    {
                        onSuccess: () => {
                            if (isEnabledSecureCall) {
                                getSplunkInstance().sendEvent({
                                    group: ' active-safe-call',
                                    type: 'active-successfully'
                                });
                            }
                            router.push(`/setting/workhours`);

                            return;
                        },
                        onError: (err: any) => {
                            toast.error(err.response.data.message);

                            return;
                        }
                    }
                );
                return;
            }
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
                    },
                    {
                        type: 'secure_call',
                        channel: isEnabledSecureCall ? '02125015000' : ''
                    }
                ].filter(messenger => !!messenger.channel.length)
            );
            router.push(`/activation/consult/cost/`);
            return;
        }
    };

    return (
        <Container
            maxWidth="sm"
            className="flex flex-col h-full pt-4 space-y-5 bg-white rounded-md md:h-auto md:p-5 md:mt-8 md:shadow-2xl md:shadow-slate-300"
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
