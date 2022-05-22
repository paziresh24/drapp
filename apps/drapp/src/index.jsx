import ReactDOM from 'react-dom';
import './assets/styles/index.scss';
import './assets/styles/reset.scss';
import './assets/styles/base.scss';
import './assets/styles/tailwind.scss';
import { App } from './app';
import { Provider } from '@paziresh24/shared/ui/provider';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { TourProvider } from '@reactour/tour';
import { ThemeProvider } from '@mui/material';
import theme from '../mui.theme';

const steps = [
    {
        id: 0,
        selector: '#profile-dropdown',
        content: 'به منظور شناخت بهتر بیماران، بیوگرافی خود را تکمیل نمایید.'
    }
];
ReactDOM.render(
    <TourProvider
        steps={steps}
        showBadge={false}
        showCloseButton={false}
        disableFocusLock={true}
        scrollSmooth={true}
        rtl={true}
        showNavigation={false}
        onClickMask={() => {
            return;
        }}
    >
        <ThemeProvider theme={theme}>
            <Provider>
                <App />
            </Provider>
        </ThemeProvider>
    </TourProvider>,
    document.getElementById('root')
);

serviceWorkerRegistration.register();
