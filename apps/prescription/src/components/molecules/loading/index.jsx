import styles from './loading.module.scss';
import { LoadingIcon } from '@paziresh24/shared/icon';

const Loading = () => {
    return (
        <div className={styles['wrapper']}>
            <LoadingIcon color="#3f3f79" width={35} height={35} />
        </div>
    );
};

export { Loading };
