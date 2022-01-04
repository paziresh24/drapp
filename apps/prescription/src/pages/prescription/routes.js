import { lazy } from 'react';

// IMPORT PAGES
const Providers = lazy(() => import('./providers'));
const Home = lazy(() => import('./home'));
const Types = lazy(() => import('./types'));
// import { Search } from './search';
// import { Details } from './details';
// import { EditItem } from './editItem';
const Create = lazy(() => import('./create'));
const NotFoundPage = lazy(() => import('../404'));

export const routes = [
    {
        path: '/providers',
        name: 'providers',
        component: Providers,
        isPrivate: true,
        exact: true
    },
    {
        path: '/',
        name: 'Home',
        component: Home,
        isPrivate: true,
        exact: true
    },
    {
        path: '/create',
        name: 'Create',
        component: Create,
        isPrivate: true,
        exact: true
    },
    {
        path: '/:prescriptionId',
        name: 'Types',
        component: Types,
        isPrivate: true,
        exact: true
    },
    // {
    //     path: '/:prescriptionId/:typeId',
    //     name: 'Search',
    //     component: Search,
    //     isPrivate: true,
    //     exact: true
    // },
    // {
    //     path: '/:prescriptionId/:typeId/:serviceId/create',
    //     name: 'Details',
    //     component: Details,
    //     isPrivate: true,
    //     exact: true
    // },
    // {
    //     path: '/:prescriptionId/:typeId/:serviceId',
    //     name: 'EditItem',
    //     component: EditItem,
    //     isPrivate: true,
    //     exact: true
    // },
    {
        path: '/*',
        name: '404',
        component: NotFoundPage,
        exact: true
    }
];
