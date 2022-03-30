import styles from './levelSelect.module.scss';
import { useState, useEffect } from 'react';
import CloseIcon from '@paziresh24/components/icons/public/close';

const LevelSelect = ({ label, icon, items, onChange, valueField, defaultValue, allLabel }) => {
    const [isOpen, setIsopen] = useState(false);
    const [values, setValues] = useState(null);
    const [searchValue, setSearchValue] = useState('');

    const addItem = item => {
        setValues(item);
    };

    document.body.addEventListener('click', e => {
        e.stopPropagation();
        isOpen && setIsopen(false);
    });

    useEffect(() => {
        onChange && onChange(values);
        setIsopen(false);
    }, [values]);

    useEffect(() => {
        if (defaultValue) {
            setValues(defaultValue);
        }
    }, [defaultValue]);

    return (
        <div
            className={styles.wrapper}
            onClick={e => {
                e.stopPropagation();
                setIsopen(label);
            }}
            aria-hidden
        >
            <div className={styles.header}>
                {icon}
                <span className={styles.title}>{label}</span>
                {values === null && <span className={styles.count}>{items?.length}</span>}
            </div>
            <div className={styles.valueWrapper}>
                {values === null ? (
                    <div className={styles.value}>{allLabel ?? 'همه مراکز'}</div>
                ) : (
                    <div className={styles.value}>
                        <span>
                            {items?.length > 0 &&
                                items.find(item => item[valueField] === values)?.name}
                        </span>
                        <CloseIcon
                            onClick={e => {
                                e.stopPropagation();
                                setValues(null);
                            }}
                        />
                    </div>
                )}
            </div>
            {isOpen === label && (
                <ul className={styles.select} onClick={e => e.stopPropagation()} aria-hidden>
                    <div className="p-4">
                        <input
                            type="text"
                            onChange={e => setSearchValue(e.target.value)}
                            value={searchValue}
                            placeholder="جستجو..."
                            className="h-16 w-full bg-[#e7eff5] rounded-lg p-4 outline-none"
                        />
                    </div>
                    {items.map(
                        item =>
                            item.name.toLowerCase().includes(searchValue.toLowerCase()) && (
                                <li
                                    key={item[valueField]}
                                    onClick={() => addItem(item[valueField])}
                                    aria-hidden
                                >
                                    {item.name}
                                </li>
                            )
                    )}
                </ul>
            )}
        </div>
    );
};

export default LevelSelect;
