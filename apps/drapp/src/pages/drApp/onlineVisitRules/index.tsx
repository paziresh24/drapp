import { Container } from '@mui/material';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';
import Rules from 'apps/drapp/src/components/onlineVisit/rules';
import { useHistory } from 'react-router-dom';

export const OnlineVisitRules = () => {
    const router = useHistory();

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
