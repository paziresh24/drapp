import { TextField } from '@mui/material';
import Button from '@mui/lab/LoadingButton';
import { ForwardedRef, forwardRef, useRef, useImperativeHandle, useState } from 'react';
import { MessagersListData } from './messengers';

interface EditMassagerProps {
    title?: string;
    description?: string;
    onsubmit?: () => void;
    submitButtonLoading?: boolean;
    submitButtonText?: string;
    igapNumberDefaultValue?: string;
    whatsappNUmberDefaultValue?: string;
    igapIdDefaultValue?: string;
    showSubmitButton?: boolean;
}

export const EditMassager = forwardRef((props: EditMassagerProps, ref: ForwardedRef<any>) => {
    const {
        title,
        description,
        onsubmit,
        submitButtonText,
        igapIdDefaultValue,
        igapNumberDefaultValue,
        whatsappNUmberDefaultValue,
        showSubmitButton = false,
        submitButtonLoading
    } = props;
    const [igapNumber, setIgapeNumber] = useState(igapNumberDefaultValue ?? '');
    const [igapId, setIgapeId] = useState(igapIdDefaultValue ?? '');
    const [whatsappNumber, setWhatsappNumber] = useState(whatsappNUmberDefaultValue ?? '');

    useImperativeHandle(
        ref,
        () => ({
            igapNumber: igapNumber,
            igapId: igapId,
            whatsappNumber: whatsappNumber
        }),
        [igapNumber, igapId, whatsappNumber]
    );

    return (
        <>
            {(!!title || !!description) && (
                <div className="[&>span]:block flex flex-col gap-2 bg-[#FFFCF5] rounded-lg items-center p-6">
                    {!!title && <span className="text-sm font-semibold">{title}</span>}
                    {!!description && <span className="text-sm text-[#747C90]">{description}</span>}
                </div>
            )}
            {MessagersListData({
                igapNumber: {
                    value: igapNumber,
                    setState: setIgapeNumber
                },
                igapId: {
                    value: igapId,
                    setState: setIgapeId
                },
                whatsappNumber: {
                    value: whatsappNumber,
                    setState: setWhatsappNumber
                }
            }).map(massager => (
                <div key={massager.id}>
                    <span className="text-sm flex items-center gap-1 font-semibold text-[#49536E]">
                        <em className="text-red-500">*</em> {massager.lable}
                    </span>
                    <div className="flex items-center gap-2 mt-4">
                        <div className="flex justify-center gap-1 items-center w-[30%] md:w-[20%] h-12 border border-solid border-[#e1e4e6] rounded-md">
                            <img src={massager.logo} alt="" />
                            <span className="text-sm text-[#49536E]">{massager.massagerName}</span>
                        </div>
                        <div className="flex flex-col gap-2 w-[70%] md:w-[80%]">
                            {massager.inputes.map(input => (
                                <TextField
                                    key={input.id}
                                    title="لطفا اطلاعات خود را وارد کنید"
                                    type="text"
                                    defaultValue={input.value}
                                    placeholder={input.placeholder}
                                    error={input.showError}
                                    helperText={input.showError && `${input.name} را وارد کنید`}
                                    onChange={e => input.setState(e.target.value)}
                                    className="[&>div>input]:!py-4 [&>div>input]:!h-4 [&>div]:!rounded-md [&>div>input]:placeholder:!text-[#3e4148] flex-grow"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            ))}
            {showSubmitButton && (
                <Button
                    onClick={onsubmit}
                    variant="contained"
                    className="mt-4"
                    loading={submitButtonLoading ?? false}
                >
                    {submitButtonText}
                </Button>
            )}
        </>
    );
});
export default EditMassager;
