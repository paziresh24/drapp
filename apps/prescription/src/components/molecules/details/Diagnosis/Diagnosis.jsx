import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './Search.module.scss';
import { LoadingIcon, SearchIcon } from '@paziresh24/shared/icon';
import DiagnosisItem from './item';
import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';
import { useSearch } from '../../../../hooks/prescription';
import providers from '@constants/prescription.json';
import { useInView } from 'react-intersection-observer';
import { useGetDiseases } from '@paziresh24/hooks/prescription/types';
import isEmpty from 'lodash/isEmpty';

const Diagnosis = ({ isOpen, onClose, setSelectItem, searchValue }) => {
    const [results, setResults] = useState([]);
    const [prescriptionInfo] = useSelectPrescription();
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);

    const search = useGetDiseases({
        _q: searchValue
    });

    const [ref, inView] = useInView({
        threshold: 0
    });
    const [searchInterval, setSearchInterval] = useState(null);

    useEffect(() => {
        if (inView) setPage(prevState => prevState + 10);
    }, [inView]);

    // useEffect(async () => {
    //     if (search.isSuccess) {
    //         await setIsLoading(false);
    //         await search.remove();
    //         return setResults(prevState => prevState.concat(search.data));
    //     }
    //     if (search.isError) {
    //         console.clear();
    //         return setIsLoading(false);
    //     }
    // }, [search.status]);

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
                        prescriptionInfo.insuranceType === providers.salamat ? 1000 : 300
                    )
                );
            } else {
                clearTimeout(searchInterval);
                setSearchInterval(
                    setTimeout(
                        () => {
                            search.refetch();
                        },
                        prescriptionInfo.insuranceType === providers.salamat ? 1000 : 300
                    )
                );
            }
        }
    }, [searchValue]);

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
                {search.isLoading && (
                    <div className={styles.loading}>
                        <LoadingIcon color="#3f3f79" width={30} height={30} />
                    </div>
                )}

                {!searchValue && (
                    <div className={styles.loading}>
                        <span>تشخیص خود را بنویسید ...</span>
                    </div>
                )}

                {search.isSuccess && search.data.length > 0 && searchValue && (
                    <div className={styles['searchItems']}>
                        {search.data.map(result => (
                            <div className={styles.category} key={result.stemId}>
                                <span
                                    className={styles['category-title']}
                                    onClick={() => {
                                        setSelectItem({
                                            id: result.stemId,
                                            name: result.title,
                                            category: result.title
                                        });
                                        onClose(false);
                                    }}
                                    aria-hidden
                                >
                                    {result.title}
                                </span>
                                {result.items.map(item => (
                                    <DiagnosisItem
                                        key={result.stemId}
                                        id={result.stemId}
                                        category={result.title}
                                        title={item}
                                        setSelectItem={setSelectItem}
                                        onClose={onClose}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                )}
                {search.isSuccess && isEmpty(search.data) && (
                    <div className={styles.loading}>یافت نشد.</div>
                )}
            </div>
            {/* <div className={styles['root']}>
                <div className={styles['mask']} onClick={() => onClose(false)} aria-hidden />
                <div
                    className={classNames({
                        [styles['wrap']]: true,
                        [styles['fullPage']]: fullPage
                    })}
                >
                    <div className={styles['body']}>
                        <div className={styles.searchBar}>
                            <div className={styles.searchIcon}>
                                <SearchIcon />
                            </div>
                            <input
                                autoFocus
                                type="text"
                                placeholder="جستجوی دارو"
                                onChange={e => setSearchValue(e.target.value)}
                            />
                            <div className={styles.loadingIcon}>
                                {search.isLoading && <LoadingIcon color="#aaa" />}
                            </div>
                        </div>

                        <Frequent type={type} onClose={onClose} setSelectItem={setSelectItem} />

                        {results.length > 0 && searchValue && (
                            <>
                                <div className={styles['searchItems']}>
                                    {prescriptionInfo.insuranceType === providers.tamin
                                        ? results.map(result => (
                                              <SearchItem
                                                  key={result.id}
                                                  id={result.id}
                                                  title={result.srvName}
                                                  onClose={onClose}
                                                  setSelectItem={setSelectItem}
                                              />
                                          ))
                                        : results.map(result => (
                                              <SearchItem
                                                  key={result.id}
                                                  id={result.id}
                                                  title={result.fullName}
                                                  onClose={onClose}
                                                  setSelectItem={setSelectItem}
                                              />
                                          ))}
                                </div>
                                {results.length > 8 && search.error?.response.status !== 404 && (
                                    <div ref={ref}>
                                        <LoadingIcon color="#3f3f79" width={30} height={30} />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div> */}
        </CSSTransition>
    );
};

export default Diagnosis;
