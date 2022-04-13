import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { useEffect } from 'react';
import styles from './Select.module.scss';
import { isMobile } from 'react-device-detect';
import ReactTooltip from 'react-tooltip';
import { v4 } from 'uuid';
import isEmpty from 'lodash/isEmpty';

const Select = ({
    items = [],
    onChange,
    defaultValue,
    simple,
    error,
    focus,
    setFocus,
    ...props
}) => {
    const id = v4();
    const randomeKey = Math.random();

    const [showOptions, setShowOptopns] = useState(false);
    const [value, setValue] = useState({});
    const [searchValue, setSearchValue] = useState('');
    const [selectHover, setSelectHover] = useState(0);
    const [options, setOptions] = useState(items ?? []);

    useEffect(() => {
        if (items.length > 0 && Array.isArray(items)) setOptions(items);
    }, [items]);

    useEffect(() => {
        if (!defaultValue) return setValue({});
        setDefaultValue();
    }, [defaultValue, items]);

    const setDefaultValue = useCallback(() => {
        if (defaultValue && items.length > 0 && +value.id !== +defaultValue) {
            return setValue({
                id: defaultValue ?? null,
                name: items.find(item => +item.value == +defaultValue)?.name ?? null
            });
        }
    }, [defaultValue, items]);

    const changeValue = useCallback(() => onChange && value.id && onChange(value), [value]);

    useEffect(() => {
        if (setSearchValue) setSearchValue('');
        if (showOptions) {
            setSelectHover(0);
        }
    }, [showOptions]);

    useEffect(() => {
        changeValue();
    }, [value]);

    useEffect(() => {
        if (showOptions) {
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
                document.getElementById(randomeKey + selectHover).scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'nearest'
                });
        }
    }, [selectHover, showOptions]);

    const input = useRef();

    const func = event => {
        if (showOptions) {
            if (event.keyCode === 13) {
                setValue({
                    name: options[selectHover]?.name,
                    id: +options[selectHover]?.value
                });
                setShowOptopns(false);
                setFocus && setFocus(false);
                input.current.blur();
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
                    placeholder={props.placeholder ?? ' '}
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
                    onFocus={() => setShowOptopns(true)}
                    onBlur={() => {
                        setShowOptopns(false);
                        setFocus && setFocus(false);
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
            {showOptions && (
                <ul className={[styles.options].join(' ')} aria-hidden>
                    {options &&
                        options.map((item, i) => (
                            <li
                                className={`${styles.option} ${
                                    selectHover === i && styles.selected
                                }`}
                                key={item.value + Math.random()}
                                id={randomeKey + i}
                                onMouseDown={() => {
                                    setValue({ id: +item.value, name: item.name });
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

export default Select;
