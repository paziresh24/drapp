import { splunk } from '@paziresh24/splunk-event';

export default function plasmicSplunkEvent({
    token,
    group,
    type,
    data
}: {
    token: string;
    group: string;
    type: string;
    data: Record<string, any>;
}) {
    splunk
        .create({
            baseUrl: 'https://p24splk.paziresh24.com',
            token: token,
            constant: {
                client_information: {
                    identifier: localStorage.getItem('client_identifier'),
                    user_agent: window.navigator.userAgent
                },
                user_information: window.user_information,
                current_url: window.location.href
            }
        })
        .sendEvent({
            group,
            type,
            event: data
        });
}
