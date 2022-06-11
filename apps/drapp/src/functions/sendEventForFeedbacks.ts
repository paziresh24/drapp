import { getSplunkRateAndReviewInstance } from '@paziresh24/shared/ui/provider';
import queryString from 'query-string';

type Action = 'load' | 'like' | 'reply';

interface SendEventForFeedbacks {
    action: Action;
}

export const sendEventForFeedbacks = ({ action }: SendEventForFeedbacks) => {
    if (window.location.search) {
        getSplunkRateAndReviewInstance().sendEvent({
            group: 'doctor interaction',
            type: 'doctor interaction',
            event: { action, ...queryString.parse(window.location.search) }
        });
    }
};
