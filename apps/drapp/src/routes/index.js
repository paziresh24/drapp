// IMPORT MAIN PAGES
import NotFoundPage from '../pages/404';
import DoctorApp from '../pages/drApp';

export const routes = [
    {
        path: '/',
        name: 'DoctorApp',
        component: DoctorApp,
        exact: false
    },
    {
        path: '/drapp/',
        name: 'Index',
        exact: false
    },
    { path: '*', name: '404', component: NotFoundPage, exact: false }
];
