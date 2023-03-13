import { Container } from '@mui/material';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';
import Rules from 'apps/drapp/src/components/onlineVisit/rules';
import { isDesktop, isMobile } from 'react-device-detect';
import { useHistory } from 'react-router-dom';

export const ConsultRuels = () => {
    const router = useHistory();
    const rules = [
        'ویزیت آنلاین در پیام رسان اعلامی شما و انتخابی بیمار انجام می شود.',
        'ویزیت آنلاین می بایست از راس زمان نوبت بیمار شروع شود و پزشک به مدت ۳ روز پاسخگوی سوالات بعدی بیمار باشد.',
        'توضيحات درمان و در صورت نیاز ثبت نسخه الکترونیک می بايست تا حداکثر ۱۵ دقيقه بعد از زمان نوبت برای بیمار ارسال شود.',
        'هزینه هر ویزیت پس از اعلام مراجعه و ارسال توضيحات درمان و در صورت نیاز ثبت نسخه الکترونیک، برای پزشک محاسبه می شود.',
        'در صورت نارضایتی بیمار، ۱۰۰ درصد مبلغ پرداختی بیمار استرداد خواهد شد.'
    ];

    const handleButtonAction = (action: string, address: string) => {
        getSplunkInstance().sendEvent({
            group: 'drapp-visit-online ',
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
                    onSubmit={() => handleButtonAction('accept', '/activation/consult/messengers')}
                    title=" بدلیل عدم پذیرش قوانین ویزیت آنلاین پذیرش۲۴ امکان فعالسازی ویزیت آنلاین را
                        ندارید."
                    modalCancelButtonAction={() => handleButtonAction('decline', '/')}
                    terms={rules}
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

export default ConsultRuels;
