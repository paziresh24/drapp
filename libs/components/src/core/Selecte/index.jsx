import { useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './select.module.scss';

import SearchBar from '../../prescription/search/searchBar';
import Modal from '../modal';
import TextArea from '../textArea';
import Button from '../button';
import { ChevronIcon, CloseIcon } from '../../icons/';
import _ from 'lodash';
import { createPortal } from 'react-dom';

const Select = props => {
    const [openSelectModal, setOpenSelectModal] = useState(false);
    const [openOtherModal, setOpenOtherModal] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [item, setItem] = useState({});

    useEffect(async () => {
        const itemsArr = [];
        await props.children.map(child =>
            itemsArr.push({ value: child.props.value, children: child.props.children })
        );
        setItem(itemsArr.find(item => item.value === props['default-value']));
    }, [props['default-value']]);

    useEffect(() => {
        item?.value && props.value(item.value);
    }, [item]);

    useEffect(() => {
        if (openSelectModal) return document.body.classList.add(styles['open-modal']);
        if (!openOtherModal) return document.body.classList.remove(styles['open-modal']);
    }, [openSelectModal]);

    const selectItem = value => {
        openSelectModalToggle();
        if (value === 'other') return openOtherModalToggle();
        props.value(value.value);
        setItem(value);
    };
    const removeItem = () => {
        setItem({});
    };

    const openSelectModalToggle = e => {
        e && e.preventDefault();
        if (!openSelectModal) return setOpenSelectModal(true);
        setSearchValue('');
        setOpenSelectModal(false);
    };

    const openOtherModalToggle = () => {
        if (!openOtherModal) return setOpenOtherModal(true);
        setOpenOtherModal(false);
    };

    return (
        <>
            <div className={styles['wrapper']}>
                <label>{props.label}</label>
                <button className={styles['input']} onClick={openSelectModalToggle}>
                    <span>{!_.isEmpty(item) ? item.children : 'انتخاب کنید'}</span>
                    <ChevronIcon dir="bottom" />
                </button>
            </div>
            {openSelectModal && (
                <SelectModal
                    openSelectModalToggle={openSelectModalToggle}
                    setSearchValue={setSearchValue}
                    item={item}
                    removeItem={removeItem}
                    selectItem={selectItem}
                    props={props}
                    searchValue={searchValue}
                />
            )}
            <Modal
                title={props.label}
                isOpen={openOtherModal}
                onClose={() => setOpenOtherModal(false)}
            >
                <TextArea placeholder="اینجا بنویسید ..." />
                <Button block variant="primary" icon="arrow">
                    تایید
                </Button>
            </Modal>
        </>
    );
};

const SelectModal = ({
    openSelectModalToggle,
    setSearchValue,
    item,
    removeItem,
    selectItem,
    props,
    searchValue
}) => {
    return createPortal(
        <div className={styles['modal-wrapper']} onClick={openSelectModalToggle} aria-hidden>
            <div className={styles['modal']} onClick={e => e.stopPropagation()} aria-hidden>
                <div className={styles['modal-header']}>
                    <div className={styles['titlebar']}>
                        <span className={styles['modal-title']}>{props.label}</span>
                        <CloseIcon onClick={openSelectModalToggle} />
                    </div>
                    <div className={styles.searchBar}>
                        <SearchBar value={setSearchValue} label={`جستجوی بین ${props.label} ...`} />
                    </div>
                </div>
                <hr />
                <ul>
                    {!_.isEmpty(item) && (
                        <li className={styles['selected']}>
                            {item.children}
                            <span
                                className={styles['remove-item']}
                                onClick={removeItem}
                                aria-hidden
                            >
                                حذف انتخاب
                            </span>
                        </li>
                    )}
                    {props.children.map(
                        child =>
                            child.props.children.toLowerCase().includes(searchValue) &&
                            child.props.value !== item?.value && (
                                <li
                                    key={child.props.value}
                                    onClick={() => selectItem(child.props)}
                                    aria-hidden="true"
                                    className={classNames({
                                        [styles['selected']]: item?.value === child.props.value
                                    })}
                                >
                                    {child.props.children}
                                </li>
                            )
                    )}
                </ul>
            </div>
        </div>,
        document.getElementById('root')
    );
};

const Option = () => null;

export { Select, Option };
