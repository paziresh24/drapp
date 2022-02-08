import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Search, SearchFullPage } from '../Search/Search';
import styles from './SearchFiled.module.scss';
import { useLearnTour } from '@paziresh24/hooks/learn';
import { isMobile } from 'react-device-detect';
import VoiceSearch from './../voiceSearch/index';

const SearchFiled = ({
    serviceId,
    onChange,
    type,
    defaultValue,
    label,
    id,
    nextStep,
    error,
    typeId,
    insuranceType,
    voiceLabel
}) => {
    const [showSerch, setShowSearch] = useState(false);
    const [selectItem, setSelectItem] = useState();
    const searchRef = useRef();
    const [searchValue, setSearchValue] = useState('');
    const { tourState, setSteps } = useLearnTour();

    const [selectHover, setSelectHover] = useState(!isMobile ? 0 : null);
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (selectItem?.name && onChange) {
            setItem(selectItem);
        }
    }, [selectItem]);

    useEffect(() => {
        setSearchValue('');
        searchRef.current.value = '';
    }, [insuranceType]);

    const setItem = item => {
        searchRef.current.value = item?.name;
        onChange(item);
        tourState(true);
        setSteps(nextStep);
    };

    useEffect(() => {
        if (!defaultValue) {
            setSelectItem();
            searchRef.current.value = '';
            setSearchValue('');
        }
    }, [defaultValue]);

    // useEffect(() => {
    //     if (searchValue) {
    //         !isMobile && setSelectHover(0);
    //         setShowSearch(true);
    //     }
    // }, [searchValue]);

    useEffect(() => {
        if (showSerch) neutralizeBack();
    }, [showSerch]);

    const neutralizeBack = () => {
        if (isMobile) {
            window.history.pushState(null, '', window.location.href);
            window.onpopstate = () => {
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                window.onpopstate = () => {};
                setShowSearch(false);
            };
        }
    };

    const closeModalHandler = () => {
        if (isMobile) {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            window.onpopstate = () => {};
            window.history.back();
        }
        setShowSearch(false);
    };

    return (
        <div className={styles.wrapper} id={id}>
            <input
                ref={searchRef}
                className={`${styles.input} ${error ? styles.error : ''}`}
                defaultValue={selectItem?.name ? selectItem.name : ''}
                placeholder={label}
                id="searchFiled"
                autoComplete="off"
                aria-hidden
                onChange={e => {
                    setSearchValue(e.target.value);
                    e.target.value && !isMobile && setSelectHover(0);
                    e.target.value && setShowSearch(true);
                }}
                onFocus={() => {
                    setShowSearch(true);
                    tourState(false);
                }}
                onBlur={() => !isMobile && setShowSearch(false)}
                onKeyDown={e => {
                    e.keyCode === 40 &&
                        setSelectHover(prev => (prev < results.length - 1 ? prev + 1 : 0));
                    e.keyCode === 38 &&
                        setSelectHover(prev => (prev - 1 >= 0 ? prev - 1 : results.length - 1));
                }}
                // readOnly
            />
            {(window.location.host === window._env_.P24_MAIN_DOMAIN ||
                window.location.hostname === 'localhost') &&
                window?.webkitSpeechRecognition &&
                !window._env_.P24_IS_LOCAL_CENTER && (
                    <VoiceSearch
                        onChange={({ item, speechValue }) => {
                            setItem(item);
                            setSearchValue(speechValue);
                        }}
                        type={type}
                        typeId={typeId}
                        insuranceType={insuranceType}
                        label={voiceLabel}
                    />
                )}
            {!isMobile ? (
                <Search
                    isOpen={showSerch}
                    onClose={closeModalHandler}
                    serviceId={serviceId}
                    setSelectItem={setSelectItem}
                    type={type}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    setSelectHover={setSelectHover}
                    selectHover={selectHover}
                    label={label}
                    setResults={setResults}
                    typeId={typeId}
                    insuranceType={insuranceType}
                />
            ) : (
                <SearchFullPage
                    isOpen={showSerch}
                    onClose={closeModalHandler}
                    serviceId={serviceId}
                    setSelectItem={setSelectItem}
                    type={type}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    setSelectHover={setSelectHover}
                    selectHover={selectHover}
                    label={label}
                    setResults={setResults}
                    typeId={typeId}
                    insuranceType={insuranceType}
                />
            )}
        </div>
    );
};

export default SearchFiled;
