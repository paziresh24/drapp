import { useState, useEffect } from 'react';
import styles from './tab.module.scss';

const Tabs = ({ children, id, center, activeTab, onChange }) => {
    const [selected, setSelected] = useState(0);
    const select = i => setSelected(i);

    useEffect(() => {
        if (activeTab) {
            children.forEach((child, i) => {
                if (child?.props?.keyTab === activeTab) {
                    setSelected(i);
                }
            });
        }
    }, [activeTab]);

    useEffect(() => {
        if (select) {
            onChange && onChange(children[selected]?.props?.keyTab);
        }
    }, [selected]);

    return (
        <>
            <div className={styles['tab-buttons']} style={{ justifyContent: center && 'center' }}>
                {children.map(
                    (tab, i) =>
                        tab?.props && (
                            <button
                                key={tab.props.title}
                                onClick={() => select(i)}
                                className={i === selected ? styles['active'] : ''}
                                id={tab.props.id}
                            >
                                {tab.props.title}
                                {tab.props?.numberBadge && tab.props?.numberBadge !== 0 ? (
                                    <span className={styles.badge}>{tab.props.numberBadge}</span>
                                ) : (
                                    ''
                                )}
                            </button>
                        )
                )}
            </div>
            {children[selected]}
        </>
    );
};

const Tab = ({ children }) => children;

export { Tabs, Tab };
