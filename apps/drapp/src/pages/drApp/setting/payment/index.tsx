import Container from '@mui/material/Container';
import { useEffect, useState } from 'react';
import { useDrApp } from '@paziresh24/context/drapp';
import { usePaymentSettingStore } from 'apps/drapp/src/store/paymentSetting.store';
import { useGetPaymentSetting } from 'apps/drapp/src/apis/payment/getPaymentSetting';
import { Alert, Tab, Tabs, Typography } from '@mui/material';
import Financial from 'apps/drapp/src/components/payment/finacial';
import { PaymentSetting } from 'apps/drapp/src/components/payment/setting';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

const PaymentPage = () => {
    const [{ center }] = useDrApp();
    const getSetting = usePaymentSettingStore(state => state.setting);
    const getPaymentSetting = useGetPaymentSetting({ center_id: center?.id });
    const [tab, setTab] = useState(getSetting?.active ? 0 : 1);
    const disabled = useFeatureIsOn('disabled-finacial');
    const { search } = useLocation();
    const urlParams = queryString.parse(search);

    useEffect(() => {
        getPaymentSetting.remove();
        getPaymentSetting.refetch();
        setTab(getSetting?.active ? 0 : 1);
    }, [center, getSetting?.active]);

    useEffect(() => {
        if (urlParams.section == 'setting') {
            setTab(1);
        }
    }, [urlParams]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    return (
        <Container
            maxWidth="sm"
            className="flex flex-col h-full !px-4 pt-2 md:pt-1 bg-white rounded-md md:h-auto md:p-5 md:mt-8 md:shadow-2xl md:shadow-slate-300"
        >
            {disabled && (
                <Alert icon={false} className="!bg-amber-600/20 mt-3 !text-amber-900">
                    <Typography fontSize="0.9rem" fontWeight="medium">
                        پزشک گرامی، این صفحه دیگر به‌روزرسانی نمی‌شود. برای ویرایش و مشاهده گزارش
                        مالی، لطفاً{' '}
                        <a
                            className="underline underline-offset-4 !text-primary"
                            href="https://www.paziresh24.com/dashboard/apps/katibe/bills/"
                            target="_blank"
                        >
                            اینجا
                        </a>{' '}
                        کلیک کنید.
                    </Typography>
                </Alert>
            )}
            <Tabs
                variant="fullWidth"
                className="border-b border-solid border-slate-200"
                onChange={handleTabChange}
                value={tab}
            >
                <Tab label="گزارش مالی" disabled={!getSetting.active} className="!text-xs" />
                <Tab label="تنظیمات" className="!text-xs" />
            </Tabs>

            <div className="h-full px-0 pt-4">
                {tab === 0 && <Financial />}
                {tab === 1 && <PaymentSetting />}
            </div>
        </Container>
    );
};

export default PaymentPage;
