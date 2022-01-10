import styles from './header.module.scss';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { Goftino } from '../../doctorApp/goftino';
import { useHistory, useLocation } from 'react-router-dom';
import { ChevronIcon, ExitIcon, HelpIcon, HouseIcon, UserIcon } from '../../icons';
import { useMenu } from '@paziresh24/context/core/menu';
import classNames from 'classnames';
import { sendEvent } from '@paziresh24/utils';
import { useDrApp } from '@paziresh24/context/drapp';
import { useSupport } from '@paziresh24/context/core/supportChat';
import { openGoftino } from '@paziresh24/utils/services/goftino';
import ReactTooltip from 'react-tooltip';
import { usePage } from '@paziresh24/context/core/page';
import { Default, Mobile } from '@paziresh24/hooks/core/device';
import { useTour } from '@reactour/tour';
import Modal from '../../core/modal';
import Button from '../../core/button';
import { useCreateCenter } from '@paziresh24/hooks/drapp/auth';
import { toast } from 'react-toastify';
import isEmpty from 'lodash/isEmpty';
import { baseURL } from '@paziresh24/utils/baseUrl';
import NoImage from '@paziresh24/assets/images/drapp/noimage.png';
import { CSSTransition } from 'react-transition-group';

const Header = () => {
    const history = useHistory();
    const [page] = usePage();
    const [isOpen, setIsOpen] = useMenu();
    const [info, setInfo] = useDrApp();
    const [, setOpenState] = useSupport(false);
    const { setCurrentStep: setSteps } = useTour();
    const [isCenterSelectOpen, setIsCenterSelectOpen] = useState(false);
    const [centerActiveModal, setCenterActiveModal] = useState(false);
    const createCenter = useCreateCenter();
    const [supportModal, setSupportModal] = useState();
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);

    const location = useLocation();
    const [hideToolTip, setHideToolTip] = useState(
        location.state?.afterLogin === true ? false : true
    );
    const [unread, setUnread] = useState(0);

    useEffect(() => !hideToolTip && setTimeout(() => setHideToolTip(true), 5000), []);

    const openGoftinoAction = () => {
        sendEvent('click', 'home', 'clicksupportbutton');
        // isMobile ? openGoftino() : setOpenState(true);
        setSupportModal(true);
    };

    const createCenterAction = () => {
        createCenter.mutate(
            {
                ignore_shahkar: true,
                mobile: info.doctor.cell,
                nationalCode: info.doctor.national_code,
                medical_code: info.doctor.medical_code
            },
            {
                onSuccess: () => {
                    window.location.reload();
                },
                onError: err => {
                    toast.error(err.response.data.message);
                }
            }
        );
    };

    document.querySelector('body').addEventListener('click', e => {
        if (isCenterSelectOpen === true) {
            e.stopPropagation();
            setIsCenterSelectOpen(false);
        }
    });

    return (
        <>
            <header className={styles['header']}>
                <div className={styles.right}>
                    {/* <Default>
                        <div
                            className={styles['toggle-menu-button']}
                            onClick={() => {
                                setSteps(1);
                                setIsOpen(prevVal => !prevVal);
                            }}
                            aria-hidden
                        >
                            <div id="step2">
                                <svg
                                    width="22"
                                    height="13"
                                    viewBox="0 0 22 13"
                                    fill="#3f4079"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={styles['icn']}
                                >
                                    <rect y="10.4849" width="22" height="2" />
                                    <rect y="0.484863" width="22" height="2" />
                                    <rect y="5.48486" width="22" height="2" />
                                </svg>
                            </div>
                        </div>
                    </Default> */}

                    <Mobile>
                        <span className={styles.pageTitle}>{page.title}</span>
                    </Mobile>

                    <div
                        className={styles.selectCenter}
                        onMouseOut={() => setIsCenterSelectOpen(false)}
                    >
                        <div
                            className={styles.centerSelectInput}
                            onMouseOver={() => setIsCenterSelectOpen(true)}
                            aria-hidden
                        >
                            <span>
                                {info.centers.find(
                                    item => item.id == localStorage.getItem('center_id')
                                )
                                    ? info.centers.find(
                                          item => item.id == localStorage.getItem('center_id')
                                      ).name
                                    : info.center.name}
                            </span>
                            <ChevronIcon
                                className={styles.chevron_dropdown}
                                color="#758599"
                                dir={isCenterSelectOpen ? 'top' : 'bottom'}
                            />
                        </div>
                        <HelpIcon color="#3f4079" data-tip data-for="centerSelect" />
                        <ReactTooltip id="centerSelect" place="top" type="dark" effect="solid">
                            از این قسمت، مرکزی که در آن مشغول تجویز و طبابت هستید را انتخاب کنید
                        </ReactTooltip>
                        <CSSTransition
                            in={isCenterSelectOpen}
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
                                className={styles.selectWrapper}
                                aria-hidden
                                onMouseOver={() => setIsCenterSelectOpen(true)}
                            >
                                {info.centers.map(center => (
                                    <div
                                        key={center.id}
                                        className={classNames({
                                            [styles.centerItem]: true,
                                            [styles.select]:
                                                info.centers.length > 1
                                                    ? info.centers.find(
                                                          item =>
                                                              item.id ==
                                                              localStorage.getItem('center_id')
                                                      )
                                                        ? localStorage.getItem('center_id') ===
                                                          center.id
                                                        : info.center.id === center.id
                                                    : false
                                        })}
                                        onClick={e => {
                                            e.stopPropagation();
                                            setIsCenterSelectOpen(false);
                                            localStorage.setItem(
                                                'center_id',
                                                center.id ? center.id : info.center.id
                                            );
                                            setInfo(prev => ({
                                                ...prev,
                                                center: center.name
                                                    ? prev.centers.find(
                                                          center2 => center2.id === center.id
                                                      )
                                                    : prev.center
                                            }));
                                        }}
                                        aria-hidden
                                    >
                                        <div className={styles.row}>
                                            {center.type_id !== 1 && center.id !== '5532' && (
                                                <svg
                                                    width="27"
                                                    height="28"
                                                    viewBox="0 0 27 28"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M24.5103 24.4907H2.22825C1.77147 24.4907 1.39267 24.8695 1.39267 25.3263C1.39267 25.7831 1.77147 26.1619 2.22825 26.1619H24.5103C24.9671 26.1619 25.3459 25.7831 25.3459 25.3263C25.3459 24.8695 24.9671 24.4907 24.5103 24.4907Z"
                                                        fill="#3F3F79"
                                                    />
                                                    <path
                                                        d="M18.9398 3.04419H7.79876C4.45645 3.04419 3.34235 5.03844 3.34235 7.50061V25.3263H10.027V18.5748C10.027 17.9955 10.4949 17.5275 11.0742 17.5275H15.6755C16.2437 17.5275 16.7227 17.9955 16.7227 18.5748V25.3263H23.4074V7.50061C23.3962 5.03844 22.2821 3.04419 18.9398 3.04419ZM16.1545 11.1214H14.2049V13.0711C14.2049 13.5279 13.8261 13.9067 13.3693 13.9067C12.9125 13.9067 12.5337 13.5279 12.5337 13.0711V11.1214H10.584C10.1272 11.1214 9.74845 10.7426 9.74845 10.2859C9.74845 9.82908 10.1272 9.45029 10.584 9.45029H12.5337V7.50061C12.5337 7.04382 12.9125 6.66503 13.3693 6.66503C13.8261 6.66503 14.2049 7.04382 14.2049 7.50061V9.45029H16.1545C16.6113 9.45029 16.9901 9.82908 16.9901 10.2859C16.9901 10.7426 16.6113 11.1214 16.1545 11.1214Z"
                                                        fill="#3F3F79"
                                                    />
                                                </svg>
                                            )}
                                            {center.type_id === 1 && (
                                                <svg
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M20.83 8.01002L14.28 2.77002C13 1.75002 11 1.74002 9.73002 2.76002L3.18002 8.01002C2.24002 8.76002 1.67002 10.26 1.87002 11.44L3.13002 18.98C3.42002 20.67 4.99002 22 6.70002 22H17.3C18.99 22 20.59 20.64 20.88 18.97L22.14 11.43C22.32 10.26 21.75 8.76002 20.83 8.01002ZM12.75 18C12.75 18.41 12.41 18.75 12 18.75C11.59 18.75 11.25 18.41 11.25 18V15C11.25 14.59 11.59 14.25 12 14.25C12.41 14.25 12.75 14.59 12.75 15V18Z"
                                                        fill="#3F3F79"
                                                    />
                                                </svg>
                                            )}

                                            {center.id === '5532' && (
                                                <svg
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M17.62 10.7501C17.19 10.7501 16.85 10.4001 16.85 9.9801C16.85 9.6101 16.48 8.8401 15.86 8.1701C15.25 7.5201 14.58 7.1401 14.02 7.1401C13.59 7.1401 13.25 6.7901 13.25 6.3701C13.25 5.9501 13.6 5.6001 14.02 5.6001C15.02 5.6001 16.07 6.1401 16.99 7.1101C17.85 8.0201 18.4 9.1501 18.4 9.9701C18.4 10.4001 18.05 10.7501 17.62 10.7501Z"
                                                        fill="#3F3F79"
                                                    />
                                                    <path
                                                        d="M21.23 10.75C20.8 10.75 20.46 10.4 20.46 9.98C20.46 6.43 17.57 3.55 14.03 3.55C13.6 3.55 13.26 3.2 13.26 2.78C13.26 2.36 13.6 2 14.02 2C18.42 2 22 5.58 22 9.98C22 10.4 21.65 10.75 21.23 10.75Z"
                                                        fill="#3F3F79"
                                                    />
                                                    <path
                                                        d="M11.05 14.95L9.2 16.8C8.81 17.19 8.19 17.19 7.79 16.81C7.68 16.7 7.57 16.6 7.46 16.49C6.43 15.45 5.5 14.36 4.67 13.22C3.85 12.08 3.19 10.94 2.71 9.81C2.24 8.67 2 7.58 2 6.54C2 5.86 2.12 5.21 2.36 4.61C2.6 4 2.98 3.44 3.51 2.94C4.15 2.31 4.85 2 5.59 2C5.87 2 6.15 2.06 6.4 2.18C6.66 2.3 6.89 2.48 7.07 2.74L9.39 6.01C9.57 6.26 9.7 6.49 9.79 6.71C9.88 6.92 9.93 7.13 9.93 7.32C9.93 7.56 9.86 7.8 9.72 8.03C9.59 8.26 9.4 8.5 9.16 8.74L8.4 9.53C8.29 9.64 8.24 9.77 8.24 9.93C8.24 10.01 8.25 10.08 8.27 10.16C8.3 10.24 8.33 10.3 8.35 10.36C8.53 10.69 8.84 11.12 9.28 11.64C9.73 12.16 10.21 12.69 10.73 13.22C10.83 13.32 10.94 13.42 11.04 13.52C11.44 13.91 11.45 14.55 11.05 14.95Z"
                                                        fill="#3F3F79"
                                                    />
                                                    <path
                                                        d="M21.97 18.33C21.97 18.61 21.92 18.9 21.82 19.18C21.79 19.26 21.76 19.34 21.72 19.42C21.55 19.78 21.33 20.12 21.04 20.44C20.55 20.98 20.01 21.37 19.4 21.62C19.39 21.62 19.38 21.63 19.37 21.63C18.78 21.87 18.14 22 17.45 22C16.43 22 15.34 21.76 14.19 21.27C13.04 20.78 11.89 20.12 10.75 19.29C7.4811 16.91 6.87003 15.81 6.50003 15.5L11 13.5C11.28 13.71 13.4 15.5 13.61 15.61C13.66 15.63 13.72 15.66 13.79 15.69C13.87 15.72 13.95 15.73 14.04 15.73C14.21 15.73 14.34 15.67 14.45 15.56L15.21 14.81C15.46 14.56 15.7 14.37 15.93 14.25C16.16 14.11 16.39 14.04 16.64 14.04C16.83 14.04 17.03 14.08 17.25 14.17C17.47 14.26 17.7 14.39 17.95 14.56L21.26 16.91C21.52 17.09 21.7 17.3 21.81 17.55C21.91 17.8 21.97 18.05 21.97 18.33Z"
                                                        fill="#3F3F79"
                                                    />
                                                </svg>
                                            )}

                                            <div className={styles.centerDetails}>
                                                <span className={styles.centerName}>
                                                    {center.name}
                                                </span>
                                                <span className={styles.centerAddress}>
                                                    {center.address}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {isEmpty(info.centers.find(center => center.type_id === 1)) && (
                                    <div
                                        className={classNames({
                                            [styles.centerItem]: true
                                        })}
                                        aria-hidden
                                    >
                                        <div className={styles.row}>
                                            <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M20.83 8.01002L14.28 2.77002C13 1.75002 11 1.74002 9.73002 2.76002L3.18002 8.01002C2.24002 8.76002 1.67002 10.26 1.87002 11.44L3.13002 18.98C3.42002 20.67 4.99002 22 6.70002 22H17.3C18.99 22 20.59 20.64 20.88 18.97L22.14 11.43C22.32 10.26 21.75 8.76002 20.83 8.01002ZM12.75 18C12.75 18.41 12.41 18.75 12 18.75C11.59 18.75 11.25 18.41 11.25 18V15C11.25 14.59 11.59 14.25 12 14.25C12.41 14.25 12.75 14.59 12.75 15V18Z"
                                                    fill="#3F3F79"
                                                />
                                            </svg>

                                            <div className={styles.centerDetails}>
                                                <span className={styles.centerName}>مطب</span>
                                                <span className={styles.centerAddress}>
                                                    شما در پذیرش24 مطب ندارید
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            className={styles.activeOfficeType}
                                            onClick={e => {
                                                e.stopPropagation();

                                                setIsCenterSelectOpen(false);
                                                setCenterActiveModal(true);
                                            }}
                                        >
                                            فعال سازی
                                        </button>
                                    </div>
                                )}
                            </div>
                        </CSSTransition>

                        <Modal
                            isOpen={centerActiveModal}
                            onClose={setCenterActiveModal}
                            title="فعالسازی مطب"
                        >
                            <span style={{ fontWeight: '500' }}>
                                آیا از ساخت مطب در پذیرش24 مطمئن هستید؟
                            </span>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <Button
                                    block
                                    onClick={createCenterAction}
                                    loading={createCenter.isLoading}
                                >
                                    ساخت مطب
                                </Button>
                                <Button
                                    block
                                    variant="secondary"
                                    onClick={() => setCenterActiveModal(false)}
                                >
                                    انصراف
                                </Button>
                            </div>
                        </Modal>
                    </div>
                </div>

                {/* <img src={Logo} alt="logo" /> */}

                <div className={styles['actions']}>
                    <div className={styles.action} onClick={openGoftinoAction} aria-hidden>
                        <svg viewBox="0 0 29 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M23.2289 11.3342H23.1647V9.81811C23.1647 4.94801 19.0731 1 14.0258 1C8.9784 1 4.8868 4.94801 4.8868 9.81811V11.3342H4.50202C3.09108 11.3342 2.00083 12.5409 2.00083 13.9332V17.8008C1.9653 19.1503 3.07033 20.2721 4.46894 20.3064C4.47999 20.3067 4.49097 20.3069 4.50202 20.307H6.87493C7.21104 20.2918 7.47072 20.0165 7.45489 19.6922C7.45433 19.6805 7.45341 19.6688 7.45213 19.6572V12.0767C7.45213 11.7055 7.22767 11.3341 6.87493 11.3341H6.16946V9.81805C6.16946 5.63149 9.68687 2.23757 14.0258 2.23757C18.3647 2.23757 21.8821 5.63149 21.8821 9.81805V11.3341H21.1766C20.8239 11.3341 20.5994 11.7054 20.5994 12.0767V19.6572C20.5636 19.98 20.8058 20.2698 21.1404 20.3043C21.1524 20.3055 21.1645 20.3064 21.1766 20.3069H21.9141L21.85 20.3997C20.8878 21.6336 19.3779 22.3563 17.7775 22.349C17.4272 20.6914 15.7505 19.6217 14.0326 19.9598C12.5635 20.2488 11.5043 21.4903 11.4925 22.9369C11.51 24.6336 12.9406 26.0001 14.6991 26C15.5696 25.9864 16.3994 25.6417 17.0079 25.0408C17.4185 24.6352 17.6875 24.116 17.7775 23.5557C19.7816 23.563 21.6716 22.6569 22.8761 21.1114L23.4854 20.245C24.8642 20.1522 25.73 19.3168 25.73 18.1101V14.2425C25.7301 12.9122 24.704 11.3342 23.2289 11.3342ZM6.16946 19.0694H4.50202C3.81153 19.0531 3.26539 18.4999 3.28221 17.8337C3.28252 17.8227 3.28295 17.8118 3.2835 17.8008V13.9332C3.2835 13.2216 3.79655 12.5718 4.50202 12.5718H6.16946V19.0694ZM16.078 24.1746C15.7227 24.5464 15.2234 24.7593 14.6992 24.7625C13.6559 24.7465 12.8093 23.9432 12.7752 22.937C12.7748 21.9287 13.6215 21.1111 14.6664 21.1107C15.7112 21.1103 16.5586 21.9273 16.5591 22.9355V22.937C16.5858 23.3963 16.4112 23.8454 16.078 24.1746ZM24.4474 18.1102C24.4474 18.9456 23.6136 19.0694 23.2289 19.0694H21.8821V12.5718H23.2289C23.9343 12.5718 24.4474 13.531 24.4474 14.2426V18.1102Z"
                                strokeWidth="0.4"
                            />
                        </svg>
                    </div>

                    {unread != 0 && (
                        <span
                            onClick={openGoftinoAction}
                            aria-hidden
                            className={styles['unreadCount']}
                        >
                            {unread}
                        </span>
                    )}
                    <div
                        className={classNames({
                            [styles['support-tool-tip']]: true,
                            [styles['hide']]: hideToolTip
                        })}
                    >
                        هر روز از 7 تا 24 پاسخگوی شما هستیم.
                    </div>
                    {!isMobile && (
                        <div
                            className={styles.wrapper_dropdown}
                            onMouseOut={() => setIsDropDownOpen(false)}
                        >
                            <div
                                className={styles.header_dropdown}
                                onMouseOver={() => setIsDropDownOpen(true)}
                            >
                                <div className={styles.name}>
                                    <UserIcon color="#415266" />
                                    <span>{`${info.doctor.name} ${info.doctor.family}`}</span>
                                </div>

                                <ChevronIcon
                                    className={styles.chevron_dropdown}
                                    color="#758599"
                                    dir={isDropDownOpen ? 'top' : 'bottom'}
                                />
                            </div>
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
                                >
                                    <div className={styles.info_dropdown}>
                                        <img
                                            src={
                                                info.doctor.image
                                                    ? baseURL('UPLOADER') + info.doctor.image
                                                    : null ?? NoImage
                                            }
                                            alt="avatar"
                                        />
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span
                                                style={{
                                                    fontSize: '1.6rem',
                                                    fontWeight: 'bold',
                                                    marginBottom: '0.5rem'
                                                }}
                                            >{`${info.doctor.name} ${info.doctor.family}`}</span>
                                            {info.doctor.expertises.length > 0 && (
                                                <span style={{ fontSize: '1.4rem' }}>
                                                    {info.doctor.expertises[0].alias_title
                                                        ? info.doctor.expertises[0].alias_title
                                                        : `${
                                                              info.doctor.expertises[0].degree
                                                                  ?.name ?? ''
                                                          } ${
                                                              info.doctor.expertises[0].expertise
                                                                  ?.name ?? ''
                                                          }`}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <ul>
                                        <li onClick={() => history.push('/profile')}>
                                            <UserIcon color="#758599" />
                                            <span>پروفایل من</span>
                                        </li>

                                        <li onClick={() => history.push('/logout')}>
                                            <ExitIcon color="#758599" />
                                            <span>خروج از حساب کاربری</span>
                                        </li>
                                    </ul>
                                </div>
                            </CSSTransition>
                        </div>
                    )}
                </div>

                {/* <Button
                    // variant="secondary"
                    // size="small"
                    id="add-turn"
                    // onClick={() => {
                    //     props.setOpenNewTurn(true);
                    //     if (urlParams.learn) {
                    //         tourState(true);
                    //         setSteps(4);
                    //     }
                    //     sendEvent('plususer', 'prescription', 'plususer');
                    // }}
                    size="medium"
                >
                    افزودن بیمار
                </Button> */}

                {isOpen && (
                    <div
                        className={styles['overlay']}
                        onClick={() => setIsOpen(prevVal => !prevVal)}
                        aria-hidden
                    />
                )}
            </header>
            {/* <div className={styles.alarm}>
                <div className={styles['ping']} />
                <span>متاسفانه به دلیل قطعی موقت سرویس سلامت امکان ارسال نسخه وجود ندارد.</span>
            </div> */}
            <Goftino />
            <Modal title="پشتیبانی" isOpen={supportModal} onClose={setSupportModal}>
                <span>
                    برای ارتباط با پشتیبانی همه روزه از ساعت 7 الی 24 با شماره 02125015555 تماس
                    بگیرید.
                </span>
                {/* <Button block onClick={() => window.open('tel:02125015555')}>
                    تماس با پشتیبانی
                </Button> */}
            </Modal>
        </>
    );
};

export { Header };
