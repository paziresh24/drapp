import styles from './overlay.module.scss';
import { LoadingIcon } from '../../icons';

const Overlay = () => {
    return (
        <div className={styles['overlay']}>
            <LoadingIcon color="#3f4079" width={41} height={41} />
        </div>
    );
};

export { Overlay };
