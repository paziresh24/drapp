import checklistImage from '@assets/image/checklist.png';
import { Button, Checkbox } from '@mui/material';
import { useEffect, useState } from 'react';

interface RulesProps {
    onSubmit: () => void;
    onCancel: () => void;
}

export const Rules = (props: RulesProps) => {
    const { onSubmit, onCancel } = props;
    const [checkedCount, setCheckedCount] = useState(0);
    const [isEnableButton, setIsEnableButton] = useState(false);

    const rules = [
        'ایجاد تجربه‌ی رویایی درمان برای بیمــاران از وظایف اصلی پذیرش24 می‌باشد.',
        'ویزیت آنلاین در پیام رسان اعلامی شما و انتخابی بیمار انجام می شود.',
        'ویزیت آنلاین می بایست از راس زمان نوبت بیمار شروع شود و پزشک به مدت ۳ روز پاسخگوی سوالات بعدی بیمار باشد.',
        'توضيحات درمان و در صورت نیاز ثبت نسخه الکترونیک می بايست تا حداکثر ۱۵ دقيقه بعد از زمان نوبت برای بیمار ارسال شود.',
        'هزینه هر ویزیت پس از اعلام مراجعه و ارسال توضيحات درمان و در صورت نیاز ثبت نسخه الکترونیک، برای پزشک محاسبه می شود.',
        'در صورت نارضایتی بیمار، ۱۰۰ درصد مبلغ پرداختی بیمار استرداد خواهد شد.'
    ];

    useEffect(() => {
        if (checkedCount === 6) return setIsEnableButton(true);
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
            <div className="relative h-full">
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col justify-center items-center">
                        <img src={checklistImage} alt="" className="mx-auto mt-4" />
                        <span className="text-center my-6 bg-[#FFECC7] rounded-md text-[0.92rem] block w-full font-semibold py-3">
                            قوانين و مقررات گفتگو با بیمار ویزیت آنلاین
                        </span>
                    </div>
                    {rules.map((rule, index) => (
                        <div className="flex items-center cursor-pointer" key={index}>
                            <Checkbox
                                name={`question_${index + 1}`}
                                size="small"
                                className="!pr-0"
                                onChange={e => handleCheckboxChange(e.target.checked)}
                            />
                            <span className="text-[0.92rem] text-[#49536E] leading-7 text-justify block">
                                {rule}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="flex w-full py-4 justify-between absolute min-[400px]:bottom-0">
                    <Button
                        variant="contained"
                        disabled={!isEnableButton}
                        className="block w-[45%]"
                        onClick={onSubmit}
                    >
                        موافقم
                    </Button>
                    <Button variant="outlined" className="block w-[45%]" onClick={onCancel}>
                        انصراف
                    </Button>
                </div>
            </div>
        </>
    );
};

export default Rules;
