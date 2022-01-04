import styles from './revenue.module.scss';
import classNames from 'classnames';
const Revenue = ({ title, priceType, priceNumber, incom }) => {
    const revenueClass = classNames({
        [styles['price-number']]: true,
        [styles['green']]: incom,
        [styles['red']]: !incom
    });

    return (
        <div className={styles['revenue']}>
            <span className={styles['title']}>{title}</span>
            <span className={revenueClass}>{priceNumber}</span>
            <span className={styles['price-type']}>{priceType}</span>
        </div>
    );
};

export { Revenue };
