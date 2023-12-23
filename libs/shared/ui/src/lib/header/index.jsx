import styles from './header.module.scss';
import { memo, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { ChevronIcon, HelpIcon } from '@paziresh24/shared/icon';
import { useMenu } from '@paziresh24/context/core/menu';
import classNames from 'classnames';
import { useDrApp } from '@paziresh24/context/drapp';
import ReactTooltip from 'react-tooltip';
import { usePage } from '@paziresh24/context/core/page';
import Modal from '@paziresh24/shared/ui/modal';
import Button from '@mui/lab/LoadingButton';
import { useCreateCenter } from '@paziresh24/hooks/drapp/auth';
import { toast } from 'react-toastify';
import isEmpty from 'lodash/isEmpty';
import { CSSTransition } from 'react-transition-group';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import { useMediaQuery } from 'react-responsive';
import useShouldShowActionBars from '@hooks/useShouldShowActionBars';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { isEmbed } from '@paziresh24/shared/utils';

const Header = memo(() => {
    const history = useHistory();
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const [page] = usePage();
    const [, setIsOpen] = useMenu();
    const [info, setInfo] = useDrApp();
    const [isCenterSelectOpen, setIsCenterSelectOpen] = useState(false);
    const [centerActiveModal, setCenterActiveModal] = useState(false);
    const createCenter = useCreateCenter();
    const shouldShowActionBars = useShouldShowActionBars();
    const location = useLocation();
    const [hideToolTip, setHideToolTip] = useState(
        location.state?.afterLogin === true ? false : true
    );

    useEffect(() => {
        !hideToolTip && setTimeout(() => setHideToolTip(true), 5000);
    }, []);

    const createCenterAction = () => {
        createCenter.mutate(
            {
                ignore_shahkar: true,
                mobile: (+info.doctor.cell).toString(),
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
        <header
            className={classNames(
                'flex justify-between items-center h-14 min-h-[3.5rem] bg-white px-3 pl-2 border-b border-solid border-[#e5e9f0] z-[8]',
                {
                    '!p-1 !px-2 z-10 !w-full pr-5 flex justify-between items-center border-b border-solid border-slate-200/50  shadow-sm':
                        isEmbed(),
                    '!hidden': !page?.showCenterListForMobile && isEmbed()
                }
            )}
        >
            {(isEmbed() ? !isMobile : true) && (
                <div>
                    {!isMobile && !isEmbed() && shouldShowActionBars && (
                        <IconButton onClick={() => setIsOpen(prev => !prev)}>
                            <MenuIcon sx={{ fontSize: '20px', color: '#000' }}></MenuIcon>
                        </IconButton>
                    )}
                    {!isEmbed() && <span className="font-bold md:pr-3">{page.title}</span>}
                </div>
            )}
            <div className={classNames('flex items-center', { 'w-full md:w-auto': isEmbed() })}>
                <div
                    className={classNames(
                        `items-center space-s-3 ${
                            page?.showCenterListForMobile ? 'flex ' : 'hidden lg:flex'
                        }`,
                        { 'w-full md:w-auto': isEmbed() }
                    )}
                >
                    {shouldShowActionBars && (
                        <>
                            {!isMobile && (
                                <>
                                    <HelpIcon
                                        className="hidden lg:block"
                                        color="#3f4079"
                                        data-tip
                                        data-for="centerSelect"
                                    />
                                    <ReactTooltip
                                        id="centerSelect"
                                        place="top"
                                        type="dark"
                                        effect="solid"
                                    >
                                        از این قسمت، مرکزی که در آن مشغول تجویز و طبابت هستید را
                                        انتخاب کنید
                                    </ReactTooltip>
                                </>
                            )}
                            <div
                                className={classNames(styles.centerSelectInput, {
                                    '!bg-white !border !border-solid !border-slate-100  !m-0 md:!mr-2 !w-full !min-w-full md:!w-[20rem] md:!min-w-[20rem]':
                                        isEmbed()
                                })}
                                onClick={e => {
                                    e.stopPropagation();
                                    setIsCenterSelectOpen(prevValue => !prevValue);
                                }}
                                aria-hidden
                            >
                                <div>
                                    <span className="flex pl-2">
                                        {info.centers.find(
                                            item => item.id == localStorage.getItem('center_id')
                                        )
                                            ? info.centers.find(
                                                  item =>
                                                      item.id == localStorage.getItem('center_id')
                                              ).name
                                            : info.center.name}
                                    </span>
                                    {info.center.type_id === 1 &&
                                        !info.center?.is_active_booking && (
                                            <span
                                                className={`text-xs !text-[#27bda0] ${styles.flicker}`}
                                            >
                                                فعالسازی نوبت دهی
                                            </span>
                                        )}
                                </div>
                                <ChevronIcon
                                    className={styles.chevron_dropdown}
                                    color="#758599"
                                    dir={isCenterSelectOpen ? 'top' : 'bottom'}
                                />
                            </div>
                        </>
                    )}

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
                        <div className={styles.selectWrapper} aria-hidden>
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
                                                : false,
                                        [styles.disabled]:
                                            !window._env_.P24_IS_PROXY_CENTER &&
                                            center?.prescription_local_install !== undefined &&
                                            !center?.prescription_local_install
                                    })}
                                    onClick={e => {
                                        e.stopPropagation();
                                        if (
                                            window._env_.P24_IS_PROXY_CENTER ||
                                            center?.prescription_local_install === undefined ||
                                            center?.prescription_local_install
                                        ) {
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
                                        }
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
                                            <span className={styles.centerName}>{center.name}</span>
                                            <span className={styles.centerAddress}>
                                                {center.address}
                                            </span>
                                        </div>
                                    </div>
                                    {center.type_id === 1 && !center?.is_active_booking && (
                                        <Button
                                            size="small"
                                            variant="contained"
                                            onClick={() => {
                                                history.push('/activation/office/center');
                                            }}
                                        >
                                            فعال سازی
                                        </Button>
                                    )}
                                </div>
                            ))}
                            {isEmpty(info.centerConsult) && (
                                <div
                                    className={classNames({
                                        [styles.centerItem]: true,
                                        [styles.disabled]: true
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
                                        <div className={styles.centerDetails}>
                                            <span className={styles.centerName}>ویزیت آنلاین</span>
                                            <span className={styles.centerAddress}>
                                                ظرفیت پزشکان ویزیت آنلاین تکمیل شده است.
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
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

                                    <Button
                                        size="small"
                                        variant="contained"
                                        onClick={e => {
                                            e.stopPropagation();

                                            window.location.assign('/create-center');
                                        }}
                                    >
                                        فعال سازی
                                    </Button>
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
                                fullWidth
                                variant="contained"
                                onClick={createCenterAction}
                                loading={createCenter.isLoading}
                            >
                                ساخت مطب
                            </Button>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => setCenterActiveModal(false)}
                            >
                                انصراف
                            </Button>
                        </div>
                    </Modal>
                </div>
            </div>
        </header>
    );
});

export { Header };
