import styles from 'assets/styles/pages/drApp/index.module.scss';

import isEmpty from 'lodash/isEmpty';
import queryString from 'query-string';
import { setToken } from '@paziresh24/utils/localstorage';
import { useEffect, useState } from 'react';
import { useDrApp } from '@paziresh24/context/drapp';
import { Loading } from '@paziresh24/shared/ui/loading';
import { useGetCenterInfo, useGetDoctorInfo } from '@paziresh24/hooks/drapp/profile';
import Modal from '@paziresh24/shared/ui/modal';
// HOOKS
import { Route, useHistory, useLocation } from 'react-router-dom';
import { getToken } from '@paziresh24/utils/localstorage';
import classNames from 'classnames';
import { useGetUserGoftino, useSetUserGoftino } from '@paziresh24/hooks/drapp/goftino';
import Helmet from 'react-helmet';
import * as Sentry from '@sentry/browser';
import { ChatSupport } from '@paziresh24/utils/services/chatSupport';
import Button from '@paziresh24/shared/ui/button';
import { useGetLatestVersion } from '@paziresh24/hooks/core';
import * as serviceWorkerRegistration from 'apps/drapp/src/serviceWorkerRegistration';
import { usePage } from '@paziresh24/context/core/page';
import { CSSTransition } from 'react-transition-group';
import LearnControl from './../learnControl/index';
import ErrorByRefresh from '@paziresh24/shared/ui/errorByRefresh';
import { useGetLevels } from '@paziresh24/prescription-dashboard/apis/getLevel/useGetLevel.hook';
import { useLevel } from '@paziresh24/context/core/level';
import { useGetCentersDoctor } from 'apps/drapp/src/hooks/useGetCentersDoctor';
import { useGetPaymentSetting } from '@paziresh24/hooks/drapp/payment';
import { usePaymentSettingStore } from 'apps/drapp/src/store/paymentSetting.store';

const PrivateRoute = props => {
    const [info, setInfo] = useDrApp();
    const [, setLevel] = useLevel();
    const setPaymentSetting = usePaymentSettingStore(state => state.setSetting);

    const [, setPage] = usePage();
    const [centersDoctor, setCentersDoctor] = useState([]);
    const getCentersDoctor = useGetCentersDoctor();

    const getLevels = useGetLevels();

    const doctorInfo = useGetDoctorInfo({
        center_id: centersDoctor?.[centersDoctor?.length - 1]?.id
    });
    const history = useHistory();
    const { search } = useLocation();
    const urlParams = queryString.parse(search);
    const [changeLogModal, setChangeLogModal] = useState(false);
    const [promoteModal, setPromoteModal] = useState(false);
    const getUserGoftino = useGetUserGoftino();
    const setUserGoftino = useSetUserGoftino();
    const getLatestVersion = useGetLatestVersion();
    const getPaymentSetting = useGetPaymentSetting({ center_id: info?.center?.id });
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        setPage(props);
        if (isEmpty(info) && !isEmpty(getToken())) {
            if (props.path !== '/create-center') {
                handleGetCenters();
            }
            getUserGoftino.refetch();
            window._env_.P24_STATISTICS_API && getLevels.refetch();
        }
    }, []);

    useEffect(() => {
        if (info.center?.id) {
            getPaymentSetting.remove();
            getPaymentSetting.refetch();
        }
    }, [info.center]);

    useEffect(() => {
        if (getPaymentSetting.isSuccess) {
            setPaymentSetting(getPaymentSetting.data);
        }
    }, [getPaymentSetting.status]);

    const handleGetCenters = async () => {
        const centers = await getCentersDoctor.refetch();
        setCentersDoctor([centers[0]]);
    };

    useEffect(() => {
        if (getLevels.isSuccess && doctorInfo.isSuccess && getCentersDoctor.status.success) {
            const level = getLevels.data.data?.[0]?.user_level ?? 'DOCTOR';
            setLevel(level);
            if ((props.path !== '/dashbord' || props.path !== '/logout') && level !== 'DOCTOR') {
                history.replace('/dashboard');
            }
        }
    }, [getLevels.status, doctorInfo.status, getCentersDoctor.status.success]);

    useEffect(() => {
        if (getCentersDoctor.status.success && centersDoctor.length !== 0) {
            doctorInfo.refetch();
        }
    }, [getCentersDoctor.status, centersDoctor]);

    useEffect(() => {
        if (doctorInfo.isSuccess) {
            const doctor = doctorInfo.data.data ?? {};
            setInfo(prev => ({
                ...prev,
                doctor
            }));

            window.user_information = {
                doctor: doctor,
                center: info.center
            };

            Sentry.setUser({ user: doctor });

            ChatSupport.setUserInfo(doctor);

            const doctorNotActiveOfficeAndConsult = !info.centers.some(
                center =>
                    center.id === '5532' || (center?.type_id === 1 && center?.is_active_booking)
            );
            if (
                !window._env_.P24_IS_PROXY_CENTER &&
                !window._env_.P24_IS_LOCAL_CENTER &&
                doctorNotActiveOfficeAndConsult &&
                info.centers.length === 1 &&
                info.centers.find(center => +center.type_id === 1)
            ) {
                history.push('/activation');
            }
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
                        })
                    )
                );
            }
            getLatestVersion.data.changeLog && setChangeLogModal(true);
        }
    }, [getLatestVersion.status]);

    if (isEmpty(getToken()))
        history.replace(`/auth?url=${encodeURIComponent(window.location.href)}`);

    const closePromothModal = () => {
        setPromoteModal(false);
        window.__promote_turn_close = true;
    };

    return (
        <>
            <Helmet>
                <title>{props.title}</title>
                <link rel="canonical" href={`https://dr.paziresh24.com${props.path}`} />
            </Helmet>
            <Loading
                show={
                    !info.doctor &&
                    !getCentersDoctor.status.error &&
                    !isError &&
                    props.path !== '/create-center'
                }
            />
            <ErrorByRefresh show={getCentersDoctor.status.error || isError} />
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
                {(info.doctor || props.path === '/create-center') && (
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
            <Modal title="تغییرات اخیر" isOpen={changeLogModal} onClose={setChangeLogModal}>
                <span className="text-gray-500 font-medium text-sm pr-3 whitespace-pre-line leading-8 border-r-2 border-solid border-gray-300">
                    {getLatestVersion.isSuccess && getLatestVersion.data.changeLog}
                </span>
                <span className="text-sm font-medium text-gray-300 mx-auto">
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
