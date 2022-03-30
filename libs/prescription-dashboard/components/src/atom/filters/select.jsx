import { useState, useEffect, useRef, memo } from 'react';
import styles from './select.module.scss';
import isEmpty from 'lodash/isEmpty';
import { CloseIcon } from '@paziresh24/components/icons';

const Select = memo(({ label, items, isOpen, setIsOpen, onChange, defaultValue, removeble }) => {
    const [value, setValue] = useState(defaultValue);

    const addItem = item => {
        setValue(item);
        onChange && onChange(item?.value);
    };

    return (
        <div
            className={styles.wrapper}
            onClick={e => {
                isOpen !== label && e.stopPropagation();
                setIsOpen(label);
            }}
            aria-hidden
        >
            <span>
                {label}
                {!isEmpty(value) && `: ${value.name}`}
            </span>
            {!isEmpty(value) && removeble && (
                <div
                    className={styles.removeButton}
                    onClick={e => {
                        e.stopPropagation();
                        addItem(null);
                    }}
                    aria-hidden
                >
                    <CloseIcon />
                </div>
            )}
            {isOpen === label && (
                <ul className={styles.select} onClick={e => e.stopPropagation()} aria-hidden>
                    {items.map(item => (
                        <li
                            key={item.value}
                            onClick={() => {
                                addItem(item);
                                setIsOpen(false);
                            }}
                            aria-hidden
                        >
                            {item.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
});

export default Select;
