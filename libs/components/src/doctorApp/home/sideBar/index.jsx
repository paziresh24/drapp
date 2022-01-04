/* eslint-disable jsx-a11y/media-has-caption */
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styles from './sideBar.module.scss';
import { SideBarMenu } from '../../../doctorApp/home/sideBarMenu';
import { useDrApp } from '@paziresh24/context/drapp';
import { useSubMenu } from '@paziresh24/context/core/subMenu.js';
import NoImage from '@paziresh24/assets/images/drapp/noimage.png';
import Modal from '../../../core/modal';
import Button from '../../../core/button';

import {
    PenIcon,
    CardIcon,
    PrescriptionIcon,
    TurningIcon,
    InfoIcon,
    ExitIcon,
    LearnIcon,
    ChatIcon,
    MessageIcon,
    ComplaintsIcon,
    PrescriptionMenuIcon,
    HouseIcon
} from '../../../icons';
import { isMobile } from 'react-device-detect';
import { useMenu } from '@paziresh24/context/core/menu';
import { useGoogleSheet, useSendMessageTelegram } from '@paziresh24/hooks/core';
import { toast } from 'react-toastify';
import Select from '../../Select';
import { useGetFeedbacks, useComplaintsSummary } from '@paziresh24/hooks/drapp/profile';
import { baseURL } from '@paziresh24/utils/baseUrl';
import ReactTooltip from 'react-tooltip';
import classNames from 'classnames';
import centersConfig from '@paziresh24/configs/drapp/centers.config.json';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

const SideBar = () => {
    const [open, setOpen] = useMenu();
    // const doctorInfo = useGetDoctorInfo();
    const googleSheet = useGoogleSheet();
    const history = useHistory();
    const [info, setInfo] = useDrApp();
    const [openSubMenu, setOpenSubMenu] = useSubMenu(false);
    const [promoteConsult, setPromoteConsult] = useState(false);
    const [learnModal, setLearnModal] = useState(false);

    const getFeedbacks = useGetFeedbacks({ center_id: info.center.id });
    const complaintsSummary = useComplaintsSummary();

    // useEffect(() => {
    //     if (_.isEmpty(info)) {
    //         doctorInfo.refetch();
    //     }
    // }, []);

    useEffect(() => {
        if (open && isMobile) return document.body.classList.add(styles['sidebar-open']);
        document.body.classList.remove(styles['sidebar-open']);
    }, [open]);

    // useEffect(() => {
    //     if (doctorInfo.isSuccess) {
    //         setInfo(prev => ({
    //             ...prev,
    //             doctor: doctorInfo.data.data ?? {}
    //         }));
    //     }
    // }, [doctorInfo.status]);

    useEffect(() => {
        if (info) {
            if (!info.doctor?.image) {
                setUserCompleteProfile(70);
            } else {
                setUserCompleteProfile(100);
            }
        }
    }, [info]);

    const [userCompleteProfile, setUserCompleteProfile] = useState(0);

    const [menuItems, setMenuItems] = useState([]);

    const [appMenu] = useState([
        // {
        //     id: 7,
        //     name: 'پرسش و پاسخ',
        //     icon: <QaIcon color="#fff" />,
        //     link: '/qa'
        // }
    ]);

    const [otherMenu] = useState([
        // {
        //     id: 1,
        //     name: 'راهنمای اپلیکیشن',
        //     icon: <InfoIcon />,
        //     link: 'https://www.paziresh24.com//home/faq/',
        //     external: true
        // },
        // { id: 8, name: 'خروج', icon: <ExitIcon />, link: '/logout' }
    ]);

    useEffect(() => {
        setMenuItems([
            // { id: 1, name: 'خانه', icon: <HomeIcon />, link: '/' },
            // { id: 2, name: 'پروفایل کاربری', icon: <UserIcon />, link: '/drapp/profile' },
            // {
            //     id: 2,
            //     name: 'صدور نسخه',
            //     icon: <PrescriptionIcon color="#fff" />,
            //     link: '/drapp/prescription',
            //     subMenu: [
            //         { name: 'لیست نسخه ها', link: '/drapp/prescription' },
            //         { name: 'بیمه های من', link: '/drapp/prescription/providers' }
            //     ]
            // },
            {
                id: 'turnning-list-step',
                name: 'لیست بیماران',
                icon: <HouseIcon color="#fff" />,
                link: '/turning',
                tourStep: {
                    key: 2,
                    value: '?learn=true'
                }
            },
            {
                id: 10,
                name: 'نسخه های ثبت شده',
                icon: <PrescriptionMenuIcon color="#fff" />,
                link: '/prescription'
            },
            info.center.id === '5532' && {
                id: 4,
                name: 'چت',
                icon: <ChatIcon color="#fff" />,
                link: '/consult'
            },
            {
                id: 'provider-step',
                name: 'بیمه های من',
                icon: <PrescriptionIcon color="#fff" />,
                link: `/prescription/providers`,
                tourStep: {
                    key: 1,
                    value: '?learn=true'
                }
            },
            {
                id: 11,
                name: 'نظرات بیماران',
                icon: <MessageIcon color="#fff" />,
                link: '/feedbacks',
                badge: true
            },
            (info.center.id === '5532' || info.center.type_id === 1) && {
                id: 13,
                name: 'شکایات بیماران',
                icon: <ComplaintsIcon color="#fff" />,
                link: '/complaints'
            },
            (info.center.id === '5532' || info.center.type_id === 1) && {
                id: 6,
                name: 'تسویه حساب',
                icon: <CardIcon />,
                link: '/financial'
            },
            info.center.id === '5532' && {
                id: 7,
                name: 'قوانین مشاوره',
                icon: <InfoIcon />,
                link: '/consult-term'
            },
            {
                id: 8,
                name: 'آموزش سامانه',
                icon: <LearnIcon color="#fff" />,
                link: '/learn'
            },

            // {
            //     id: 3,
            //     name: 'نوبت دهی مطب',
            //     icon: <TurningIcon color="#fff" />,
            //     link: '/drapp/turning',
            //     subMenu: [
            //         ({ name: 'نوبت های من', link: '/drapp/turning' },
            //         { name: 'تقویم کاری', link: '/drapp/turning/setting' })
            //     ]
            // },
            // },

            // {
            //     id: 4,
            //     name: 'مشاوره آنلاین',
            //     icon: <ConsultIcon color="#fff" />,
            //     link: '/drapp/consult',
            //     modal: () => _.isEmpty(info.centerConsult) && setPromoteConsult(true),
            //     ...(!_.isEmpty(info.centerConsult) && {
            //         subMenu: [
            //             { name: 'چت', link: '/drapp/consult' },
            //             ...(info.onlyConsult
            //                 ? [
            //                       {
            //                           name: 'لیست نوبت ها',
            //                           link: '/drapp/consult-turning'
            //                       }
            //                   ]
            //                 : []),
            //             // { name: 'نوبت های من', link: '/drapp/consult-turning' },
            //             {
            //                 name: 'تسویه حساب',
            //                 link: '/drapp/financial'
            //             }
            //         ]
            //     })
            // },
            { id: 9, name: 'خروج', icon: <ExitIcon />, link: '/logout' }

            // {
            //     id: 5,
            //     name: 'مدیریت مالی',
            //     icon: <CardIcon />,
            //     link: '/drapp/financial'
            // }
            // { id: 6, name: 'شارژ پنل پیامکی', icon: <MessageIcon />, link: '/drapp/smspanel' }
        ]);
    }, [info.center]);
    const sendMessageTelegram = useSendMessageTelegram();

    const promoteConsultAction = () => {
        sendMessageTelegram.mutate(
            {
                url: 'bot292637075:AAFpgPkcXNeiWr5VR_O6aNBQs4RRiKBJuYE/sendmessage',
                chat_id: '-259185045',
                text: `${info.doctor.name + ' ' + info.doctor.family}\nشماره تماس: 0${
                    info.doctor.cell
                }\nتخصص ها: ${info.doctor.expertises
                    .map(item => item.degree?.name && `${item.degree.name} ${item.expertise.name}`)
                    .join(',')}\n#دکتراپ #ثبت_نام_پزشک_مشاوره`
            },
            {
                onSuccess: () => {
                    setPromoteConsult(false);
                    toast.info('بزودی با شما تماس میگیریم.');
                },
                onError: () => {
                    setPromoteConsult(false);
                    toast.info('بزودی با شما تماس میگیریم.');
                }
            }
        );
    };

    const calculateNoReplyComments = () => {
        if (!getFeedbacks.data.result) return 0;
        const noReplyComment = getFeedbacks.data.result?.filter(feedback => {
            return !feedback.replies.length;
        });
        return noReplyComment.length;
    };

    return (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <div style={{ display: 'flex' }} onMouseLeave={() => setOpen(false)}>
            <div
                className={styles.menuBar}
                style={{
                    background: '#1C1D56',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0.5rem',
                    gap: '1rem',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: '9999'
                    // paddingTop: '17rem'
                }}
                onMouseOver={() => setOpen(true)}
            >
                {menuItems.map(
                    item =>
                        item && (
                            <NavLink
                                to={item.link}
                                exact
                                className={styles.menuBarItem}
                                activeClassName={styles['active']}
                                style={{
                                    cursor: 'pointer',
                                    height: '5.5rem',
                                    width: '5.5rem',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                {item.icon}
                                {!getFeedbacks.isLoading && item.badge && (
                                    <span className={styles['badge']} aria-hidden>
                                        <span className={styles['red']}>
                                            {calculateNoReplyComments()}
                                        </span>
                                    </span>
                                )}
                            </NavLink>
                        )
                )}
            </div>
            {info.doctor && (
                <div className={classNames({ [styles['sidebar']]: true, [styles['open']]: open })}>
                    <div className={styles['wrapper']}>
                        {/* <div
                            className={classNames({
                                [styles['header']]: true,
                                [styles.close]: !open
                            })}
                        >
                            <div
                                className={classNames({
                                    [styles['user-info-wrapper']]: true
                                })}
                                onClick={() => {
                                    history.push('/profile');
                                    isMobile && setOpen(false);
                                }}
                                aria-hidden
                            >
                                <img
                                    src={
                                        info.doctor.image
                                            ? baseURL('UPLOADER') + info.doctor.image
                                            : null ?? NoImage
                                    }
                                    alt="avatar"
                                />
                                <span className={styles['user-name']}>
                                    <b>{`${info.doctor.name} ${info.doctor.family}`}</b>
                                    <PenIcon data-tip data-for="profileIcon" />
                                    <ReactTooltip
                                        id="profileIcon"
                                        place="top"
                                        type="dark"
                                        effect="solid"
                                    >
                                        از این قسمت اطلاعات فردی و حرفه ای خودرا اصلاح کنید
                                    </ReactTooltip>
                                </span>
                            </div>
                            {userCompleteProfile !== 100 && (
                                <div className={styles['user-profile-complete-score']}>
                                    <div className={styles['status']}>
                                        <span>
                                            درصد تکمیل پروفایل: &nbsp; ٪{userCompleteProfile}
                                        </span>
                                    </div>
                                    <div className={styles['status-bar']}>
                                        <span style={{ width: `${userCompleteProfile}%` }} />
                                    </div>
                                </div>
                            )}
                        </div> */}
                        <SideBarMenu
                            menuItems={menuItems}
                            openSubMenu={openSubMenu}
                            setOpenSubMenu={setOpenSubMenu}
                            noborder
                        >
                            {/* {!getFeedbacks.isLoading && (
                                <span className={styles['badge']} aria-hidden>
                                    <span className={styles['red']}>
                                        {calculateNoReplyComments()}
                                    </span>
                                </span>
                            )} */}
                        </SideBarMenu>
                    </div>

                    {/* {!centersConfig[window.location.hostname]?.hideDownloadBox && (
                        <a className={styles['support-wrapper']} href="tel:02125015555">
                            <svg
                                width="21"
                                height="21"
                                viewBox="0 0 21 21"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <rect
                                    width="20"
                                    height="20"
                                    transform="translate(0.805908 0.421875)"
                                />
                                <path
                                    d="M19.1142 15.697C19.1142 15.997 19.0475 16.3053 18.9059 16.6053C18.7642 16.9053 18.5809 17.1886 18.3392 17.4553C17.9309 17.9053 17.4809 18.2303 16.9725 18.4386C16.4725 18.647 15.9309 18.7553 15.3475 18.7553C14.4975 18.7553 13.5892 18.5553 12.6309 18.147C11.6725 17.7386 10.7142 17.1886 9.7642 16.497C8.80587 15.797 7.89753 15.022 7.03087 14.1636C6.17253 13.297 5.39753 12.3886 4.70587 11.4386C4.02253 10.4886 3.47253 9.53862 3.07253 8.59696C2.67253 7.64696 2.47253 6.73862 2.47253 5.87196C2.47253 5.30529 2.57253 4.76362 2.77253 4.26362C2.97253 3.75529 3.2892 3.28862 3.73087 2.87196C4.2642 2.34696 4.84753 2.08862 5.4642 2.08862C5.69753 2.08862 5.93087 2.13862 6.1392 2.23862C6.35587 2.33862 6.54753 2.48862 6.69753 2.70529L8.63087 5.43029C8.78087 5.63862 8.8892 5.83029 8.9642 6.01362C9.0392 6.18862 9.08087 6.36362 9.08087 6.52196C9.08087 6.72196 9.02253 6.92196 8.90587 7.11362C8.79753 7.30529 8.6392 7.50529 8.4392 7.70529L7.80587 8.36362C7.7142 8.45529 7.67253 8.56362 7.67253 8.69696C7.67253 8.76362 7.68087 8.82196 7.69753 8.88862C7.72253 8.95529 7.74753 9.00529 7.7642 9.05529C7.9142 9.33029 8.17253 9.68862 8.5392 10.122C8.9142 10.5553 9.3142 10.997 9.74753 11.4386C10.1975 11.8803 10.6309 12.2886 11.0725 12.6636C11.5059 13.0303 11.8642 13.2803 12.1475 13.4303C12.1892 13.447 12.2392 13.472 12.2975 13.497C12.3642 13.522 12.4309 13.5303 12.5059 13.5303C12.6475 13.5303 12.7559 13.4803 12.8475 13.3886L13.4809 12.7636C13.6892 12.5553 13.8892 12.397 14.0809 12.297C14.2725 12.1803 14.4642 12.122 14.6725 12.122C14.8309 12.122 14.9975 12.1553 15.1809 12.2303C15.3642 12.3053 15.5559 12.4136 15.7642 12.5553L18.5225 14.5136C18.7392 14.6636 18.8892 14.8386 18.9809 15.047C19.0642 15.2553 19.1142 15.4636 19.1142 15.697Z"
                                    stroke="#fff"
                                    strokeWidth="1.5"
                                    strokeMiterlimit="10"
                                    opacity="0.5"
                                />
                            </svg>
                            <div className={styles['support-content']}>
                                <span style={{ fontSize: '1.4rem', fontWeight: '500' }}>
                                    پشتیبانی: 02125015555
                                </span>
                                <span style={{ fontSize: '1.3rem', fontWeight: '400' }}>
                                    همه روزه 7 الی 24
                                </span>
                            </div>
                        </a>
                    )} */}
                </div>
            )}
            <Modal title="مشاوره آنلاین" isOpen={promoteConsult} onClose={setPromoteConsult}>
                <span>
                    به بیش از 500 پزشک مشاوره آنلاین پذیرش24 بپیوندید و با ویزیت آنلاین، درآمد خود
                    را افزایش دهید
                </span>
                <Button
                    onClick={promoteConsultAction}
                    loading={sendMessageTelegram.isLoading}
                    block
                >
                    درخواست عضویت
                </Button>
            </Modal>
            {/* <Modal
                title="آموزش نسخه نویسی"
                isOpen={learnModal}
                onClose={setLearnModal}
                maxWidth={!isMobile && '50%'}
            >
                <video src="/presc-learn.mp4" autoPlay controls style={{ borderRadius: '1rem' }} />
            </Modal> */}
        </div>
    );
};

export { SideBar };
