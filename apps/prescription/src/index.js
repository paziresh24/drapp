import * as React from 'react';
import ReactDOM from 'react-dom';
import './assets/styles/index.scss';
import './assets/styles/reset.scss';
import './assets/styles/base.scss';
import './assets/styles/tailwind.css';
import { App } from './App';
// import { Provider } from './components/core/provider';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { TourProvider } from '@reactour/tour';

const steps = [
    {
        id: 0,
        selector: '#taminPorviderItem',
        content: 'برای احراز هویت تامین اجتماعی اینجا کلیک کنید',
        buttonText: 'گذشتن از این مرحله',
        nextStep: 2
    },
    {
        id: 1,
        selector: '#taminFillInfo',
        content:
            'دقت نمایید؛ پیش از احراز هویت در این قسمت، می بایست حتما در سایت تامین اجتماعی، نسخه نویسی خود را فعال کرده باشید',
        position: 'right'
    },
    {
        id: 2,
        selector: '#salamatPorviderItem',
        content: 'برای احراز هویت سلامت اینجا کلیک کنید',
        buttonText: 'گذشتن از این مرحله',
        buttonFn: () => {
            window.parent.postMessage(
                {
                    drappEvent: ['backToTurningLearn']
                },
                '*'
            );
        }
    },
    {
        id: 3,
        selector: '#salamatFillInfo',
        content:
            'یوزرنیم و پسووردی که از بیمه سلامت دریافت کرده اید را وارد کنید اگر با بیمه سلامت قرارداد ندارید، از نماینده بیمه سلامت استان خود این موضوع را پیگیری کنید',

        position: 'right'
    },
    {
        id: 4,
        selector: '#salamatOtp',
        content: 'کد تایید ارسال شده را وارد نمایید'
    },
    {
        id: 5,
        selector: '#diagnosis_step',
        content:
            'می توانید بصورت اختیاری، تشخیص خود را بر اساس اخرین استاندارد who (ICD11) وارد کنید',
        buttonText: 'گذشتن از این مرحله',
        nextStep: 6
    },
    {
        id: 6,
        selector: '#drug_step',
        content:
            'سه حرف اول دارو مد نظر را وارد کنید، از داخل این لیست دارو مورد نظر را پیدا کنید و ا توجه به تگ های کنار دارو، به راحتی می توانید نوع دارو را پیدا کنید'
    },
    {
        id: 7,
        selector: '#star_step',
        content: 'اگر دارویی رو زیاد قراره استفاده کنید، ستاره دار کنید'
    },
    {
        id: 8,
        selector: '#favorite_button_step',
        content: 'برای مشاهده داروهای ستاره دار اینجا کلیک کنید'
    },
    {
        id: 9,
        selector: '#template_button_step',
        content:
            'بعد از اینکه نسخه را کامل کردید، از این قسمت میتوانید ان را جزو نسخ پر استفاده خود ذخیر کنید تا برای بیمار بعدی، بتوانید کل این نسخه را فقط با یک کلیک صادر کنید'
    },
    {
        id: 10,
        selector: '#add_template_button_step',
        content: 'برای افزودن نسخه فعلی در نسخه های پراستفاده اینجا کلیک کنید'
    },
    {
        id: 11,
        selector: '#name_template_button_step',
        content: 'یک نام برای نسخه بنویسید'
    },
    {
        id: 12,
        selector: '#pcase_button_step',
        content: 'برای دیدن سوابق بیمار اینجا کلیک کنید'
    },
    {
        id: 13,
        selector: '#show_pcase_button_step',
        content:
            'کلیه سوابق دارویی بیمار ( که از طریق سامانه پذیرش24 ثبت شده اند) از این قسمت قابل مشاهده و قابل انتخاب برای تجویز مجدد می باشد'
    },
    {
        id: 14,
        selector: '#submitServices',
        content: 'برای ثبت نهایی کلیک کنید',
        position: 'top'
    },
    {
        id: 15,
        showNavigation: false,
        selector: '#p_info',
        content: 'در این قسمت اطلاعات بیمار قابل مشاهده است و نوع بیمه را می بینید'
    },
    {
        id: 16,
        selector: '#amount_drug_step',
        content:
            'دستورات مصرف را وارد کنید، سیستم در یک هفته اول در حال یادگیری از شماست و پس از آن، فیلد های دارو ها براساس رفتار شما، پر خواهد شد'
    },
    {
        id: 17,
        selector: '#show_favorite_step',
        content:
            'برای بیماران دیگر، بجای سرچ نام دارو، داروهایی که ذخیره کردید را  به راحتی انتخاب کنید'
    },
    {
        id: 18,
        selector: '#lab_tab_step',
        content: 'برای تجویز آزمایش اینجا کلیک کنید'
    },
    {
        id: 19,
        selector: '#add_lab_step',
        content: 'برای افزودن آزمایش کلیک کنید'
    },
    {
        id: 20,
        selector: '#search_lab_step',
        content: 'نام فارسی یا انگلیسی آزمایش را وارد کنید'
    },
    {
        id: 21,
        selector: '#amount_lab_step',
        content:
            'تاریخ موثر انجام آزمایش را وارد کنید، برای سهولت کار شما، بصورت پیش فرض تاریخ روی امروز تنظیم شده است',
        buttonText: 'گذشتن از این مرحله',
        nextStep: 27
    },
    {
        id: 22,
        selector: '#add_other_step',
        content: 'برای افزودن پاراکلینیک کلیک کنید'
    },
    {
        id: 23,
        selector: '#search_other_step',
        content: 'نام خدمت یا کد مربوط به آن را وارد کنید'
    },
    {
        id: 24,
        selector: '#amount_other_step',
        content:
            'تاریخ موثر انجام آزمایش را وارد کنید، برای سهولت کار شما، بصورت پیش فرض تاریخ روی امروز تنظیم شده است',
        buttonText: 'گذشتن از این مرحله'
    },
    {
        id: 25,
        selector: '#cell_tamin_step',
        content: 'شماره موبایلی که با آن در سایت تامین اجتماعی ثبت نام کرده اید را وارد کنید'
    },
    {
        id: 26,
        selector: '#username_password_tamin_step',
        content:
            'یوزر نیم و پسوورد تامین اجتماعی را اگر وارد کنید( اختیاری) ، کلیه نسخه های پرتکراری که در تامین اجتماعی تعریف کردید، در قسمت نسخ پراستفاده خواهید دید'
    },
    {
        id: 27,
        selector: '#other_tab_step',
        content: 'برای تجویز پاراکلینیک اینجا کلیک کنید'
    },
    {
        id: 28,
        selector: '#p_info',
        content: 'در این قسمت اطلاعات بیمار قابل مشاهده است و نوع بیمه را می بینید',
        buttonText: 'ادامه',
        nextStep: 29
    },
    {
        id: 29,
        selector: '#p_cell',
        content:
            'شماره ای که بیمار با آن بیمه خود را اخذ کرده قابل مشاهده ست که می توانید آن را تغییر دهید. این شماره برای ارسال پیام ثبت نسخه و ارسال نسخه pdf استفاده می شود',
        buttonText: 'ادامه',
        nextStep: 5
    },
    {
        id: 30,
        selector: '#cell_edit_step',
        content: 'این شماره برای ارسال پیام ثبت نسخه و ارسال نسخه pdf استفاده می شود'
    }
];

// ReactDOM.render(
//     <Provider>
//         <TourProvider
//             steps={steps}
//             showBadge={false}
//             showCloseButton={false}
//             disableFocusLock={true}
//             scrollSmooth={true}
//             rtl={true}
//             onClickMask={e => {
//                 return;
//             }}
//             prevButton={fn => {
//                 let interval = 0;
//                 if (!steps.find(item => item.id === fn.currentStep)?.buttonText) {
//                     interval = setInterval(() => {
//                         if (document.querySelector("[aria-label^='Go to next step']")) {
//                             document.querySelector(
//                                 "[aria-label^='Go to next step']"
//                             ).style.display = 'none';
//                             document.querySelector('.reactour__popover > div').style.display =
//                                 'none';
//                             clearInterval(interval);
//                         }
//                     }, 100);
//                 } else {
//                     interval = setInterval(() => {
//                         if (document.querySelector("[aria-label^='Go to next step']")) {
//                             document.querySelector(
//                                 "[aria-label^='Go to next step']"
//                             ).style.display = 'flex';
//                             document.querySelector("[aria-label^='Go to next step']").dataset.text =
//                                 steps.find(item => item.id === fn.currentStep)?.buttonText;
//                             document.querySelector(
//                                 "[aria-label^='Go to next step']"
//                             ).style.display = 'flex';
//                             if (steps.find(item => item.id === fn.currentStep)?.buttonFn) {
//                                 document
//                                     .querySelector("[aria-label^='Go to next step']")
//                                     .addEventListener('click', e => {
//                                         e.stopPropagation();
//                                         fn.setIsOpen(false);
//                                         steps.find(item => item.id === fn.currentStep)?.buttonFn();
//                                     });
//                             }
//                             if (steps.find(item => item.id === fn.currentStep)?.nextStep) {
//                                 document
//                                     .querySelector("[aria-label^='Go to next step']")
//                                     .addEventListener('click', e => {
//                                         e.stopPropagation();
//                                         fn.setCurrentStep(
//                                             steps.find(item => item.id === fn.currentStep)?.nextStep
//                                         );
//                                     });
//                             }
//                             clearInterval(interval);
//                         }
//                     }, 100);
//                 }
//             }}
//             // showNavigation={false}
//         >
//             <App />
//         </TourProvider>
//     </Provider>,
//     document.getElementById('root')
// );

serviceWorkerRegistration.register();
