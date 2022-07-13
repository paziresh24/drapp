import styles from './infoBox.module.scss';
import classNames from 'classnames';

const InfoBox = ({ title, number, color, onClick, active }) => {
    return (
        <div
            className={classNames({ [styles['info-box']]: true, [styles['active']]: active })}
            style={{ backgroundColor: color }}
            onClick={onClick}
            aria-hidden
        >
            <span className={styles['title']}>{title}</span>
            <span className={styles['value']}>{number}</span>
        </div>
    );
};

export { InfoBox };
