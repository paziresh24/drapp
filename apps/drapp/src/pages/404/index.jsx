/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import styles from 'assets/styles/pages/notFound/index.module.scss';
import Error from '@paziresh24/shared/ui/error';

const NotFoundPage = () => {
    return <Error code={404} error="Page Not Found" message="صفحه پیدا نشد." />;
};

export default NotFoundPage;
