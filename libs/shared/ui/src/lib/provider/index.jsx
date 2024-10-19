import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { TransitionGroup } from 'react-transition-group';
import { useEffect } from 'react';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import TagManager from 'react-gtm-module';
import { splunk as splunkEvent } from '@paziresh24/splunk-event';
import { v4 as uuidV4 } from 'uuid';

toast.configure({
    position: 'top-right',
    autoClose: 10000,
    hideProgressBar: false,
    newestOnTop: true,
    closeOnClick: true,
    rtl: true,
    pauseOnFocusLoss: false,
    draggable: true,
    pauseOnHover: false,
    closeButton: true,
    limit: 3,
    theme: 'colored'
});

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: false
        }
    }
});

const isProduction = process.env.NODE_ENV === 'production';
const isMainDomain = window.location.host === window._env_.P24_MAIN_DOMAIN;

if (!window._env_.P24_DISABLE_THIRD_PARTY) {
    Sentry.init({
        dsn: process.env.REACT_APP_SENTRY_DSN,
        environment: process.env.NODE_ENV
    });
}

if (isProduction && isMainDomain && !window._env_.P24_DISABLE_THIRD_PARTY) {
    TagManager.initialize({
        gtmId: 'GTM-P5RPLDP'
    });
}

if (!isProduction) {
    TagManager.initialize({
        gtmId: 'GTM-P5RPLDP'
    });
}

if (localStorage.getItem('APP_VERSION')) {
    console.log('---------------- DrApp PWA ----------------');
    console.log(`v${localStorage.getItem('APP_VERSION')}`);
    console.log('-------------------------------------------');
    window.__drapp = {
        version: localStorage.getItem('APP_VERSION')
    };
}

if (!localStorage.getItem('client_identifier')) {
    localStorage.setItem('client_identifier', uuidV4());
}

export const getSplunkInstance = () =>
    splunkEvent.create({
        baseUrl: window._env_.P24_SPLUNK_BASE_URL,
        token: window._env_.P24_SPLUNK_TOKEN,
        constant: {
            client_information: {
                identifier: localStorage.getItem('client_identifier'),
                user_agent: window.navigator.userAgent
            },
            user_information: window.user_information,
            current_url: window.location.href,
            referrer: document.referrer
        }
    });

export const getSplunkRateAndReviewInstance = () =>
    splunkEvent.create({
        baseUrl: window._env_.P24_SPLUNK_BASE_URL,
        token: '26018e14-efd5-41a3-8b3d-ca263f0c68ac',
        constant: {
            client_information: {
                user_agent: window.navigator.userAgent
            },
            current_url: window.location.href
        }
    });

const Provider = ({ children }) => {
    return (
        <Router
            basename={window.location.pathname.split('/')[1] === 'doctorapp' ? '/doctorapp/' : ''}
        >
            <ScrollToTop />
            <QueryClientProvider client={queryClient}>
                <TransitionGroup>{children}</TransitionGroup>
            </QueryClientProvider>
        </Router>
    );
};

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

export { Provider };
