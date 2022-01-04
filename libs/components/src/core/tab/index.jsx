import { useState, useEffect } from 'react';
import styles from './tab.module.scss';

const Tabs = ({ children, id, center, activeTab }) => {
    const [selected, setSelected] = useState(0);
    const select = i => setSelected(i);

    useEffect(() => {
        if (activeTab) {
            children.forEach((child, i) => {
                if (child.props.keyTab === activeTab) {
                    setSelected(i);
                }
            });
        }
    }, [activeTab]);

    return (
        <div>
            <div className={styles['tab-buttons']} style={{ justifyContent: center && 'center' }}>
                {children.map((tab, i) => (
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
                ))}
            </div>
            {children[selected]}
        </div>
    );
};

const Tab = ({ children }) => children;

export { Tabs, Tab };
