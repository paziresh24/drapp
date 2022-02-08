import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { TransitionGroup } from 'react-transition-group';
import { useEffect } from 'react';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import TagManager from 'react-gtm-module';

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
const isMainDomain = location.host === window._env_.P24_MAIN_DOMAIN;

if (isProduction && isMainDomain && !window._env_.P24_DISABLE_THIRD_PARTY) {
    Sentry.init({
        dsn: 'https://e61a90738da845c19044453cacd98d94@p24guard.paziresh24.com/9',
        integrations: [new Integrations.BrowserTracing()],
        tracesSampleRate: 1.0,
        environment: process.env.NODE_ENV
    });
}

if (!isProduction) {
    Sentry.init({
        dsn: 'https://e61a90738da845c19044453cacd98d94@p24guard.paziresh24.com/9',
        integrations: [new Integrations.BrowserTracing()],
        tracesSampleRate: 1.0,
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

window.addEventListener('goftino_ready', function () {
    window.__goftino_ready = true;
    Goftino.setWidget({
        cssUrl: '/style/gstyle.css',
        hasIcon: false,
        hasSound: true
    });
});

if (localStorage.getItem('APP_VERSION')) {
    console.log('---------------- DrApp PWA ----------------');
    console.log(`v${localStorage.getItem('APP_VERSION')}`);
    console.log('-------------------------------------------');
    window.__drapp = {
        version: localStorage.getItem('APP_VERSION')
    };
}

const Provider = ({ children }) => {
    return (
        <Router basename={process.env.PUBLIC_URL}>
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
