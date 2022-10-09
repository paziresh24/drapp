import ReactDOM from 'react-dom/client';
import './assets/styles/index.scss';
import './assets/styles/reset.scss';
import './assets/styles/base.scss';
import './assets/styles/tailwind.scss';
import { App } from './app';
import { Provider } from '@paziresh24/shared/ui/provider';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { TourProvider } from '@reactour/tour';
import { ThemeProvider } from '@mui/material';
import theme from '../theme';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';

const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin]
});

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
    <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>
            <Provider>
                <App />
            </Provider>
        </ThemeProvider>
    </CacheProvider>
);

serviceWorkerRegistration.register();
