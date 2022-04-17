import classNames from 'classnames';
import styles from './chips.module.scss';

const Chips = ({ children, theme, className }) => {
    return (
        <div
            className={classNames({
                [styles['wrapper']]: true,
                [styles[theme]]: theme,
                [className]: className
            })}
        >
            <span className={styles['text']}>{children}</span>
        </div>
    );
};

export default Chips;
