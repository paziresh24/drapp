import { useState, forwardRef, useEffect } from 'react';
import styles from './checkBox.module.scss';
import { v4 } from 'uuid';

const CheckBox = forwardRef(({ title, onChange, checked }, ref) => {
    const [id] = useState(v4());

    return (
        <div className={styles['checkbox']}>
            <input
                type="checkbox"
                ref={ref}
                className={styles['checkbox-input']}
                id={id}
                onChange={onChange}
                defaultChecked={checked}
            />
            <label className={styles['checkbox-label']} htmlFor={id}>
                {title}
            </label>
        </div>
    );
});

export { CheckBox };
