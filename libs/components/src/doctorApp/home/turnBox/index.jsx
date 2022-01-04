import styles from './turnBox.module.scss';
import { Overlay } from '../../../core/overlay';
import { Link } from 'react-router-dom';

const TurnBox = ({ title, turnNumber, cardIcon, loading, link }) => {
    return (
        <Link to={link} className={styles['turn-box']}>
            {!loading && (
                <>
                    {cardIcon}
                    <span className={styles['title']}>{title}</span>
                    <span className={styles['sub-title']}>{turnNumber}</span>
                </>
            )}
            {loading && <Overlay />}
        </Link>
    );
};

export { TurnBox };
