import styles from './emptyState.module.scss';
import { EmptyStateIcon } from '@paziresh24/shared/icon';

const EmptyState = ({ text }) => {
    return (
        <div className={styles['emptyState']}>
            <EmptyStateIcon />
            <span className={styles['text']}>{text}</span>
        </div>
    );
};

export { EmptyState };
