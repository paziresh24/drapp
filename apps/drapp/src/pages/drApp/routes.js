import { lazy } from 'react';

export const routes = [
    {
        path: '/auth/',
        name: 'Auth',
        component: lazy(() => import('./auth')),
        isPrivate: false,
        exact: true
    },
    {
        path: '/p24auth/',
        name: 'Auth',
        component: lazy(() => import('./auth')),
        isPrivate: false,
        exact: true
    },
    {
        path: '/',
        name: 'DrApp',
        isPrivate: true,
        title: 'لیست بیماران',
        component: lazy(() => import('./turning')),
        exact: true
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        isPrivate: true,
        title: 'گزارش نسخه نویسی',
        component: lazy(() =>
            import('@paziresh24/apps/prescription/pages/prescription/statistics')
        ),
        exact: true
    },
    {
        path: '/activation/',
        name: 'Activation',
        title: 'راه اندازی',
        component: lazy(() => import('./activation')),
        isPrivate: true,
        exact: true
    },
    {
        path: '/activation/office/center/',
        name: 'OfficeCenterActivation',
        title: 'محل مطب من',
        component: lazy(() => import('./activation/office/center')),
        isPrivate: true,
        exact: true
    },
    {
        path: '/activation/office/cost/',
        name: 'OfficeCostActivation',
        title: 'مبلغ بیعانه',
        component: lazy(() => import('./activation/office/cost')),
        isPrivate: true,
        exact: true
    },
    {
        path: '/activation/office/workhours/',
        name: 'OfficeWorkhoursActivation',
        title: 'مدت زمان ویزیت',
        component: lazy(() => import('./activation/office/workhours')),
        isPrivate: true,
        exact: true
    },
    {
        path: '/activation/office/duration/',
        name: 'OfficeDurationActivation',
        title: 'ساعت کاری',
        component: lazy(() => import('./activation/office/duration')),
        isPrivate: true,
        exact: true
    },
    {
        path: '/activation/consult/whatsapp/',
        name: 'OfficeWhatsappActivation',
        title: 'شماره واتس اپ',
        component: lazy(() => import('./activation/consult/whatsapp')),
        isPrivate: true,
        exact: true
    },
    {
        path: '/activation/consult/cost/',
        name: 'OfficeCostActivation',
        title: 'مبلغ ویزیت آنلاین',
        component: lazy(() => import('./activation/consult/cost')),
        isPrivate: true,
        exact: true
    },
    {
        path: '/activation/consult/workhours/',
        name: 'ConsultWorkhoursActivation',
        title: 'ساعت کاری',
        component: lazy(() => import('./activation/consult/workhours')),
        isPrivate: true,
        exact: true
    },
    {
        path: '/Services',
        name: 'Services',
        title: 'پذیرش24',
        component: lazy(() => import('./superMenu')),
        isPrivate: true,
        exact: true
    },
    {
        path: '/turning/setting/',
        name: 'Setting',
        title: 'تقویم کاری',
        component: lazy(() => import('./setting/cosnult')),
        isPrivate: true,
        exact: false
    },
    {
        path: '/profile/',
        name: 'Profile',
        title: 'پروفایل کاربری',
        component: lazy(() => import('./profile')),
        isPrivate: true,
        exact: true
    },
    {
        path: '/feedbacks/',
        name: 'Feedbacks',
        title: 'نظرات بیماران',
        component: lazy(() => import('./feedbacks')),
        isPrivate: true,
        exact: true
    },
    {
        path: '/create-center',
        name: 'CreateCenter',
        component: lazy(() => import('./createCenter')),
        title: 'ایجاد مطب',
        isPrivate: true,
        exact: true
    },
    {
        path: '/consult-term/',
        name: 'ConsultTerm',
        title: 'قوانین و مقررات',
        component: lazy(() => import('./consult/term')),
        isPrivate: true,
        exact: true
    },
    {
        path: '/prescription/',
        name: 'Prescription',
        title: 'نسخه های ثبت شده',
        component: lazy(() => import('@paziresh24/apps/prescription/pages/prescription/home')),
        isPrivate: true,
        exact: true
    },
    {
        path: '/prescription/patient/:prescriptionId',
        name: 'PrescriptionId',
        title: 'نسخه نویسی',
        component: lazy(() => import('@paziresh24/apps/prescription/pages/prescription/types')),
        isPrivate: true,
        exact: true
    },
    {
        path: '/providers',
        name: 'PrescriptionProviders',
        title: 'بیمه های من',
        component: lazy(() => import('@paziresh24/apps/prescription/pages/prescription/providers')),
        isPrivate: true,
        exact: true
    },
    {
        path: '/prescription/create',
        name: 'PrescriptionCreate',
        title: 'صدور نسخه',
        component: lazy(() => import('@paziresh24/apps/prescription/pages/prescription/create')),
        isPrivate: true,
        exact: true
    },
    {
        path: '/favorite/templates',
        name: 'PrescriptionTemplate',
        title: 'نسخه پراستفاده های من',
        component: lazy(() => import('@paziresh24/apps/prescription/pages/prescription/templates')),
        isPrivate: true,
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
        exact: true
    },
    {
        path: '/fill-info/secretary',
        name: 'Secretary',
        title: 'اطلاعات منشی',
        component: lazy(() => import('./fillInfo/secretary')),
        isPrivate: true,
        exact: false
    },

    {
        path: '/financial/',
        name: 'Financial',
        title: 'مدیریت مالی',
        component: lazy(() => import('./financial')),
        isPrivate: true,
        exact: false
    },
    {
        path: '/setting/payment',
        name: 'Payment',
        title: 'تنظیمات پرداخت',
        component: lazy(() => import('./setting/payment')),
        isPrivate: true,
        exact: false
    },
    {
        path: '/setting',
        name: 'setting',
        title: 'تنظیمات نوبت های من',
        component: lazy(() => import('./setting')),
        isPrivate: true,
        exact: true
    },
    {
        path: '/setting/workhours',
        name: 'workhours',
        title: 'ساعت کاری من',
        component: lazy(() => import('./setting/workHours')),
        isPrivate: true,
        exact: false
    },
    {
        path: '/setting/delay',
        name: 'delay',
        title: 'اعلام تاخیر به بیماران',
        component: lazy(() => import('./setting/delay')),
        isPrivate: true,
        exact: false
    },
    {
        path: '/setting/vacation',
        name: 'delay',
        title: 'اعلام مرخصی',
        component: lazy(() => import('./setting/vacation')),
        isPrivate: true,
        exact: false
    },
    {
        path: '/landing/igap',
        name: 'igap-landing',
        title: 'ویزیت آنلاین',
        component: lazy(() => import('./landing/igap')),
        isPrivate: true,
        exact: true
    },
    {
        path: '/logout',
        name: 'logout',
        component: lazy(() => import('./logout')),
        exact: true
    },
    {
        path: '*',
        name: '404',
        component: lazy(() => import('../../pages/404')),
        exact: true
    }
];
