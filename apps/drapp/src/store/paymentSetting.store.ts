import create from 'zustand';
import { devtools } from 'zustand/middleware';

interface PaymentSettingStore {
    setting: PaymentInfo;
    setSetting: (data: SetSetting) => void;
}

interface SetSetting extends Omit<PaymentInfo, 'active'> {
    active: '1' | '0';
}

type PaymentInfo = {
    active: boolean;
    card_number: string;
    deposit_amount: number;
    shaba: string;
};

export const usePaymentSettingStore = create<PaymentSettingStore>(
    devtools(set => ({
        setting: {
            active: true,
            card_number: '',
            deposit_amount: 0,
            shaba: ''
        },
        setSetting: setting =>
            set(state => ({
                ...state,
                setting: {
                    ...setting,
                    active: setting.active === '1' ? true : false
                }
            }))
    }))
);
