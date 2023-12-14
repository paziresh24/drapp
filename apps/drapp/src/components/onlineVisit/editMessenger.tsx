import { Box, Divider, TextField } from '@mui/material';
import { ForwardedRef, forwardRef, useImperativeHandle, useState } from 'react';
import { messengersListData } from './messengers';
import styles from '@components/profile/password/password.module.scss';
import { HelpIcon, InfoIcon } from '@paziresh24/shared/icon';
import ReactTooltip from 'react-tooltip';
import Modal from '@paziresh24/shared/ui/modal';
import { useFeatureValue } from '@growthbook/growthbook-react';
import { useDrApp } from '@paziresh24/context/drapp';
interface EditMessengerProps {
    title?: string;
    description?: string;
    eitaaNumberDefaultValue?: string;
    whatsappNumberDefaultValue?: string;
    eitaaIdDefaultValue?: string;
    isEnabledSecureCall?: boolean;
    eitaaNumberError: boolean;
    whtasappNumberError: boolean;
    eitaaIdError: boolean;
    secureCallError?: boolean;
}

export const EditMessenger = forwardRef((props: EditMessengerProps, ref: ForwardedRef<any>) => {
    const {
        title,
        description,
        eitaaIdDefaultValue,
        eitaaNumberDefaultValue,
        whatsappNumberDefaultValue,
        isEnabledSecureCall,
        eitaaIdError,
        eitaaNumberError,
        whtasappNumberError
    } = props;
    const [info] = useDrApp();
    const [secureCallChannelModal, setSecureCallChannelModal] = useState(false);
    const secureCallDescription = useFeatureValue('profile:secure-call-description', {
        short_description: '',
        description: []
    });
    const secureCallEnabledDoctoList = useFeatureValue<{ ids: Array<string | number> }>(
        'profile:secure-call|enabled',
        { ids: [] }
    );

    const shouldShowSecureCall =
        secureCallEnabledDoctoList.ids.includes(info.doctor?.user_id) ||
        secureCallEnabledDoctoList.ids.includes('*') ||
        isEnabledSecureCall;

    const [messengersInfo, setMessengerInfo] = useState({
        eitaaNumber: eitaaNumberDefaultValue ?? '',
        eitaaId: eitaaIdDefaultValue ?? '',
        whatsappNumber: whatsappNumberDefaultValue ?? '',
        secureCall: isEnabledSecureCall
    });

    useImperativeHandle(
        ref,
        () => ({
            eitaaNumber: messengersInfo.eitaaNumber,
            eitaaId: messengersInfo.eitaaId.replace(/@/, ''),
            whatsappNumber: messengersInfo.whatsappNumber,
            isEnabledSecureCall: messengersInfo.secureCall
        }),
        [
            messengersInfo.eitaaNumber,
            messengersInfo.eitaaId,
            messengersInfo.whatsappNumber,
            messengersInfo?.secureCall
        ]
    );

    const handleInputChange = (event: any) => {
        const { name, value } = event.target;
        setMessengerInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSecureCallChange = (event: any) => {
        const { name, checked } = event.target;
        setMessengerInfo(prevState => ({
            ...prevState,
            [name]: checked
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
                            {messenger.lable}
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
                                        className="flex items-center rounded-lg  relative"
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
                                                className="absolute left-3 text-sm text-primary cursor-pointer"
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
                {shouldShowSecureCall && (
                    <div className="flex  gap-3 mt-4 flex-col rounded-md">
                        <div className="flex flex-col space-y-1">
                            <span className="text-sm flex items-center gap-1 font-semibold text-[#49536E]">
                                تماس اَمن
                            </span>
                        </div>
                        <div className="flex gap-1 justify-between items-center p-3 border border-solid rounded-lg border-slate-200 ">
                            <div>
                                <span className="text-sm">
                                    {secureCallDescription.short_description}
                                </span>
                                <div
                                    className="inline-block  mr-1 align-middle [&>svg]:w-5 cursor-pointer [&>svg]:h-5"
                                    onClick={() => setSecureCallChannelModal(true)}
                                >
                                    <HelpIcon color="#3f4079" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Box className="flex items-center rounded-lg elative">
                                    <div className={styles.toggle}>
                                        <input
                                            type="checkbox"
                                            id="switch"
                                            defaultChecked={isEnabledSecureCall}
                                            name="secureCall"
                                            onChange={e => handleSecureCallChange(e)}
                                        />
                                        <label htmlFor="switch">Toggle</label>
                                    </div>{' '}
                                </Box>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Modal
                title="تماس امن"
                isOpen={secureCallChannelModal}
                onClose={setSecureCallChannelModal}
            >
                <ul className="list-disc mr-4 space-y-2 text-sm font-medium">
                    {secureCallDescription.description?.map(item => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            </Modal>
        </>
    );
});
export default EditMessenger;
