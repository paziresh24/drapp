import IgapLogo from '@assets/image/Igap.png';
import WhatsappLogo from '@assets/image/whatsApp.png';
import { Button, TextField } from '@mui/material';
import { useState } from 'react';

interface EditMassagerProps {
    title: string;
    description?: string;
}

export const EditMassager = (props: EditMassagerProps) => {
    const { title, description } = props;
    const [igapInfo, setIgapInfo] = useState('');
    const [whatsappInfo, setWhatsappInfo] = useState('');
    const massagersInfo = [
        {
            id: 1,
            lable: 'پیام رسان داخلی',
            massagerName: 'آی گپ',
            logo: IgapLogo,
            isNecessary: true,
            placeholder: 'شماره موبایل',
            action: (e: string) => setIgapInfo(e)
        },
        {
            id: 2,
            lable: 'پیام رسان خارجی',
            massagerName: 'واتساپ',
            logo: WhatsappLogo,
            isNecessary: true,
            placeholder: 'شماره موبایل',
            action: (e: string) => setWhatsappInfo(e)
        }
    ];

    return (
        <>
            <div className="[&>span]:block flex flex-col gap-2 bg-[#FFFCF5] rounded-lg items-center p-6">
                <span className="text-sm font-semibold">{title}</span>
                {!!description && <span className="text-sm text-[#747C90]">{description}</span>}
            </div>
            {massagersInfo.map(massager => (
                <div key={massager.id}>
                    <span className="text-sm flex items-center gap-1 font-semibold text-[#49536E]">
                        {massager.isNecessary && <em className="text-red-500">*</em>}
                        {massager.lable}
                    </span>
                    <div className="flex items-center gap-4 mt-4">
                        <div className="flex justify-center gap-1 items-center w-[30%] md:w-[20%] h-12 border border-solid border-[#e1e4e6] rounded-md">
                            <img src={massager.logo} alt="" />
                            <span className="text-sm text-[#49536E]">{massager.massagerName}</span>
                        </div>
                        <TextField
                            type="text"
                            placeholder={massager.placeholder}
                            name={massager.massagerName}
                            error={igapInfo.length < 10}
                            onChange={e => massager.action(e.target.value)}
                            className="[&>div>input]:!py-4 [&>div>input]:!h-4 [&>div]:!rounded-md [&>div>input]:placeholder:!text-[#3e4148] w-[70%] md:w-[80%]"
                        />
                    </div>
                </div>
            ))}
            <Button variant="contained">ثبت تغییرات</Button>
        </>
    );
};
export default EditMassager;
