import styles from './serviceBox.module.scss';

const ServiceBox = ({ title, description, icon }) => {
    return (
        <div className={styles['service-wrapper']}>
            <div className={styles['icon-wrapper']}>{icon}</div>
            <div className={styles['service-info']}>
                <div className={styles['title']}>{title}</div>
                {description && <span className={styles['description']}>{description}</span>}
            </div>
        </div>
    );
};

export { ServiceBox };
