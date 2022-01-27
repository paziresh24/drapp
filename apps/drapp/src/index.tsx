import ReactDOM from 'react-dom';
import './assets/styles/index.scss';
import './assets/styles/reset.scss';
import './assets/styles/base.scss';
import './assets/styles/tailwind.scss';
import { App } from './app';
import { Provider } from '@paziresh24/components/core/provider';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

ReactDOM.render(
    <Provider>
        <App />
    </Provider>,
    document.getElementById('root')
);

serviceWorkerRegistration.register();
