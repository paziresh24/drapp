import styles from './levelSelect.module.scss';
import { useState, useEffect } from 'react';
import CloseIcon from '@paziresh24/components/icons/public/close';

const LevelSelect = ({ label, icon, items, onChange, valueField, defaultValue, allLabel }) => {
    const [isOpen, setIsopen] = useState(false);
    const [values, setValues] = useState(null);
    const [search, setSearch] = useState('');

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
                    <div style={{ padding: '1rem' }}>
                        <input
                            type="text"
                            onChange={e => setSearch(e.target.value)}
                            value={search}
                            placeholder="جستجو..."
                            style={{
                                height: '4.5rem',
                                width: '100%',
                                background: '#e7eff5',
                                borderRadius: '0.6rem',
                                padding: '1rem',
                                outline: 0
                            }}
                        />
                    </div>
                    {items.map(
                        item =>
                            item.name.toLowerCase().includes(search.toLowerCase()) && (
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
