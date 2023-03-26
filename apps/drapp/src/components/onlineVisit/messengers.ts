import eitaaLogo from '@assets/image/eitaa.png';
import WhatsappLogo from '@assets/image/whatsApp.png';

interface MwssengerDataParams {
    eitaaNumber: string;
    eitaaId: string;
    whatsappNumber: string;
    eitaaNumberError: boolean;
    eitaaIdError: boolean;
    whtasappNumberError: boolean;
}

export const MessengersListData = (props: MwssengerDataParams) => {
    const {
        eitaaId,
        eitaaIdError,
        eitaaNumber,
        eitaaNumberError,
        whatsappNumber,
        whtasappNumberError
    } = props;

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
                    messengerName: 'شماره ایتا',
                    value: eitaaNumber,
                    name: 'eitaaNumber',
                    error: eitaaNumberError
                },
                {
                    id: 2,
                    placeholder: 'آیدی پیام رسان',
                    messengerName: 'آیدی ایتا',
                    name: 'eitaaId',
                    value: eitaaId,
                    error: eitaaIdError
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
                    messengerName: 'شماره واتساپ',
                    value: whatsappNumber,
                    name: 'whatsappNumber',
                    error: whtasappNumberError
                }
            ]
        }
    ];
};
