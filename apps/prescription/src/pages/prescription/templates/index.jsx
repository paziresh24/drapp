import styles from './templates.module.scss';
import TemplateItem from '../../../components/molecules/templates/templateItem';
import { useGetFavoritePrescriptions } from '@paziresh24/hooks/prescription';
import { useEffect, useState } from 'react';
import Button from '@paziresh24/shared/ui/button';
import { useHistory, Link } from 'react-router-dom';
import TaminImport from '../../../components/molecules/details/ToolBox/Import';
import { isMobile } from 'react-device-detect';
import FixedWrapBottom from '@paziresh24/shared/ui/fixedWrapBottom';
import { CSSTransition } from 'react-transition-group';
import SalamatImport from '../../../components/molecules/details/ToolBox/Import/salamat';

const Template = () => {
    const history = useHistory();
    const getFavoritePrescriptions = useGetFavoritePrescriptions({});
    const [isOpenTaminImportModal, setIsOpenTaminImportModal] = useState(false);
    const [isOpenSalamatImportModal, setIsOpenSalamatImportModal] = useState(false);

    const [isDropDownOpen, setIsDropDownOpen] = useState();

    useEffect(() => {
        getFavoritePrescriptions.refetch();
    }, []);

    return (
        <div className={styles.wrapper}>
            {isMobile && (
                <div className={styles.nagivate}>
                    <Link to="#" className={styles.active}>
                        نسخه پراستفاده
                    </Link>
                    <hr />
                    <Link to="/favorite/service">اقلام پراستفاده</Link>
                </div>
            )}
            <TaminImport
                isOpen={isOpenTaminImportModal}
                onClose={setIsOpenTaminImportModal}
                provider="tamin"
            />
            <SalamatImport
                isOpen={isOpenSalamatImportModal}
                onClose={setIsOpenSalamatImportModal}
                provider="salamat"
            />
            {!isMobile && (
                <div className="flex items-center justify-between w-full mb-4">
                    <div
                        className="flex flex-col space-y-4"
                        style={{ display: 'flex', flexDirection: 'column' }}
                    >
                        <h1
                            style={{
                                color: '#3f3f79',
                                fontSize: '1rem',
                                fontWeight: 'bold'
                            }}
                        >
                            نسخه های پراستفاده من
                        </h1>
                        <span style={{ opacity: '0.9' }}>
                            با نسخه پراستفاده، سرعت نسخه نویسی چند برابر می شود.
                        </span>
                    </div>

                    <div className="flex space-s-2 relative">
                        <Button
                            square
                            onClick={() => setIsDropDownOpen(prev => !prev)}
                            variant="secondary"
                            buttonIcon={
                                <svg
                                    width="27"
                                    height="25"
                                    viewBox="0 0 25 23"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M12.0704 14.3705C11.8963 14.3705 11.7221 14.3063 11.5846 14.1688L9.23795 11.8222C8.97212 11.5563 8.97212 11.1163 9.23795 10.8505C9.50378 10.5847 9.94378 10.5847 10.2096 10.8505L12.0704 12.7113L13.9313 10.8505C14.1971 10.5847 14.6371 10.5847 14.9029 10.8505C15.1688 11.1163 15.1688 11.5563 14.9029 11.8222L12.5563 14.1688C12.4188 14.3063 12.2446 14.3705 12.0704 14.3705Z"
                                        fill="#27bda0"
                                    />
                                    <path
                                        d="M12.0708 14.3064C11.695 14.3064 11.3833 13.9947 11.3833 13.6189V4.29639C11.3833 3.92055 11.695 3.60889 12.0708 3.60889C12.4466 3.60889 12.7583 3.92055 12.7583 4.29639V13.6189C12.7583 13.9947 12.4466 14.3064 12.0708 14.3064Z"
                                        fill="#27bda0"
                                    />
                                    <path
                                        d="M12.1805 19.8155C7.45967 19.8155 4.15967 16.5155 4.15967 11.7947C4.15967 11.4188 4.47133 11.1072 4.84717 11.1072C5.223 11.1072 5.53467 11.4188 5.53467 11.7947C5.53467 15.7088 8.26633 18.4405 12.1805 18.4405C16.0947 18.4405 18.8263 15.7088 18.8263 11.7947C18.8263 11.4188 19.138 11.1072 19.5138 11.1072C19.8897 11.1072 20.2013 11.4188 20.2013 11.7947C20.2013 16.5155 16.9013 19.8155 12.1805 19.8155Z"
                                        fill="#27bda0"
                                    />
                                </svg>
                            }
                        />
                        <CSSTransition
                            in={isDropDownOpen}
                            timeout={300}
                            classNames={{
                                enter: styles.dropdown_enter,
                                enterActive: styles.dropdown_enter_active,
                                enterDone: styles.dropdown_enter_done,
                                exitActive: styles.dropdown_exit_active
                            }}
                            unmountOnExit
                        >
                            <div
                                className={`${styles.items_dropdown} ${
                                    isDropDownOpen === 'open' ? styles.open : ''
                                } ${isDropDownOpen === 'closing' ? styles.closing : ''}`}
                                onMouseOver={() => setIsDropDownOpen(true)}
                                onMouseLeave={() => setIsDropDownOpen(false)}
                            >
                                <div onClick={() => setIsOpenTaminImportModal(true)}>
                                    <span>انتقال از پنل تامین اجتماعی</span>
                                </div>
                                <div onClick={() => setIsOpenSalamatImportModal(true)}>
                                    <span>انتقال از پنل سلامت</span>
                                </div>
                            </div>
                        </CSSTransition>

                        {/* </Button> */}
                        <Button onClick={() => history.push('/favorite/templates/add')}>
                            افزودن نسخه پراستفاده
                        </Button>
                    </div>
                </div>
            )}

            {isMobile && (
                <FixedWrapBottom>
                    <div className="flex space-s-3 w-full relative">
                        <Button
                            square
                            onClick={() => setIsDropDownOpen(prev => !prev)}
                            variant="secondary"
                            buttonIcon={
                                <svg
                                    width="27"
                                    height="25"
                                    viewBox="0 0 25 23"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M12.0704 14.3705C11.8963 14.3705 11.7221 14.3063 11.5846 14.1688L9.23795 11.8222C8.97212 11.5563 8.97212 11.1163 9.23795 10.8505C9.50378 10.5847 9.94378 10.5847 10.2096 10.8505L12.0704 12.7113L13.9313 10.8505C14.1971 10.5847 14.6371 10.5847 14.9029 10.8505C15.1688 11.1163 15.1688 11.5563 14.9029 11.8222L12.5563 14.1688C12.4188 14.3063 12.2446 14.3705 12.0704 14.3705Z"
                                        fill="#27bda0"
                                    />
                                    <path
                                        d="M12.0708 14.3064C11.695 14.3064 11.3833 13.9947 11.3833 13.6189V4.29639C11.3833 3.92055 11.695 3.60889 12.0708 3.60889C12.4466 3.60889 12.7583 3.92055 12.7583 4.29639V13.6189C12.7583 13.9947 12.4466 14.3064 12.0708 14.3064Z"
                                        fill="#27bda0"
                                    />
                                    <path
                                        d="M12.1805 19.8155C7.45967 19.8155 4.15967 16.5155 4.15967 11.7947C4.15967 11.4188 4.47133 11.1072 4.84717 11.1072C5.223 11.1072 5.53467 11.4188 5.53467 11.7947C5.53467 15.7088 8.26633 18.4405 12.1805 18.4405C16.0947 18.4405 18.8263 15.7088 18.8263 11.7947C18.8263 11.4188 19.138 11.1072 19.5138 11.1072C19.8897 11.1072 20.2013 11.4188 20.2013 11.7947C20.2013 16.5155 16.9013 19.8155 12.1805 19.8155Z"
                                        fill="#27bda0"
                                    />
                                </svg>
                            }
                        />

                        <CSSTransition
                            in={isDropDownOpen}
                            timeout={300}
                            classNames={{
                                enter: styles.dropdown_enter,
                                enterActive: styles.dropdown_enter_active,
                                enterDone: styles.dropdown_enter_done,
                                exitActive: styles.dropdown_exit_active
                            }}
                            unmountOnExit
                        >
                            <div
                                className={`${styles.items_dropdown} ${
                                    isMobile ? styles.mobile : ''
                                }`}
                                onMouseOver={() => setIsDropDownOpen(true)}
                                onMouseLeave={() => setIsDropDownOpen(false)}
                            >
                                <div onClick={() => setIsOpenTaminImportModal(true)}>
                                    <span>انتقال از پنل تامین اجتماعی</span>
                                </div>
                                <div onClick={() => setIsOpenSalamatImportModal(true)}>
                                    <span>انتقال از پنل سلامت</span>
                                </div>
                            </div>
                        </CSSTransition>

                        <Button block onClick={() => history.push('/favorite/templates/add')}>
                            افزودن نسخه پراستفاده
                        </Button>
                    </div>
                </FixedWrapBottom>
            )}

            {getFavoritePrescriptions.isLoading && (
                <div className="skeleton-wrapper">
                    <div className="skeleton-row">
                        <div
                            className="skeleton"
                            style={{ height: '30rem', borderRadius: '0.3rem' }}
                        />
                    </div>
                </div>
            )}

            {getFavoritePrescriptions.isSuccess && (
                <div className={styles.templatesWrapper}>
                    {getFavoritePrescriptions.data.map(item => (
                        <TemplateItem
                            key={item.id}
                            name={item.name}
                            id={item.id}
                            salamatItems={item.salamatItems ?? []}
                            taminItems={item.taminItems ?? []}
                            refetch={getFavoritePrescriptions.refetch}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Template;
