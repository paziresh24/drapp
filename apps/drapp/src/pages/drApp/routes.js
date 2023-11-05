import { lazy } from 'react';

export const routes = [
    {
        path: '/auth/',
        name: 'Auth',
        component: lazy(() => import('./auth')),
        isPrivate: false,
        dontShowForHospital: false,
        exact: true
    },
    {
        path: '/p24auth/',
        name: 'Auth',
        component: lazy(() => import('./auth')),
        isPrivate: false,
        dontShowForHospital: false,
        exact: true
    },
    {
        path: '/',
        name: 'DrApp',
        isPrivate: true,
        title: 'لیست بیماران',
        component: lazy(() => import('./turning')),
        dontShowForHospital: false,
        exact: true,
        showCenterListForMobile: true
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        isPrivate: true,
        title: 'گزارش نسخه نویسی',
        component: lazy(() =>
            import('@paziresh24/apps/prescription/pages/prescription/statistics')
        ),
        dontShowForHospital: false,
        exact: true
    },
    {
        path: '/activation/',
        name: 'Activation',
        title: 'راه اندازی',
        component: lazy(() => import('./activation')),
        isPrivate: true,
        dontShowForHospital: false,
        exact: true
    },
    {
        path: '/activation/office/center/',
        name: 'OfficeCenterActivation',
        title: 'محل مطب من',
        component: lazy(() => import('./activation/office/center')),
        isPrivate: true,
        dontShowForHospital: false,
        exact: true
    },
    {
        path: '/activation/office/cost/',
        name: 'OfficeCostActivation',
        title: 'مبلغ بیعانه',
        component: lazy(() => import('./activation/office/cost')),
        isPrivate: true,
        dontShowForHospital: false,
        exact: true
    },
    {
        path: '/activation/office/workhours/',
        name: 'OfficeWorkhoursActivation',
        title: 'مدت زمان ویزیت',
        component: lazy(() => import('./activation/office/workhours')),
        isPrivate: true,
        dontShowForHospital: false,
        exact: true
    },
    {
        path: '/activation/office/duration/',
        name: 'OfficeDurationActivation',
        title: 'ساعت کاری',
        component: lazy(() => import('./activation/office/duration')),
        isPrivate: true,
        dontShowForHospital: false,
        exact: true
    },
    {
        path: '/activation/consult/rules/',
        name: 'OfficeMessengerRulesActivation',
        title: 'قوانین و مقررات',
        component: lazy(() => import('./activation/consult/rules')),
        isPrivate: true,
        dontShowForHospital: false,
        exact: true
    },
    {
        path: '/activation/consult/onboarding/',
        name: 'doctorOnboarding',
        title: 'آنبوردینگ پزشک ویزیت آنلاین',
        component: lazy(() => import('./activation/consult/onboarding')),
        isPrivate: true,
        dontShowForHospital: false,
        exact: true
    },
    {
        path: '/activation/consult/messengers/',
        name: 'OfficeMessengerRulesActivation',
        title: 'پیام رسان',
        component: lazy(() => import('./activation/consult/messengers')),
        isPrivate: true,
        dontShowForHospital: false,
        exact: true
    },
    {
        path: '/activation/consult/cost/',
        name: 'OfficeCostActivation',
        title: 'مبلغ ویزیت آنلاین',
        component: lazy(() => import('./activation/consult/cost')),
        isPrivate: true,
        dontShowForHospital: false,
        exact: true
    },
    {
        path: '/activation/consult/workhours/',
        name: 'ConsultWorkhoursActivation',
        title: 'ساعت کاری',
        component: lazy(() => import('./activation/consult/workhours')),
        isPrivate: true,
        dontShowForHospital: false,
        exact: true
    },
    {
        path: '/Services',
        name: 'Services',
        title: 'پذیرش24',
        component: lazy(() => import('./superMenu')),
        isPrivate: true,
        dontShowForHospital: false,
        exact: true
    },
    {
        path: '/turning/setting/',
        name: 'Setting',
        title: 'تقویم کاری',
        component: lazy(() => import('./setting/cosnult')),
        isPrivate: true,
        dontShowForHospital: false,
        exact: false
    },
    {
        path: '/profile/',
        name: 'Profile',
        title: 'پروفایل کاربری',
        component: lazy(() => import('./profile')),
        isPrivate: true,
        dontShowForHospital: false,
        exact: true
    },
    {
        path: '/profile/info',
        name: 'ProfileInfo',
        title: 'اطلاعات فردی',
        component: lazy(() => import('./profile/info')),
        isPrivate: true,
        dontShowForHospital: false,
        exact: true
    },
    {
        path: '/profile/biography',
        name: 'Biography',
        title: 'بیوگرافی',
        component: lazy(() => import('./profile/biography')),
        isPrivate: true,
        dontShowForHospital: false,
        exact: true
    },
    {
        path: '/profile/expertises',
        name: 'Expertises',
        title: 'ویرایش تخصص',
        component: lazy(() => import('./profile/expertises')),
        isPrivate: true,
        dontShowForHospital: false,
        exact: true
    },
    {
        path: '/profile/gallery',
        name: 'Gallery',
        title: 'گالری',
        component: lazy(() => import('./profile/gallery')),
        isPrivate: true,
        dontShowForHospital: false,
        exact: true
    },
    {
        path: '/feedbacks/',
        name: 'Feedbacks',
        title: 'نظرات بیماران',
        component: lazy(() => import('./feedbacks')),
        isPrivate: true,
        dontShowForHospital: false,
        showCenterListForMobile: true,
        exact: true
    },
    {
        path: '/create-center',
        name: 'CreateCenter',
        component: lazy(() => import('./createCenter')),
        title: 'ایجاد مطب',
        isPrivate: true,
        dontShowForHospital: false,
        exact: true
    },
    {
        path: '/consult-term/',
        name: 'ConsultTerm',
        title: 'قوانین و مقررات',
        component: lazy(() => import('./consult/term')),
        isPrivate: true,
        dontShowForHospital: false,
        exact: true
    },
    {
        path: '/prescription/',
        name: 'Prescription',
        title: 'نسخه های ثبت شده',
        component: lazy(() => import('@paziresh24/apps/prescription/pages/prescription/home')),
        isPrivate: true,
        dontShowForHospital: false,
        exact: true
    },
    {
        path: '/prescription/patient/:prescriptionId',
        name: 'PrescriptionId',
        title: 'نسخه نویسی',
        component: lazy(() => import('@paziresh24/apps/prescription/pages/prescription/types')),
        isPrivate: true,
        dontShowForHospital: false,
        exact: true
    },
    {
        path: '/providers',
        name: 'PrescriptionProviders',
        title: 'بیمه های من',
        component: lazy(() => import('@paziresh24/apps/prescription/pages/prescription/providers')),
        isPrivate: true,
        dontShowForHospital: false,
        showCenterListForMobile: true,
        exact: true
    },
    {
        path: '/prescription/create',
        name: 'PrescriptionCreate',
        title: 'صدور نسخه',
        component: lazy(() => import('@paziresh24/apps/prescription/pages/prescription/create')),
        isPrivate: true,
        dontShowForHospital: false,
        exact: true
    },
    {
        path: '/favorite/templates',
        name: 'PrescriptionTemplate',
        title: 'نسخه پراستفاده های من',
        component: lazy(() => import('@paziresh24/apps/prescription/pages/prescription/templates')),
        isPrivate: true,
        dontShowForHospital: false,
        exact: true
    },
    {
        path: '/favorite/templates/add',
        name: 'PrescriptionTemplate',
        title: 'افزودن نسخه پراستفاده',
        component: lazy(() =>
            import('@paziresh24/apps/prescription/pages/prescription/templates/addTemplates')
        ),
        isPrivate: true,
        dontShowForHospital: false,
        exact: true
    },
    {
        path: '/favorite/templates/:prescriptionId',
        name: 'PrescriptionTemplate',
        title: 'ویرایش نسخه پراستفاده',
        component: lazy(() =>
            import('@paziresh24/apps/prescription/pages/prescription/templates/editTemplates')
        ),
        isPrivate: true,
        dontShowForHospital: false,
        exact: true
    },
    {
        path: '/favorite/service',
        name: 'ServiceFavorite',
        title: 'اقلام پراستفاده',
        component: lazy(() =>
            import('@paziresh24/apps/prescription/pages/prescription/serviceFavorite')
        ),
        isPrivate: true,
        dontShowForHospital: false,
        exact: true
    },
    {
        path: '/fill-info/secretary',
        name: 'Secretary',
        title: 'اطلاعات منشی',
        component: lazy(() => import('./fillInfo/secretary')),
        isPrivate: true,
        dontShowForHospital: false,
        exact: false
    },

    {
        path: '/financial/',
        name: 'Financial',
        title: 'مدیریت مالی',
        component: lazy(() => import('./financial')),
        isPrivate: true,
        dontShowForHospital: true,
        exact: false
    },
    {
        path: '/setting/payment',
        name: 'Payment',
        title: 'پرداخت',
        component: lazy(() => import('./setting/payment')),
        isPrivate: true,
        dontShowForHospital: true,
        exact: false,
        showCenterListForMobile: true
    },
    {
        path: '/setting',
        name: 'setting',
        title: 'تنظیمات نوبتدهی',
        component: lazy(() => import('./setting')),
        isPrivate: true,
        dontShowForHospital: true,
        exact: true,
        showCenterListForMobile: true
    },
    {
        path: '/setting/workhours',
        name: 'workhours',
        title: 'ساعت کاری من',
        component: lazy(() => import('./setting/workHours')),
        isPrivate: true,
        dontShowForHospital: true,
        exact: false,
        showCenterListForMobile: true
    },
    {
        path: '/setting/delay',
        name: 'delay',
        title: 'اعلام تاخیر',
        component: lazy(() => import('./setting/delay')),
        isPrivate: true,
        dontShowForHospital: true,
        exact: false,
        showCenterListForMobile: true
    },
    {
        path: '/setting/vacation',
        name: 'delay',
        title: 'اعلام مرخصی',
        component: lazy(() => import('./setting/vacation')),
        isPrivate: true,
        dontShowForHospital: true,
        exact: false,
        showCenterListForMobile: true
    },
    {
        path: '/landing/igap',
        name: 'igap-landing',
        title: 'ویزیت آنلاین',
        component: lazy(() => import('./landing/igap')),
        isPrivate: true,
        dontShowForHospital: false,
        exact: true
    },
    {
        path: '/forough',
        name: 'forough',
        title: 'آمار مهم من',
        component: lazy(() => import('./forough')),
        isPrivate: true,
        dontShowForHospital: false,
        exact: true
    },
    {
        path: '/forough/improve',
        name: 'forough-improve',
        title: 'بهبود رتبه در نتایج',
        component: lazy(() => import('./forough/improve')),
        isPrivate: true,
        dontShowForHospital: false,
        exact: true
    },
    {
        path: '/complaints/',
        name: 'Complaints',
        title: 'شکایات',
        component: lazy(() => import('./complaints')),
        isPrivate: true,
        dontShowForHospital: false,
        exact: true
    },
    {
        path: '/logout',
        name: 'logout',
        component: lazy(() => import('./logout')),
        exact: true
    },
    {
        path: '/onlineVisitRules',
        name: 'onlineVisitRules',
        title: 'قوانین و مقررات',
        component: lazy(() => import('./onlineVisitRules')),
        isPrivate: true,
        dontShowForHospital: false,
        exact: true
    },
    {
        path: '*',
        name: '404',
        component: lazy(() => import('../../pages/404')),
        exact: true
    }
];
