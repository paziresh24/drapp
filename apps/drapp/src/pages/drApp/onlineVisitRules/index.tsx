import { Container } from '@mui/material';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';
import Rules from 'apps/drapp/src/components/onlineVisit/rules';
import { useHistory } from 'react-router-dom';

export const OnlineVisitRules = () => {
    const router = useHistory();
    const rules = [
        'ویزیت آنلاین در پیام رسان اعلامی شما و انتخابی بیمار انجام می شود.',
        'ویزیت آنلاین می بایست از راس زمان نوبت بیمار شروع شود و پزشک به مدت ۳ روز پاسخگوی سوالات بعدی بیمار باشد.',
        'در زمان شروع ویزیت بیمار، دکمه پذیرش بیمار را در پنل انتخاب نمایید.در صورت عدم انتخاب، بیمار قادر به حذف نوبت خود می باشد.',
        'توضيحات درمان و در صورت نیاز ثبت نسخه الکترونیک می بايست تا حداکثر ۱۵ دقيقه بعد از زمان نوبت برای بیمار ارسال شود.',
        'هزینه هر ویزیت پس از اعلام مراجعه و ارسال توضيحات درمان و در صورت نیاز ثبت نسخه الکترونیک، برای پزشک محاسبه می شود.',
        'در صورت نارضایتی بیمار، ۱۰۰ درصد مبلغ پرداختی بیمار استرداد خواهد شد.'
    ];

    const handleButtonAction = (action: string, address: string) => {
        getSplunkInstance().sendEvent({
            group: 'drapp-visit-online-profile',
            type: 'rules',
            event: {
                action: action
            }
        }),
            router.replace(address);
    };

    return (
        <>
            <Container
                maxWidth="sm"
                className="h-full md:h-auto md:p-5 rounded-md pt-4 bg-white md:mt-8 md:shadow-2xl md:shadow-slate-300 flex flex-col lg:space-y-5 !px-0"
            >
                <Rules
                    terms={rules}
                    onSubmit={() => handleButtonAction('accept', '/profile')}
                    title="قوانین و مقررات ویزیت آنلاین با بیمار پذیرش۲۴"
                    modalCancelButtonAction={() => handleButtonAction('decline', '/')}
                    cancelText="انصراف"
                    submitText="موافقم"
                    modalDescription="  بدلیل عدم پذیرش قوانین ویزیت آنلاین پذیرش۲۴ امکان فعالسازی ویزیت آنلاین را
                ندارید."
                    modalTitle="ویزیت آنلاین"
                />
            </Container>
        </>
    );
};

export default OnlineVisitRules;
