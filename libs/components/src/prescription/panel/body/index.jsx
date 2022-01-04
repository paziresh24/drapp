import _ from 'lodash';
import styles from './body.module.scss';
import classNames from 'classnames';

const Body = props => {
    return (
        // <div className={styles['panel']}>
        <div
            className={classNames({
                [styles['wrapper']]: true,
                [styles[props.size]]: props.size
            })}
            {...props}
        />
        // </div>
    );
};

export { Body };
