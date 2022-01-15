import { useLearnTour } from '@paziresh24/hooks/learn';
import { useRef, useState } from 'react';
import { useEffect } from 'react';
import styles from './Select.module.scss';
import { isMobile } from 'react-device-detect';
import { CloseIcon } from '../../icons';
import SearchBar from './../../prescription/search/searchBar/index';
import { createPortal } from 'react-dom';
import ReactTooltip from 'react-tooltip';
import { v4 } from 'uuid';
import isEmpty from 'lodash/isEmpty';

const Select = ({ items, onChange, defaultValue, simple, error, focus, setFocus, ...props }) => {
    const id = v4();
    const randomeKey = Math.random();

    const [showOptions, setShowOptopns] = useState(false);
    const [value, setValue] = useState();
    const [searchValue, setSearchValue] = useState('');
    const [selectHover, setSelectHover] = useState(0);
    const [options, setOptions] = useState([]);
    const { tourState, setSteps } = useLearnTour();

    useEffect(() => {
        setOptions(items);
    }, [items]);

    useEffect(() => {
        setValue({
            id: defaultValue ?? null,
            name: items.find(item => +item.value == +defaultValue)?.name ?? null
        });
    }, [items, defaultValue]);

    useEffect(() => {
        if (setSearchValue) setSearchValue('');
        if (showOptions) {
            setSelectHover(0);
        }
    }, [showOptions]);

    useEffect(() => {
        onChange && value && onChange(value);
    }, [value]);

    useEffect(() => {
        if (showOptions) {
            // setSelectHover(0);

            if (!searchValue) return setOptions(items);
            if (searchValue) {
                setOptions(
                    items.filter(item =>
                        item.name
                            .replace(/ي/g, 'ی')
                            .replace(/ك/g, 'ک')
                            .replace(/ /g, '')
                            .toLowerCase()
                            .includes(
                                searchValue
                                    .toLowerCase()
                                    .replace(/ي/g, 'ی')
                                    .replace(/ك/g, 'ک')
                                    .replace(/ /g, '')
                            )
                    )
                );
            }
        }
    }, [searchValue, showOptions]);

    useEffect(() => {
        if (showOptions) {
            if (!isEmpty(options) && !isMobile)
                document
                    .getElementById(randomeKey + selectHover)
                    .scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        }
    }, [selectHover, showOptions]);

    const input = useRef();

    const func = event => {
        if (showOptions) {
            if (event.keyCode === 13) {
                setValue({
                    name: options[selectHover]?.name,
                    id: options[selectHover]?.value
                });
                setShowOptopns(false);
            }
        }
        input.current.removeEventListener('keydown', func);
    };

    useEffect(() => {
        input.current.addEventListener('keydown', func);
    }, [showOptions, options, selectHover]);

    useEffect(() => {
        if (focus) input.current.focus();
    }, [focus]);

    return (
        <div className={`${styles.wrapper} ${simple ? styles.simple : ''}`}>
            <label className={[props.disabled && styles.disabled].join(' ')}>
                <input
                    ref={input}
                    className={[styles.input, error && styles.error].join(' ')}
                    disabled={props.disabled}
                    type={props.type}
                    value={!showOptions ? value?.name ?? '' : searchValue}
                    name={props.name}
                    placeholder=" "
                    onKeyDown={e => {
                        e.keyCode === 40 &&
                            setSelectHover(prev => (prev < options.length - 1 ? prev + 1 : 0));
                        e.keyCode === 38 &&
                            setSelectHover(prev => (prev - 1 >= 0 ? prev - 1 : options.length - 1));
                    }}
                    onChange={e => showOptions && setSearchValue(e.target.value)}
                    style={props.style}
                    autoComplete="off"
                    onClick={() => setShowOptopns(true)}
                    onFocus={() => {
                        setShowOptopns(true);
                        tourState(false);
                    }}
                    onBlur={() => {
                        !isMobile && setShowOptopns(false);
                        setFocus(false);
                    }}
                    readOnly={isMobile}
                    data-tip
                    data-for={id}
                />
                <span className={styles['label']}>{props.label}</span>
                {!showOptions && value?.name && (
                    <ReactTooltip id={id} place="top" type="dark" effect="solid">
                        {value?.name}
                    </ReactTooltip>
                )}
            </label>
            {showOptions && isMobile && (
                <SelectModal
                    items={options}
                    itemSelect={value}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    setValue={setValue}
                    openSelectModalToggle={() => setShowOptopns(prev => !prev)}
                    label={props.label}
                />
            )}
            {!isMobile && showOptions && (
                <ul className={[styles.options].join(' ')} aria-hidden>
                    {options &&
                        options.map((item, i) => (
                            <li
                                className={`${styles.option} ${
                                    selectHover === i && styles.selected
                                }`}
                                key={item.value + Math.random()}
                                id={randomeKey + i}
                                onMouseDown={e => {
                                    // e.stopPropagation();
                                    setValue({ name: item.name, id: item.value });
                                    setShowOptopns(false);
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
};

const SelectModal = ({
    openSelectModalToggle,
    setSearchValue,
    itemSelect,
    selectItem,
    props,
    searchValue,
    items,
    setValue,
    label
}) => {
    return createPortal(
        <div className={styles['modal-wrapper']} onClick={openSelectModalToggle} aria-hidden>
            <div className={styles['modal']} onClick={e => e.stopPropagation()} aria-hidden>
                <div className={styles['modal-header']}>
                    <div className={styles['titlebar']}>
                        <span className={styles['modal-title']}>{label}</span>
                        <CloseIcon onClick={openSelectModalToggle} />
                    </div>

                    <div className={styles.searchBar}>
                        <SearchBar value={setSearchValue} label="جستجو ..." />
                    </div>
                </div>
                <hr />
                <ul>
                    {!isEmpty(itemSelect?.name) && (
                        <li className={styles['selected']}>{itemSelect.name}</li>
                    )}
                    {items.map(
                        item =>
                            item.name.toLowerCase().includes(searchValue) &&
                            item.name !== itemSelect?.name && (
                                <li
                                    key={item.value}
                                    onMouseDown={() => {
                                        setValue({ name: item.name, id: item.value });
                                        openSelectModalToggle();
                                    }}
                                    aria-hidden="true"
                                >
                                    {item.name}
                                </li>
                            )
                    )}
                </ul>
            </div>
        </div>,
        document.getElementById('root')
    );
};

export default Select;
