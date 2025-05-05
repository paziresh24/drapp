import Container from '@mui/material/Container';
import { useEffect, useState } from 'react';
import { useDrApp } from '@paziresh24/context/drapp';
import { usePaymentSettingStore } from 'apps/drapp/src/store/paymentSetting.store';
import { useGetPaymentSetting } from 'apps/drapp/src/apis/payment/getPaymentSetting';
import { Alert, Tab, Tabs, Typography } from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch'; // آیکون لینک خارجی
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
    const inviteDrToNewPaymentService = useFeatureIsOn('invite-dr-to-new-payment-service'); // ویژگی جدید
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
                <Alert icon={false} className="!bg-blue-100 mt-3 !text-blue-900">
                    <Typography fontSize="0.9rem" fontWeight="medium" lineHeight="1.68rem">
                        {tab === 0 ? (
                            <>
                                <strong>اطلاعیه مهم</strong>
                                <br />
                                پزشک گرامی، شما به سیستم پرداخت جدید پذیرش۲۴ منتقل شده‌اید.
                                <br />✅ از این پس، پرداخت‌های نوبت‌های جدید در سیستم جدید ثبت
                                می‌شوند و در بخش «
                                <a
                                    className="underline underline-offset-4 text-primary inline-flex items-center gap-1"
                                    href="https://www.paziresh24.com/dashboard/apps/katibe/bills/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    مدیریت مالی
                                    <LaunchIcon fontSize="inherit" />
                                </a>
                                » قابل مشاهده هستند.
                                <br />
                                💰 برای دریافت مبالغ تسویه‌نشده مربوط به نوبت‌های ثبت‌شده در سیستم
                                قبلی، در همین صفحه با کلیک روی دکمه «درخواست تسویه حساب» درخواست خود
                                را ثبت کنید تا وجه مربوطه به حساب شما واریز شود.
                            </>
                        ) : (
                            <>
                                <strong>اطلاعیه مهم</strong>
                                <br />
                                پزشک گرامی، شما به سیستم پرداخت جدید پذیرش۲۴ منتقل شده‌اید.
                                <br />✅ از این پس، برای ویرایش مبلغ به بخش «
                                <a
                                    className="underline underline-offset-4 text-primary inline-flex items-center gap-1"
                                    href="https://www.paziresh24.com/dashboard/apps/drapp/service/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    نوبت‌دهی › خدمات
                                    <LaunchIcon fontSize="inherit" />
                                </a>
                                » مراجعه کنید.
                            </>
                        )}
                    </Typography>
                </Alert>
            )}

           {(!disabled && inviteDrToNewPaymentService) && (
                <Alert icon={false} className="!bg-yellow-100 mt-3 !text-yellow-900">
                    <Typography fontSize="0.9rem" fontWeight="medium">
                        ⚠️ سرویس پرداخت فعلی تا پایان خرداد ۱۴۰۴ غیرفعال می‌شود.
                        <br />
                        برای استفاده از تسویه خودکار، مشاهده لحظه‌ای تراکنش‌ها و امکانات بیشتر، هرچه
                        سریع‌تر به سرویس جدید پرداخت پذیرش۲۴ منتقل شوید.
                        <br />
                        <a
                            className="underline underline-offset-4 text-primary inline-flex items-center gap-1 mt-2"
                            href={
                                center?.id === '5532'
                                    ? 'https://opium-dashboard.paziresh24.com/introducing-a-new-payment-service-online-visit/'
                                    : 'https://opium-dashboard.paziresh24.com/introducing-a-new-payment-service-office/'
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            آشنایی با سرویس جدید و فعال‌سازی
                            <LaunchIcon fontSize="inherit" />
                        </a>
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
