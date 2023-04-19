import checklistImage from '@assets/image/checklist.png';
import { Button, Checkbox } from '@mui/material';
import Modal from '@paziresh24/shared/ui/modal';
import { useEffect, useState } from 'react';

interface RulesProps {
    onSubmit: () => void;
    title?: string;
    modalCancelButtonAction: () => void;
    submitText: string;
    cancelText: string;
    modalTitle: string;
    modalDescription: string;
}

export const Rules = (props: RulesProps) => {
    const {
        onSubmit,
        title,
        modalCancelButtonAction,
        cancelText,
        submitText,
        modalDescription,
        modalTitle
    } = props;
    const [checkedCount, setCheckedCount] = useState(0);
    const [cancelModal, setCancelModal] = useState(false);
    const [isEnableButton, setIsEnableButton] = useState(false);

    const rules = [
        'ویزیت آنلاین در پیام رسان اعلامی شما و انتخابی بیمار انجام می شود.',
        'ویزیت آنلاین می بایست از راس زمان نوبت بیمار شروع شود و پزشک به مدت ۳ روز پاسخگوی سوالات بعدی بیمار باشد.',
        'در زمان شروع ویزیت بیمار، دکمه پذیرش بیمار را در پنل انتخاب نمایید.در صورت عدم انتخاب، بیمار قادر به حذف نوبت خود می باشد.',
        'توضيحات درمان و در صورت نیاز ثبت نسخه الکترونیک می بايست تا حداکثر ۱۵ دقيقه بعد از زمان نوبت برای بیمار ارسال شود.',
        'هزینه هر ویزیت پس از اعلام مراجعه و ارسال توضيحات درمان و در صورت نیاز ثبت نسخه الکترونیک، برای پزشک محاسبه می شود.',
        'در صورت نارضایتی بیمار، ۱۰۰ درصد مبلغ پرداختی بیمار استرداد خواهد شد.'
    ];

    useEffect(() => {
        if (checkedCount === rules.length) return setIsEnableButton(true);
        setIsEnableButton(false);
    }, [checkedCount]);

    const handleCheckboxChange = (checked: boolean) => {
        if (checked) {
            return setCheckedCount(checkedCount + 1);
        }
        setCheckedCount(checkedCount - 1);
    };

    return (
        <>
            <div className="!bg-white w-full min-h-full flex flex-col items-center justify-between">
                <div className="overflow-auto w-full px-6">
                    <div className="relative h-full">
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col justify-center items-center">
                                <img src={checklistImage} alt="" className="mx-auto mt-4" />
                                {!!title && (
                                    <span className="text-center my-6 bg-[#FFECC7] rounded-md text-[0.92rem] block w-full font-semibold p-3 leading-8">
                                        {title}
                                    </span>
                                )}
                            </div>
                            <div className="h-full lg:h-[20rem] overflow-auto">
                                {rules.map((rule, index) => (
                                    <div className="flex items-start cursor-pointer" key={index}>
                                        <Checkbox
                                            name={`question_${index + 1}`}
                                            size="small"
                                            className="!pr-0"
                                            onChange={e => handleCheckboxChange(e.target.checked)}
                                        />
                                        <span className="text-[0.92rem] text-[#49536E] leading-7 text-justify block font-semibold mt-1">
                                            {rule}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex w-full py-4 px-6 justify-between relative bottom-0">
                    <Button
                        variant="contained"
                        disabled={!isEnableButton}
                        className="block w-[45%]"
                        onClick={onSubmit}
                    >
                        {submitText}
                    </Button>
                    <Button
                        variant="outlined"
                        className="block w-[45%]"
                        onClick={() => setCancelModal(true)}
                    >
                        {cancelText}
                    </Button>
                </div>
            </div>
            <Modal isOpen={cancelModal} onClose={setCancelModal} title={modalTitle}>
                <span className="text-sm leading-6">{modalDescription}</span>
                <div className="w-full flex justify-between gap-4">
                    <Button
                        onClick={() => setCancelModal(false)}
                        variant="contained"
                        className="w-1/2"
                    >
                        مشاهده قوانین
                    </Button>
                    <Button onClick={modalCancelButtonAction} variant="outlined" className="w-1/2">
                        تایید
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export default Rules;
