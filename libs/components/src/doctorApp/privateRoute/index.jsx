import styles from 'assets/styles/pages/drApp/index.module.scss';

import isEmpty from 'lodash/isEmpty';
import queryString from 'query-string';
import { setToken } from '@paziresh24/utils/localstorage';
import { useEffect, useState } from 'react';
import { useDrApp } from '@paziresh24/context/drapp';
import { Loading } from '../../core/loading';
import { useGetCenterInfo, useGetDoctorInfo } from '@paziresh24/hooks/drapp/profile';
import Modal from '@paziresh24/components/core/modal';
// HOOKS
import { Route, useHistory, useLocation } from 'react-router-dom';
import { getToken } from '@paziresh24/utils/localstorage';
import { sendEvent } from '@paziresh24/utils';
import classNames from 'classnames';
import { useGetUserGoftino, useSetUserGoftino } from '@paziresh24/hooks/drapp/goftino';
import Helmet from 'react-helmet';
import * as Sentry from '@sentry/browser';
import { ChatSupport } from '@paziresh24/utils/services/chatSupport';
import Button from '@paziresh24/components/core/button';
import { useGetLatestVersion } from '@paziresh24/hooks/core';
import * as serviceWorkerRegistration from 'apps/drapp/src/serviceWorkerRegistration';
import { usePage } from '@paziresh24/context/core/page';
import { CSSTransition } from 'react-transition-group';
import LearnControl from './../learnControl/index';
import ErrorByRefresh from '@paziresh24/components/core/errorByRefresh';

const PrivateRoute = props => {
    const [info, setInfo] = useDrApp();
    const [, setPage] = usePage();
    const [centersDoctor, setCentersDoctor] = useState([]);
    const centerInfo = useGetCenterInfo();
    const doctorInfo = useGetDoctorInfo({
        center_id: centersDoctor?.[centersDoctor?.length - 1]?.id
        // center_id: 5532
    });
    const history = useHistory();
    const { search } = useLocation();
    const urlParams = queryString.parse(search);
    const [changeLogModal, setChangeLogModal] = useState(false);
    const [promoteModal, setPromoteModal] = useState(false);
    const getUserGoftino = useGetUserGoftino();
    const setUserGoftino = useSetUserGoftino();
    const getLatestVersion = useGetLatestVersion();
    const [isError, setIsError] = useState(false);

    const isProduction = process.env.NODE_ENV === 'production';
    const isMainDomain = window.location.host === window._env_.P24_MAIN_DOMAIN;

    useEffect(() => {
        setPage(props);
        if (isEmpty(info) && !isEmpty(getToken())) {
            centerInfo.refetch();
            getUserGoftino.refetch();
            if (isProduction && isMainDomain) {
                // ChatSupport.init();
            }
            if (!isProduction) {
                // ChatSupport.init();
            }
        }
    }, []);

    useEffect(() => {
        if (!info && centerInfo.isSuccess) {
            let center;

            if (
                isEmpty(
                    centerInfo.data.data.find(item => item.id === localStorage.getItem('center_id'))
                )
            ) {
                center = centerInfo.data.data[0];
                localStorage.setItem('center_id', center.id);
            } else {
                center = centerInfo.data.data.find(
                    item => item.id === localStorage.getItem('center_id')
                );
            }
            const centers = centerInfo.data.data;
            const centerConsult = centerInfo.data.data.find(center => center.id === '5532') ?? {};
            const onlyConsult = centerConsult.id === '5532' && isEmpty(center);
            setCentersDoctor(prev => [...prev, centers[0]]);

            setInfo({
                centers,
                center,
                centerConsult,
                onlyConsult
            });
        }
    }, [centerInfo.status]);

    useEffect(() => {
        if (!isEmpty(centersDoctor)) {
            doctorInfo.refetch();
        }
    }, [centersDoctor]);

    // useEffect(() => {
    //     if (info.center) {
    //         // doctorInfo.remove();
    //     }
    // }, [info.center]);

    useEffect(() => {
        if (doctorInfo.isSuccess) {
            const doctor = doctorInfo.data.data ?? {};
            setInfo(prev => ({
                ...prev,
                doctor
            }));

            Sentry.setUser({ user: doctor });

            ChatSupport.setUserInfo(doctor);
        }
        if (doctorInfo.isError) {
            if (centersDoctor.length <= info.centers.length) {
                setCentersDoctor(prev => [...prev, info.centers[prev.length - 1 + 1]]);
            } else {
                setIsError(true);
            }
        }
    }, [doctorInfo.status]);

    useEffect(() => {
        if (getUserGoftino.isSuccess)
            ChatSupport.setUserId(getUserGoftino.data.data, setUserGoftino.mutate);
    }, [getUserGoftino.status]);

    if (urlParams.token) setToken(urlParams.token);

    useEffect(() => {
        if (
            getLatestVersion.isSuccess &&
            getLatestVersion.data.name !== localStorage.getItem('APP_VERSION')
        ) {
            localStorage.setItem('APP_VERSION', getLatestVersion.data.name);
            if ('serviceWorker' in navigator) {
                caches.keys().then(keys =>
                    keys.forEach(key =>
                        caches.delete(key).then(() => {
                            serviceWorkerRegistration.unregister();
                            window.location.reload();
                        })
                    )
                );
            }
            getLatestVersion.data.changeLog && setChangeLogModal(true);
        }
    }, [getLatestVersion.status]);

    if (isEmpty(getToken()))
        history.replace(
            `/auth${props.path !== '/' ? '?url=' + encodeURIComponent(window.location.href) : ''}`
        );

    if (info.center && !info.center?.is_active_booking && props.name === 'Setting') {
        sendEvent('click', 'home', 'clickturningbutton');
        history.replace('/fill-info');
    }

    // if (
    //     info &&
    //     !info.center.is_active_booking &&
    //     props.name !== 'FillInfo' &&
    //     props.name !== 'Profile' &&
    //     !info.onlyConsult
    // ) {
    //     setTimeout(() => {
    //         if (window.__promote_turn_close === undefined) {
    //             setPromoteModal(true);
    //         }
    //     }, 15000);
    // }

    const closePromothModal = () => {
        setPromoteModal(false);
        window.__promote_turn_close = true;
    };

    return (
        <>
            <Helmet>
                <title>{`${props.title} | پذیرش24` ?? ''}</title>
                <link rel="canonical" href={`https://doctorapp.paziresh24.com${props.path}`} />
            </Helmet>
            <Loading show={!info.doctor && !centerInfo.isError && !isError} />
            <ErrorByRefresh show={centerInfo.isError || isError} />
            <div
                className={classNames({
                    [styles['inner']]: true,
                    [styles['full']]:
                        props.name === 'Consult' ||
                        props.name === 'ConsultTurning' ||
                        props.name === 'ConsultTerm' ||
                        props.name === 'Financial' ||
                        props.name === 'Qa' ||
                        props.name === 'Learn',
                    [styles['prescription']]:
                        props.name === 'Prescription' ||
                        props.name === 'PrescriptionProviders' ||
                        props.name === 'PrescriptionCreate' ||
                        props.name === 'PrescriptionId',
                    [styles['turning']]: props.name === 'Turning'
                })}
            >
                {info.doctor && (
                    <Route {...props}>
                        {({ match }) => (
                            <CSSTransition
                                in={match != null}
                                timeout={300}
                                classNames="page"
                                unmountOnExit
                            >
                                <props.component />
                            </CSSTransition>
                        )}
                    </Route>
                )}
            </div>
            <LearnControl />
            <Modal title="تغییرات نسخه جدید" isOpen={changeLogModal} onClose={setChangeLogModal}>
                <span
                    style={{
                        whiteSpace: 'pre-line',
                        lineHeight: '3.5rem',
                        borderRight: '3px solid #c5d7e682',
                        paddingRight: '1.5rem',
                        color: '#76838c',
                        fontWeight: '500',
                        fontSize: ' 1.45rem'
                    }}
                >
                    {getLatestVersion.isSuccess && getLatestVersion.data.changeLog}
                </span>
                <span
                    style={{
                        margin: '0 auto',
                        color: '#76838c60',
                        fontWeight: '500',
                        fontSize: ' 1.45rem'
                    }}
                >
                    {getLatestVersion.isSuccess && getLatestVersion.data.name}
                </span>
            </Modal>
            <Modal isOpen={promoteModal} onClose={closePromothModal}>
                <span
                    style={{
                        fontSize: '1.6rem',
                        fontWeight: '500',
                        textAlign: 'center',
                        lineHeight: '3.5rem'
                    }}
                >
                    در کمتر از 5 دقیقه نوبت دهی مطب خود را در روز و ساعت دلخواه فعال کنید.
                </span>
                <Button
                    onClick={() => {
                        window.__promote_turn_close = true;
                        history.push('/fill-info');
                    }}
                >
                    فعالسازی
                </Button>
            </Modal>
        </>
    );
};

export default PrivateRoute;
