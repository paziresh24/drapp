/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import * as React from 'react';
import ReactDOM from 'react-dom';
import './assets/styles/index.scss';
import './assets/styles/reset.scss';
import './assets/styles/base.scss';
import './assets/styles/tailwind.scss';
import { App } from './app';
import { Provider } from '@paziresh24/components/core/provider';
import { TourProvider } from '@reactour/tour';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const steps = [
    {
        id: 0,
        selector: '#step2',
        content: 'منو را باز کنید'
    },
    {
        id: 1,
        selector: '#provider-step',
        content: 'برای احراز هویت در بیمه های تامین اجتماعی و سلامت، وارد این قسمت شوید',
        position: 'left'
        // position: localStorage.getItem('isOpenMenu') ? 'left' : 'right'
    },
    {
        id: 2,
        selector: '#turnning-list-step',
        content:
            'لیست بیماران خود را از این قسمت ببینید. اگر نوبت دهی را از طریق پذیرش24 انجام نمی دهید، نوبت دهی خود را در زمانی دیگر فعال کنید تا هرروز لیست بیماران خودرا در این لیست ببینید',
        position: 'left'
    },
    {
        id: 3,
        selector: '#add-turn',
        content: 'برای شروع با اولین بیمار، کلیک کنید'
    },
    {
        id: 4,
        selector: '#turn-form',
        content:
            'کدملی یا کداتباع بیمار را وارد نمایید، برای تجویز نسخه بر روی تجویز نسخه کلیک کنید'
    },
    {
        id: 5,
        selector: `.row-select`,
        content:
            'در این قسمت وضعیت نسخه قابل مشاهده ست که کد رهگیری ان را نیز میتوان دید،  دقت کنید: اگر به هر دلیل سیستم های تامین و سلامت قطع باشند، نسخه صادر می شود و در وضعیت درحال ارسال قرار می گیرد تا پزشک دچار چالش نشود، بیمار بعد از دریافت پیامک ثبت نسخه میتواند برای دریافت خدمات تجویزی، به محل مورد نظر مراجعه کند',
        buttonText: 'پایان',
        buttonFn: () => {
            return;
        }
    },
    {
        id: 6,
        selector: `#_`,
        content: ''
    }
];

ReactDOM.render(
    <Provider>
        <TourProvider
            steps={steps}
            showBadge={false}
            showCloseButton={false}
            disableFocusLock={true}
            scrollSmooth={true}
            rtl={true}
            onClickMask={e => {
                return;
            }}
            prevButton={fn => {
                let interval = 0;
                if (!steps.find(item => item.id === fn.currentStep)?.buttonText) {
                    interval = setInterval(() => {
                        if (document.querySelector("[aria-label^='Go to next step']")) {
                            document.querySelector(
                                "[aria-label^='Go to next step']"
                            ).style.display = 'none';
                            document.querySelector('.reactour__popover > div').style.display =
                                'none';
                            clearInterval(interval);
                        }
                    }, 100);
                } else {
                    interval = setInterval(() => {
                        if (document.querySelector("[aria-label^='Go to next step']")) {
                            document.querySelector(
                                "[aria-label^='Go to next step']"
                            ).style.display = 'flex';
                            document.querySelector("[aria-label^='Go to next step']").dataset.text =
                                steps.find(item => item.id === fn.currentStep)?.buttonText;
                            document.querySelector(
                                "[aria-label^='Go to next step']"
                            ).style.display = 'flex';
                            if (steps.find(item => item.id === fn.currentStep)?.buttonFn) {
                                document
                                    .querySelector("[aria-label^='Go to next step']")
                                    .addEventListener('click', e => {
                                        e.stopPropagation();
                                        fn.setIsOpen(false);
                                        steps.find(item => item.id === fn.currentStep)?.buttonFn();
                                    });
                            }
                            if (steps.find(item => item.id === fn.currentStep)?.nextStep) {
                                document
                                    .querySelector("[aria-label^='Go to next step']")
                                    .addEventListener('click', e => {
                                        e.stopPropagation();
                                        fn.setCurrentStep(
                                            steps.find(item => item.id === fn.currentStep)?.nextStep
                                        );
                                    });
                            }
                            clearInterval(interval);
                        }
                    }, 100);
                }
            }}
        >
            <App />
        </TourProvider>
    </Provider>,
    document.getElementById('root')
);

serviceWorkerRegistration.register();
