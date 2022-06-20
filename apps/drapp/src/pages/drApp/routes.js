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
        component: lazy(() => import('./setting')),
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
        path: '/complaints/',
        name: 'Complaints',
        title: 'شکایات',
        component: lazy(() => import('./complaints')),
        isPrivate: true,
        exact: true
    },
    {
        path: '/consult/',
        name: 'Consult',
        title: 'چت مشاوره',
        component: lazy(() => import('./consult')),
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
        path: '/qa/',
        name: 'Qa',
        title: 'پرسش و پاسخ',
        component: lazy(() => import('./qa')),
        isPrivate: true,
        exact: true
    },
    {
        path: '/prescription/',
        name: 'Prescription',
        title: 'نسخه های ثبت شده',
        component: lazy(() => import('./prescription')),
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
        path: '/fill-info/',
        name: 'FillInfo',
        title: 'فعال سازی نوبت دهی',
        component: lazy(() => import('./fillInfo')),
        isPrivate: true,
        exact: false
    },
    {
        path: '/consult/fill-info/',
        name: 'FillInfo',
        title: 'ثبت نام ویزیت آنلاین',
        component: lazy(() => import('./consultRegister')),
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
        path: '/learn/',
        name: 'Learn',
        title: 'آموزش سامانه',
        component: lazy(() => import('./learn')),
        isPrivate: true,
        exact: false
    },
    {
        path: '/setting/duration',
        name: 'duration',
        title: 'ساعت کاری من',
        component: lazy(() => import('./duration')),
        isPrivate: true,
        exact: false
    },
    {
        path: '/setting/workhours',
        name: 'workhours',
        title: 'ساعت کاری من',
        component: lazy(() => import('./workHours')),
        isPrivate: true,
        exact: false
    },
    {
        path: '/setting/delay',
        name: 'delay',
        title: 'اعلام تاخیر به بیماران',
        component: lazy(() => import('./setting/delay/delay')),
        isPrivate: true,
        exact: false
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
