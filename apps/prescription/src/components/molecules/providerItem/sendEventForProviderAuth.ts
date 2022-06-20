import { getSplunkInstance } from '@paziresh24/shared/ui/provider';

type Providers = 'tamin' | 'salamat';

interface SendEventForFeedbacks {
    provider: Providers;
    status: 'success' | 'failure';
    action: 'created' | 'edited';
}

export const sendEventForProviderAuth = ({ provider, status, action }: SendEventForFeedbacks) => {
    const actionFlag = action === 'edited' ? '-edited' : '';

    getSplunkInstance().sendEvent({
        group: 'register',
        type: 'verify-insurance',
        event: {
            action: `${status}-${provider}${actionFlag}`
        }
    });
};
