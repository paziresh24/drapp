import styles from './select.module.scss';

const Select = ({ id, group, value, selected, icon, title, onChange }) => {
    return (
        <div className={styles['wrapper']}>
            <input
                id={id}
                name={group}
                className={styles['input']}
                type="radio"
                value={value}
                defaultChecked={selected}
                onChange={onChange}
            />
            <label className={`${styles['label']} ${styles['circle']}`} htmlFor={id}>
                {icon}
                <span>{title}</span>
            </label>
        </div>
    );
};

export default Select;
