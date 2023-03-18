import eitaaLogo from '@assets/image/eitaa.png';
import WhatsappLogo from '@assets/image/whatsApp.png';
import { phoneNumberValidator } from '@persian-tools/persian-tools';
import { Dispatch, SetStateAction } from 'react';

type MessengerInfo = {
    setState: Dispatch<SetStateAction<string>>;
    value: string;
};

interface MwssengerDataParams {
    eitaaNumber: MessengerInfo;
    whatsappNumber: MessengerInfo;
    eitaaId: MessengerInfo;
}

export const MessengersListData = (props: MwssengerDataParams) => {
    const { eitaaId, eitaaNumber, whatsappNumber } = props;

    return [
        {
            id: 1,
            lable: 'پیام رسان داخلی',
            messengerName: 'ایتا',
            logo: eitaaLogo,
            inputes: [
                {
                    id: 1,
                    placeholder: 'شماره موبایل',
                    setState: eitaaNumber.setState,
                    value: eitaaNumber.value,
                    name: 'شماره ایتا',
                    showError: !!eitaaNumber.value && !phoneNumberValidator(eitaaNumber.value)
                },
                {
                    id: 2,
                    placeholder: 'آیدی پیام رسان',
                    name: 'آیدی ایتا',
                    setState: eitaaId.setState,
                    value: eitaaId.value,
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
