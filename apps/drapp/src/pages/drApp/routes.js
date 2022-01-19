/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { lazy } from 'react';
import Learn from './learn';
import PrescriptionId from '@paziresh24/apps/prescription/pages/prescription/types';
import Templates from '@paziresh24/apps/prescription/pages/prescription/templates';
import AddTemplate from '@paziresh24/apps/prescription/pages/prescription/templates/addTemplates';
import EditTemplate from '@paziresh24/apps/prescription/pages/prescription/templates/editTemplates';
import ServiceFavorite from '@paziresh24/apps/prescription/pages/prescription/serviceFavorite';
import Create from '@paziresh24/apps/prescription/pages/prescription/create';

// import pages
import DrApp from './home';
import Consult from './consult';
import Turning from './turning';
import LogOut from './logout';
import GChat from './gchat';
import Prescription from './prescription';
import Providers from '@paziresh24/apps/prescription/pages/prescription/providers';
const SmsPanel = lazy(() => import('./smsPanel'));
const FillInfo = lazy(() => import('./fillInfo'));
const Auth = lazy(() => import('./auth'));
import Profile from './profile';
const Feedbacks = lazy(() => import('./feedbacks'));
const Complaints = lazy(() => import('./complaints'));
const Setting = lazy(() => import('./setting'));
const Financial = lazy(() => import('./financial'));
const Qa = lazy(() => import('./qa'));
const NotFoundPage = lazy(() => import('../../pages/404'));
const ConsultTurning = lazy(() => import('./consult/consult-turning'));
const ConsultTerm = lazy(() => import('./consult/term'));
const SueperMenu = lazy(() => import('./superMenu'));

export const routes = [
    {
        path: '/auth/',
        name: 'Auth',
        component: Auth,
        isPrivate: false,
        exact: true
    },
    {
        path: '/p24auth/',
        name: 'Auth',
        component: Auth,
        isPrivate: false,
        exact: true
    },
    {
        path: '/',
        name: 'DrApp',
        title: 'خانه',
        component: DrApp,
        isPrivate: true,
        exact: true
    },
    {
        path: '/Services',
        name: 'Services',
        title: 'پذیرش24',
        component: SueperMenu,
        isPrivate: true,
        exact: true
    },
    {
        path: '/gchat',
        name: 'GChat',
        title: 'پشتیبانی',
        component: GChat,
        isPrivate: true,
        exact: true
    },
    {
        path: '/turning/',
        name: 'Turning',
        title: 'لیست بیماران',
        component: Turning,
        isPrivate: true,
        exact: true
    },
    {
        path: '/turning/setting/',
        name: 'Setting',
        title: 'تقویم کاری',
        component: Setting,
        isPrivate: true,
        exact: false
    },
    {
        path: '/profile/',
        name: 'Profile',
        title: 'پروفایل کاربری',
        component: Profile,
        isPrivate: true,
        exact: true
    },
    {
        path: '/feedbacks/',
        name: 'Feedbacks',
        title: 'نظرات بیماران',
        component: Feedbacks,
        isPrivate: true,
        exact: true
    },
    {
        path: '/complaints/',
        name: 'Complaints',
        title: 'شکایات',
        component: Complaints,
        isPrivate: true,
        exact: true
    },
    {
        path: '/consult/',
        name: 'Consult',
        title: 'چت مشاوره',
        component: Consult,
        isPrivate: true,
        exact: true
    },
    {
        path: '/consult-turning/',
        name: 'ConsultTurning',
        title: 'نوبت های مشاوره',
        component: ConsultTurning,
        isPrivate: true,
        exact: true
    },
    {
        path: '/consult-term/',
        name: 'ConsultTerm',
        title: 'قوانین و مقررات',
        component: ConsultTerm,
        isPrivate: true,
        exact: true
    },
    {
        path: '/qa/',
        name: 'Qa',
        title: 'پرسش و پاسخ',
        component: Qa,
        isPrivate: true,
        exact: true
    },
    {
        path: '/prescription/',
        name: 'Prescription',
        title: 'نسخه های ثبت شده',
        component: Prescription,
        isPrivate: true,
        exact: true
    },
    {
        path: '/prescription/patient/:prescriptionId',
        name: 'PrescriptionId',
        title: 'نسخه نویسی',
        component: PrescriptionId,
        isPrivate: true,
        exact: true
    },
    {
        path: '/providers',
        name: 'PrescriptionProviders',
        title: 'بیمه های من',
        component: Providers,
        isPrivate: true,
        exact: true
    },
    {
        path: '/prescription/create',
        name: 'PrescriptionCreate',
        title: 'صدور نسخه',
        component: Create,
        isPrivate: true,
        exact: true
    },
    {
        path: '/favorite/templates',
        name: 'PrescriptionTemplate',
        title: 'نسخه پراستفاده های من',
        component: Templates,
        isPrivate: true,
        exact: true
    },
    {
        path: '/favorite/templates/add',
        name: 'PrescriptionTemplate',
        title: 'افزودن نسخه پراستفاده',
        component: AddTemplate,
        isPrivate: true,
        exact: true
    },
    {
        path: '/favorite/templates/:prescriptionId',
        name: 'PrescriptionTemplate',
        title: 'ویرایش نسخه پراستفاده',
        component: EditTemplate,
        isPrivate: true,
        exact: true
    },
    {
        path: '/favorite/service-favorite',
        name: 'ServiceFavorite',
        title: 'اقلام پراستفاده',
        component: ServiceFavorite,
        isPrivate: true,
        exact: true
    },
    {
        path: '/smspanel/',
        name: 'SmsPanel',
        component: SmsPanel,
        isPrivate: true,
        exact: true
    },
    {
        path: '/fill-info/',
        name: 'FillInfo',
        title: 'فعال سازی نوبت دهی',
        component: FillInfo,
        isPrivate: true,
        exact: false
    },
    {
        path: '/financial/',
        name: 'Financial',
        title: 'مدیریت مالی',
        component: Financial,
        isPrivate: true,
        exact: false
    },
    {
        path: '/learn/',
        name: 'Learn',
        title: 'آموزش سامانه',
        component: Learn,
        isPrivate: true,
        exact: false
    },
    {
        path: '/logout',
        name: 'logout',
        component: LogOut,
        exact: true
    },
    // {
    //     path: '/wallet',
    //     name: 'wallet',
    //     title: 'کیف پول',
    //     component: Wallet,
    //     isPrivate: true,
    //     exact: true
    // },
    {
        path: '/drapp/',
        name: 'drapp',
        component: '',
        exact: true
    },
    {
        path: '*',
        name: '404',
        component: NotFoundPage,
        exact: true
    }
];
