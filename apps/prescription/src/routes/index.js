// IMPORT MAIN PAGES
import NotFoundPage from '../pages/404';
import { Prescription } from '../pages/prescription';

export const routes = [
    {
        path: '/',
        name: 'Prescription',
        component: Prescription,
        exact: false
    },
    { path: '*', name: '404', component: NotFoundPage, exact: false }
];
