import styles from './searchItem.module.scss';
import { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { extractTypeFromName, translateType } from '@paziresh24/utils';

const SearchItem = props => {
    const addHandler = () => {
        props.setSelectItem({
            id: props.id,
            name: props.title,
            defaultValue: {
                count: props.default?.count ?? props.count ?? null,
                use_time: props.default?.use_time ?? props.use_time?.id ?? null,
                use_instruction: props.default?.use_instruction ?? null,
                how_to_use: props.default?.how_to_use ?? null,
                brand: props.default?.brand ?? null,
                description: props.default?.description ?? null
            },
            serviceType: props.serviceType,
            shape: props.shape ?? null,
            isServicesOfDoctors: props.serviceType.id === 5
        });
        props.onClose && props.onClose(false);
    };

    const itemRef = useRef();

    const addItemWithEnterKey = e => {
        if (e.keyCode === 13 && props.selectHover === props.selectHoverId) {
            addHandler();
        }
    };

    useEffect(() => {
        if (props.selectHover === props.selectHoverId) {
            itemRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'nearest'
            });

            document.getElementById('searchFiled').addEventListener('keydown', addItemWithEnterKey);
        } else {
            document
                .getElementById('searchFiled')
                .removeEventListener('keydown', addItemWithEnterKey);
        }
    }, [props.selectHover, props.selectHoverId]);

    return (
        <div
            className={classNames({
                [styles['wrapper']]: true,
                [styles['favorite']]: props.actions === 'favorite',
                [styles.selected]: props.selectHover === props.selectHoverId
            })}
            onMouseDown={addHandler}
            aria-hidden
            ref={itemRef}
        >
            <div
                className={`${styles['title']} ${
                    +props.serviceType.id === 79 || +props.serviceType.id === 1 ? styles.ltr : ''
                }`}
            >
                <div style={{ display: 'inline-block' }}>
                    <span style={{ color: 'gray', opacity: '0.8', margin: '0 0.5rem' }}>
                        {props.serviceCode + ' '}
                    </span>
                    {(+props.serviceType.id === 79 || +props.serviceType.id === 1) &&
                        translateType(extractTypeFromName(props.title)) && (
                            <span className={styles['type']}>
                                {translateType(extractTypeFromName(props.title))}
                            </span>
                        )}
                </div>

                <span>{props.title}</span>
            </div>
        </div>
    );
};

export default SearchItem;
