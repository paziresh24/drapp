import create from 'zustand';

interface PrescriptionSettingStore {
    setting: PaymentInfo;
    setSetting: (data: PaymentInfo) => void;
}

type PaymentInfo = {
    editProviders: boolean;
};

export const usePrescriptionSettingStore = create<PrescriptionSettingStore>(set => ({
    setting: {
        editProviders: true
    },
    setSetting: setting =>
        set(state => ({
            ...state,
            setting
        }))
}));
