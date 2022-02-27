// import pages
import { CompleteInfo } from './completeInfo';
import { WorkDays } from './workDays';
import { CenterInfo } from './centerInfo';
import { ExpertisesPage } from './expertises';

export const routes = [
    {
        path: '/consult/fill-info',
        name: 'CompleteInfo',
        Component: CompleteInfo,
        exact: true
    },
    {
        path: '/consult/fill-info/center-info',
        name: 'CenterInfo',
        Component: CenterInfo,
        exact: true
    },
    {
        path: '/consult/fill-info/expertises',
        name: 'Expertises',
        Component: ExpertisesPage,
        exact: true
    },
    {
        path: '/consult/fill-info/work-days',
        name: 'WorkDays',
        Component: WorkDays,
        exact: true
    }
];
