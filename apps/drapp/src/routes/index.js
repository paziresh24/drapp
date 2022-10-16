// IMPORT MAIN PAGES
import NotFoundPage from '../pages/404';
import DoctorApp from '../pages/drApp';
import IgapLanding from '../pages/landing/igap';

export const routes = [
    {
        path: '/landing/igap',
        name: 'Index',
        exact: true,
        component: IgapLanding
    },
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
