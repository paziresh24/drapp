import styles from './item.module.scss';

const DiagnosisItem = props => {
    const addHandler = () => {
        props.setSelectItem({
            id: props.id,
            name: props.title,
            category: props.category
        });
        props.onClose(false);
    };

    return (
        <div className={styles['wrapper']} onClick={addHandler} aria-hidden>
            <div className={styles['title']}>
                <span>{props.title}</span>
            </div>
        </div>
    );
};

export default DiagnosisItem;
