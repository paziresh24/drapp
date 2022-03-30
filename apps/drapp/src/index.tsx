import ReactDOM from 'react-dom';
import './assets/styles/index.scss';
import './assets/styles/reset.scss';
import './assets/styles/base.scss';
import './assets/styles/tailwind.scss';
import { App } from './app';
import { Provider } from '@paziresh24/components/core/provider';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { TourProvider } from '@reactour/tour';

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
        <Provider>
            <App />
        </Provider>
    </TourProvider>,
    document.getElementById('root')
);

serviceWorkerRegistration.register();
