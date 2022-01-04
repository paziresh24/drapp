import styles from './emptyState.module.scss';
import { EmptyStateIcon } from '../../icons';

const EmptyState = ({ text }) => {
    return (
        <div className={styles['emptyState']}>
            <EmptyStateIcon />
            <span className={styles['text']}>{text}</span>
        </div>
    );
};

export { EmptyState };
