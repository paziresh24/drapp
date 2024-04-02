import Container from '@mui/material/Container';
import { useEffect, useState } from 'react';
import { useDrApp } from '@paziresh24/context/drapp';
import { usePaymentSettingStore } from 'apps/drapp/src/store/paymentSetting.store';
import { useGetPaymentSetting } from 'apps/drapp/src/apis/payment/getPaymentSetting';
import { Tab, Tabs } from '@mui/material';
import Financial from 'apps/drapp/src/components/payment/finacial';
import { PaymentSetting } from 'apps/drapp/src/components/payment/setting';

const PaymentPage = () => {
    const [{ center }] = useDrApp();
    const getSetting = usePaymentSettingStore(state => state.setting);
    const getPaymentSetting = useGetPaymentSetting({ center_id: center?.id });
    const [tab, setTab] = useState(getSetting?.active ? 0 : 1);

    useEffect(() => {
        getPaymentSetting.remove();
        getPaymentSetting.refetch();
        setTab(getSetting?.active ? 0 : 1);
    }, [center, getSetting?.active]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    return (
        <Container
            maxWidth="sm"
            className="flex flex-col h-full !px-4 pt-2 md:pt-1 bg-white rounded-md md:h-auto md:p-5 md:mt-8 md:shadow-2xl md:shadow-slate-300"
        >
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
