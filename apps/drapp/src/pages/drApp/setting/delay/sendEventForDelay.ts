import { getSplunkInstance } from '@paziresh24/shared/ui/provider';

type Action =
    | 'load'
    | `${Exclude<DelayType['value'], 'vacation'>}${'minutes' | 'hours'}`
    | 'vacation';

interface SendEventForDelay {
    action: Action;
}

export const sendEventForDelay = ({ action }: SendEventForDelay) => {
    getSplunkInstance().sendEvent({
        group: 'delay',
        type: 'click-late-announcement',
        event: { action }
    });
};
