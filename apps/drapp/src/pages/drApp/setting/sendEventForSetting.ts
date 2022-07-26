import { getSplunkInstance } from '@paziresh24/shared/ui/provider';

type Action = 'load' | 'click';
type Type = 'page' | 'workHoues' | 'delay' | 'vacation';

interface SendEventForFeedbacks {
    action: Action;
    type: Type;
}

export const sendEventForSetting = ({ action, type }: SendEventForFeedbacks) => {
    getSplunkInstance().sendEvent({
        group: 'setting',
        type,
        event: { action }
    });
};
