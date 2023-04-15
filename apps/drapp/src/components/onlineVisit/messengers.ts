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

export const messengersListData = (props: MwssengerDataParams) => {
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
                    error: eitaaNumberError,
                    helper: null
                },
                {
                    id: 2,
                    placeholder: 'نام کاربری ایتا',
                    messengerName: 'آیدی ایتا',
                    name: 'eitaaId',
                    value: eitaaId,
                    error: eitaaIdError,
                    helper: {
                        name: 'راهنما',
                        type: 'text',
                        action: () =>
                            (location.href = 'https://community.paziresh24.com/t/topic/1055')
                    }
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
                    error: whtasappNumberError,
                    helper: null
                }
            ]
        }
    ];
};
