import { CSSTransition } from 'react-transition-group';
import { useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import styles from './Search.module.scss';
import { ChevronIcon, LoadingIcon } from '../../../icons';
import SearchItem from '../../search/searchItem';
import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';
import { useSearch } from '@paziresh24/hooks/prescription';
import { useInView } from 'react-intersection-observer';
import Frequent from './Frequent';
import { isMobile } from 'react-device-detect';
import serviceTypeList from '@paziresh24/constants/serviceTypeList.json';
import { createPortal } from 'react-dom';
import SquareToggle from '@paziresh24/components/core/squareToggle';

export const Search = ({
    isOpen,
    onClose,
    setSelectItem,
    type,
    searchValue,
    setSearchValue,
    label,
    selectHover,
    typeId,
    noSearchBar,
    insuranceType,
    isIrc,
    ...props
}) => {
    const [results, setResults] = useState([]);
    const [prescriptionInfo] = useSelectPrescription();
    // const [searchValue, setSearchValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);

    const search = useSearch(`${prescriptionInfo?.id ?? prescriptionInfo?.id}`, {
        _q: insuranceType === 'salamat' && !searchValue ? 'a' : searchValue,
        _start: page,
        _limit: 10,
        ...(type === 'drugs' && { type: serviceTypeList[type][insuranceType] }),
        ...(type === 'lab' && { type: serviceTypeList[type][insuranceType] }),
        ...(type === 'imaging' && {
            type: insuranceType === 'tamin' ? typeId : 3
        }),
        ...(type === 'others' && {
            type_nin: insuranceType === 'tamin' ? [79, 80, 81, 83, 84, 85] : [1, 2, 3]
        }),
        ...(isIrc && { isIrc: true }),
        provider: insuranceType
    });
    const searchInput = useRef();

    useEffect(() => {
        search.remove();
        setResults([]);
    }, [insuranceType]);

    useEffect(() => {
        props.setResults && props.setResults(results);
    }, [results]);

    useEffect(() => {
        isOpen && isMobile && !noSearchBar && searchInput.current.focus();
    }, [isOpen]);

    const [ref, inView] = useInView({
        threshold: 0
    });
    const [searchInterval, setSearchInterval] = useState(null);

    useEffect(() => {
        if (inView) setPage(prevState => prevState + 10);
    }, [inView]);

    useEffect(async () => {
        if (search.isSuccess) {
            await setIsLoading(false);
            await search.remove();
            return setResults(prevState => prevState.concat(search.data.result.serviceList));
        }
        if (search.isError) {
            console.clear();
            return setIsLoading(false);
        }
    }, [search.status]);

    useEffect(() => {
        if (page > 0) search.refetch();
    }, [page]);

    useEffect(() => {
        if (searchValue) {
            setIsLoading(true);
            setPage(0);
            setResults([]);
            if (searchInterval == null) {
                setSearchInterval(
                    setTimeout(
                        () => {
                            search.refetch();
                        },
                        insuranceType === 'salamat' ? 1000 : 300
                    )
                );
            } else {
                clearTimeout(searchInterval);
                setSearchInterval(
                    setTimeout(
                        () => {
                            search.refetch();
                        },
                        insuranceType === 'salamat' ? 1000 : 300
                    )
                );
            }
        }
    }, [searchValue, isIrc]);

    return (
        <CSSTransition
            in={isOpen}
            timeout={100}
            classNames={{
                enterDone: styles['show']
            }}
            unmountOnExit
        >
            <div
                className={classNames({
                    [styles['wrap-float']]: true
                })}
            >
                {isMobile && !noSearchBar && (
                    <div className={styles.searchBar}>
                        <div
                            className={styles.searchIcon}
                            onClick={() => onClose && onClose(false)}
                            aria-hidden
                        >
                            <ChevronIcon dir="right" />
                        </div>
                        <input
                            ref={searchInput}
                            placeholder={label}
                            type="text"
                            className={styles.searchInput}
                            onChange={e => setSearchValue(e.target.value)}
                            value={searchValue}
                        />
                    </div>
                )}
                {search.isLoading && (
                    <div className={styles.loading}>
                        <LoadingIcon color="#3f3f79" width={30} height={30} />
                    </div>
                )}
                {!searchValue && (
                    <Frequent
                        type={type}
                        typeId={typeId}
                        onClose={onClose}
                        setSelectItem={setSelectItem}
                        insuranceType={insuranceType}
                        selectHover={isOpen && selectHover}
                        setResults={props.setResults}
                    />
                )}
                {results.length > 0 && searchValue && (
                    <>
                        <div className={styles['searchItems']}>
                            {insuranceType === 'tamin'
                                ? results.map((result, i) => (
                                      <SearchItem
                                          key={result.id}
                                          id={result.id}
                                          title={result.srvName}
                                          onClose={onClose}
                                          setSelectItem={setSelectItem}
                                          count={result.default_count ?? null}
                                          use_time={result.default_use_time ?? null}
                                          brands={result.brands ?? []}
                                          default={result.default ?? []}
                                          selectHoverId={i}
                                          selectHover={isOpen && selectHover}
                                          serviceCode={result.wsSrvCode}
                                          serviceType={result.serviceType}
                                      />
                                  ))
                                : results.map((result, i) => (
                                      <SearchItem
                                          key={result.id}
                                          id={result.id}
                                          title={result.fullName}
                                          onClose={onClose}
                                          setSelectItem={setSelectItem}
                                          shape={result?.shape ?? null}
                                          selectHoverId={i}
                                          selectHover={isOpen && selectHover}
                                          serviceCode={result.nationalNumber}
                                          serviceType={result.serviceType}
                                      />
                                  ))}
                        </div>

                        {results.length > 8 && search.error?.response.status !== 404 && (
                            <div ref={ref} className={styles.loading}>
                                <LoadingIcon color="#3f3f79" width={30} height={30} />
                            </div>
                        )}
                    </>
                )}
                {search.isError && search.error?.response.data.statusCode === 404 && (
                    <div className={styles.loading}>{search.error?.response.data.message}</div>
                )}
                {search.isError && search.error?.response.data.statusCode === 409 && (
                    <div className={styles.loading}>{search.error?.response.data.message}</div>
                )}
            </div>
        </CSSTransition>
    );
};

export const SearchFullPage = ({
    isOpen,
    onClose,
    setSelectItem,
    type,
    searchValue,
    setSearchValue,
    label,
    selectHover,
    typeId,
    noSearchBar,
    insuranceType,
    setIsIrc,
    isIrc,
    ...props
}) => {
    const [results, setResults] = useState([]);
    const [prescriptionInfo] = useSelectPrescription();
    // const [searchValue, setSearchValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);

    const search = useSearch(`${prescriptionInfo?.id ?? prescriptionInfo?.id}`, {
        _q: insuranceType === 'salamat' && !searchValue ? 'a' : searchValue,
        _start: page,
        _limit: 10,
        ...(type === 'drugs' && { type: serviceTypeList[type][insuranceType] }),
        ...(type === 'lab' && { type: serviceTypeList[type][insuranceType] }),
        ...(type === 'imaging' && {
            type: insuranceType === 'tamin' ? typeId : 3
        }),
        ...(type === 'others' && {
            type_nin: insuranceType === 'tamin' ? [79, 80, 81, 83, 84, 85] : [1, 2, 3]
        }),
        ...(isIrc && { isIrc: true }),
        provider: insuranceType
    });
    const searchInput = useRef();

    useEffect(() => {
        search.remove();
        setResults([]);
    }, [insuranceType]);

    useEffect(() => {
        props.setResults && props.setResults(results);
    }, [results]);

    useEffect(() => {
        isOpen && isMobile && !noSearchBar && searchInput.current.focus();
    }, [isOpen]);

    const [ref, inView] = useInView({
        threshold: 0
    });
    const [searchInterval, setSearchInterval] = useState(null);

    useEffect(() => {
        if (inView) setPage(prevState => prevState + 10);
    }, [inView]);

    useEffect(async () => {
        if (search.isSuccess) {
            await setIsLoading(false);
            await search.remove();
            return setResults(prevState => prevState.concat(search.data.result.serviceList));
        }
        if (search.isError) {
            console.clear();
            return setIsLoading(false);
        }
    }, [search.status]);

    useEffect(() => {
        if (page > 0) search.refetch();
    }, [page]);

    useEffect(() => {
        if (searchValue) {
            setIsLoading(true);
            setPage(0);
            setResults([]);
            if (searchInterval == null) {
                setSearchInterval(
                    setTimeout(
                        () => {
                            search.refetch();
                        },
                        insuranceType === 'salamat' ? 1000 : 300
                    )
                );
            } else {
                clearTimeout(searchInterval);
                setSearchInterval(
                    setTimeout(
                        () => {
                            search.refetch();
                        },
                        insuranceType === 'salamat' ? 1000 : 300
                    )
                );
            }
        }
    }, [searchValue, isIrc]);

    const shouldShowIrcToggleButton = insuranceType === 'salamat' && type === 'drugs';

    return createPortal(
        <CSSTransition
            in={isOpen}
            timeout={100}
            classNames={{
                enterDone: styles['show']
            }}
            unmountOnExit
        >
            <div
                className={classNames({
                    [styles['wrap-float']]: true
                })}
            >
                {isMobile && !noSearchBar && (
                    <div className={styles.searchBar}>
                        <div
                            className={styles.searchIcon}
                            onClick={() => onClose && onClose(false)}
                            aria-hidden
                        >
                            <ChevronIcon dir="right" />
                        </div>
                        <input
                            ref={searchInput}
                            placeholder={label}
                            type="text"
                            className={styles.searchInput}
                            onChange={e => setSearchValue(e.target.value)}
                            value={searchValue}
                        />
                        {shouldShowIrcToggleButton && (
                            <SquareToggle label="IRC" onChange={setIsIrc} value={isIrc} />
                        )}
                    </div>
                )}
                {search.isLoading && (
                    <div className={styles.loading}>
                        <LoadingIcon color="#3f3f79" width={30} height={30} />
                    </div>
                )}
                {!searchValue && (
                    <Frequent
                        type={type}
                        typeId={typeId}
                        onClose={onClose}
                        setSelectItem={setSelectItem}
                        insuranceType={insuranceType}
                    />
                )}
                {results.length > 0 && searchValue && (
                    <>
                        <div className={styles['searchItems']}>
                            {insuranceType === 'tamin'
                                ? results.map((result, i) => (
                                      <SearchItem
                                          key={result.id}
                                          id={result.id}
                                          title={result.srvName}
                                          onClose={onClose}
                                          setSelectItem={setSelectItem}
                                          count={result.default_count ?? null}
                                          use_time={result.default_use_time ?? null}
                                          brands={result.brands ?? []}
                                          default={result.default ?? []}
                                          selectHoverId={i}
                                          selectHover={isOpen && selectHover}
                                          serviceCode={result.wsSrvCode}
                                          serviceType={result.serviceType}
                                      />
                                  ))
                                : results.map((result, i) => (
                                      <SearchItem
                                          key={result.id}
                                          id={result.id}
                                          title={result.fullName}
                                          onClose={onClose}
                                          setSelectItem={setSelectItem}
                                          shape={result?.shape ?? null}
                                          selectHoverId={i}
                                          selectHover={isOpen && selectHover}
                                          serviceCode={result.nationalNumber}
                                          serviceType={result.serviceType}
                                      />
                                  ))}
                        </div>

                        {results.length > 8 && search.error?.response.status !== 404 && (
                            <div ref={ref} className={styles.loading}>
                                <LoadingIcon color="#3f3f79" width={30} height={30} />
                            </div>
                        )}
                    </>
                )}
                {search.isError && search.error?.response.data.statusCode === 404 && (
                    <div className={styles.loading}>{search.error?.response.data.message}</div>
                )}
                {search.isError && search.error?.response.data.statusCode === 409 && (
                    <div className={styles.loading}>{search.error?.response.data.message}</div>
                )}
            </div>
        </CSSTransition>,
        document.getElementById('root')
    );
};
