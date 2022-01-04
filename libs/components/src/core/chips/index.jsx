import classNames from 'classnames';
import styles from './chips.module.scss';

const Chips = ({ children, theme }) => {
    return (
        <div className={classNames({ [styles['wrapper']]: true, [styles[theme]]: theme })}>
            <span className={styles['text']}>{children}</span>
        </div>
    );
};

export default Chips;
