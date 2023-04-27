import { Box, TextField } from '@mui/material';
import { ForwardedRef, forwardRef, useImperativeHandle, useState } from 'react';
import { messengersListData } from './messengers';
interface EditMessengerProps {
    title?: string;
    description?: string;
    eitaaNumberDefaultValue?: string;
    whatsappNumberDefaultValue?: string;
    eitaaIdDefaultValue?: string;
    eitaaNumberError: boolean;
    whtasappNumberError: boolean;
    eitaaIdError: boolean;
}

export const EditMessenger = forwardRef((props: EditMessengerProps, ref: ForwardedRef<any>) => {
    const {
        title,
        description,
        eitaaIdDefaultValue,
        eitaaNumberDefaultValue,
        whatsappNumberDefaultValue,
        eitaaIdError,
        eitaaNumberError,
        whtasappNumberError
    } = props;

    const [messengersInfo, setMessengerInfo] = useState({
        eitaaNumber: eitaaNumberDefaultValue ?? '',
        eitaaId: eitaaIdDefaultValue ?? '',
        whatsappNumber: whatsappNumberDefaultValue ?? ''
    });

    useImperativeHandle(
        ref,
        () => ({
            eitaaNumber: messengersInfo.eitaaNumber,
            eitaaId: messengersInfo.eitaaId.replace(/@/, ''),
            whatsappNumber: messengersInfo.whatsappNumber
        }),
        [messengersInfo.eitaaNumber, messengersInfo.eitaaId, messengersInfo.whatsappNumber]
    );

    const handleInputChange = (event: any) => {
        const { name, value } = event.target;
        setMessengerInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <>
            <div className="mb-8">
                {(!!title || !!description) && (
                    <div className="[&>span]:block flex flex-col gap-2 bg-[#FFFCF5] rounded-lg items-center p-6">
                        {!!title && <span className="text-sm font-semibold">{title}</span>}
                        {!!description && (
                            <span className="text-sm text-[#747C90]">{description}</span>
                        )}
                    </div>
                )}
                {messengersListData({
                    eitaaId: messengersInfo.eitaaId,
                    eitaaIdError: eitaaIdError,
                    eitaaNumber: messengersInfo.eitaaNumber,
                    eitaaNumberError: eitaaNumberError,
                    whatsappNumber: messengersInfo.whatsappNumber,
                    whtasappNumberError: whtasappNumberError
                }).map(messenger => (
                    <div key={messenger.id}>
                        <span className="text-sm flex items-center gap-1 font-semibold text-[#49536E]">
                            <em className="text-red-500">*</em> {messenger.lable}
                        </span>
                        <div className="flex items-center gap-2 mt-4">
                            <div className="flex justify-center gap-1 items-center w-[30%] md:w-[20%] h-12 border border-solid border-[#e1e4e6] rounded-lg">
                                <img src={messenger.logo} alt="" />
                                <span className="text-sm text-[#49536E]">
                                    {messenger.messengerName}
                                </span>
                            </div>
                            <div className="flex flex-col gap-2 w-[70%] md:w-[80%]">
                                {messenger.inputes.map(input => (
                                    <Box
                                        key={input.id}
                                        className="flex items-center rounded-lg pl-3 relative"
                                    >
                                        <TextField
                                            title="لطفا اطلاعات خود را وارد کنید"
                                            type="text"
                                            name={input.name}
                                            defaultValue={input.value}
                                            placeholder={input.placeholder}
                                            error={input.error}
                                            helperText={
                                                input.error &&
                                                `${input.messengerName} را صحیح وارد کنید`
                                            }
                                            onChange={e => handleInputChange(e)}
                                            className="[&>div>input]:!py-4 [&>div>input]:!h-4 [&>div>input]:placeholder:!text-[#3e4148] [&>div>fieldset]:!rounded-lg flex-grow"
                                        />
                                        {!!input.helper && (
                                            <span
                                                className="absolute left-6 text-sm text-primary cursor-pointer"
                                                onClick={input.helper.action}
                                            >
                                                {input.helper.name}
                                            </span>
                                        )}
                                    </Box>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
});
export default EditMessenger;
