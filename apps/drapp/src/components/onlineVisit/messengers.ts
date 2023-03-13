import IgapLogo from '@assets/image/Igap.png';
import WhatsappLogo from '@assets/image/whatsApp.png';
import { phoneNumberValidator } from '@persian-tools/persian-tools';
import { Dispatch, SetStateAction } from 'react';

type MessengerInfo = {
    setState: Dispatch<SetStateAction<string>>;
    value: string;
};

interface MwssengerDataParams {
    igapNumber: MessengerInfo;
    whatsappNumber: MessengerInfo;
    igapId: MessengerInfo;
}

export const MessengersListData = (props: MwssengerDataParams) => {
    const { igapId, igapNumber, whatsappNumber } = props;

    return [
        {
            id: 1,
            lable: 'پیام رسان داخلی',
            messengerName: 'آی گپ',
            logo: IgapLogo,
            inputes: [
                {
                    id: 1,
                    placeholder: 'شماره موبایل',
                    setState: igapNumber.setState,
                    value: igapNumber.value,
                    name: 'شماره آی گپ',
                    showError: !!igapNumber.value && !phoneNumberValidator(igapNumber.value)
                },
                {
                    id: 2,
                    placeholder: 'آیدی پیام رسان',
                    name: 'آیدی آی گپ',
                    setState: igapId.setState,
                    value: igapId.value,
                    showError: false
                }
            ]
        },
        {
            id: 2,
            lable: 'پیام رسان خارجی',
            messengerName: 'واتساپ',
            logo: WhatsappLogo,
            inputes: [
                {
                    id: 1,
                    placeholder: 'شماره موبایل',
                    setState: whatsappNumber.setState,
                    value: whatsappNumber.value,
                    name: 'شماره واتساپ',
                    showError: !!whatsappNumber.value && !phoneNumberValidator(whatsappNumber.value)
                }
            ]
        }
    ];
};
