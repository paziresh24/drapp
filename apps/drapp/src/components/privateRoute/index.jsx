import styles from 'assets/styles/pages/drApp/index.module.scss';
import isEmpty from 'lodash/isEmpty';
import queryString from 'query-string';
import { setToken } from '@paziresh24/utils/localstorage';
import { memo, useEffect, useState } from 'react';
import { useDrApp } from '@paziresh24/context/drapp';
import { Loading } from '@paziresh24/shared/ui/loading';
import { useGetDoctorInfo } from '@paziresh24/hooks/drapp/profile';
import Modal from '@paziresh24/shared/ui/modal';
import { Route, useHistory, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import Helmet from 'react-helmet';
import * as Sentry from '@sentry/browser';
import { useGetLatestVersion } from '@paziresh24/hooks/core';
import * as serviceWorkerRegistration from 'apps/drapp/src/serviceWorkerRegistration';
import { usePage } from '@paziresh24/context/core/page';
import { CSSTransition } from 'react-transition-group';
import ErrorByRefresh from '@paziresh24/shared/ui/errorByRefresh';
import { useGetLevels } from '@paziresh24/prescription-dashboard/apis/getLevel/useGetLevel.hook';
import { useLevel } from '@paziresh24/context/core/level';
import OtpCodePresciprion from '../otpCodePrescription/otpCodePrescription';
import { useGetCentersDoctor } from 'apps/drapp/src/hooks/useGetCentersDoctor';
import { usePrescriptionSettingStore } from 'apps/drapp/src/store/prescriptionSetting.store';
import { useGetPaymentSetting } from '../../apis/payment/getPaymentSetting';
import { useInsurances } from '@paziresh24/hooks/prescription/insurances';
import { toast } from 'react-toastify';
import CONSULT_CENTER_ID from '@paziresh24/constants/consultCenterId';
import OFFICE_CENTER from '@paziresh24/constants/officeCenter';
import { useGetInfo } from '@paziresh24/hooks/drapp/home';
import { useGetUser } from '../../apis/user/getUser';
import { useGetProvider } from '../../apis/provider/getProvider';
import { isEmbed } from '@paziresh24/shared/utils';
import { useGetNotifyCell } from '../../apis/provider/getNotifyCell';
import { growthbook } from '../../app';

const PrivateRoute = props => {
    const [info, setInfo] = useDrApp();
    const [, setLevel] = useLevel();
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
    const getLatestVersion = useGetLatestVersion();
    const [isError, setIsError] = useState(false);
    const setPrescriptionSetting = usePrescriptionSettingStore(state => state.setSetting);
    const getPaymentSetting = useGetPaymentSetting({ center_id: info?.center?.id });
    const insurancesRequest = useInsurances();
    const getMe = useGetInfo();

    const getUser = useGetUser();
    const getProvider = useGetProvider({ user_id: getMe.data?.data?.id });
    const getNotifyCell = useGetNotifyCell({
        provider_id: getProvider.data?.data?.providers?.[0]?.id
    });

    useEffect(() => {
        setPage(props);
        if (isEmpty(info)) {
            if (location.hostname.includes('sum'))
                setPrescriptionSetting({
                    editProviders: false
                });
            if (props.path !== '/create-center') {
                handleGetCenters();
                getMe.refetch();
            }
            window._env_.P24_STATISTICS_API && getLevels.refetch();
        }
    }, []);

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
        if (getCentersDoctor.status.success && centersDoctor.length !== 0 && getMe.isSuccess) {
            doctorInfo.refetch();
            insurancesRequest.refetch();

            setInfo(prev => ({
                ...prev,
                user: getMe.data.data
            }));

            getUser.refetch();
            getProvider.refetch();
        }
    }, [getCentersDoctor.status, centersDoctor, getMe.status]);

    useEffect(() => {
        if (getUser.isSuccess) {
            setInfo(prev => ({
                ...prev
            }));
        }
    }, [getUser.status]);

    useEffect(() => {
        if (doctorInfo.isSuccess) {
            let doctor = doctorInfo.data.data ?? {};

            if (getUser.isSuccess) {
                growthbook.setAttributes({
                    user_id: getUser.data?.data?.users?.[0]?.id
                });
                doctor = {
                    ...doctor,
                    name: getUser.data.data?.users?.[0]?.name,
                    family: getUser.data.data?.users?.[0]?.family,
                    national_code: getUser.data?.data?.users?.[0]?.national_code,
                    cell: getUser.data?.data?.users?.[0]?.cell,
                    user_id: getUser.data?.data?.users?.[0]?.id
                };
            }

            if (getProvider.isSuccess) {
                getNotifyCell.refetch();
                doctor = {
                    ...doctor,
                    medical_code: getProvider.data?.data?.providers?.[0]?.employee_id,
                    biography: getProvider.data?.data?.providers?.[0]?.biography,
                    slug: getProvider.data?.data?.providers?.[0]?.slug,
                    provider_id: getProvider.data.data?.providers?.[0]?.id
                };
            }

            setInfo(prev => ({
                ...prev,
                doctor
            }));

            getPaymentSetting.refetch();

            window.user_information = {
                doctor: doctor,
                center: info.center
            };

            Sentry.setUser({ user: doctor });

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
    }, [doctorInfo.status, getUser.status, getProvider.status]);

    useEffect(() => {
        if (getNotifyCell.isSuccess) {
            setInfo(prev => ({
                ...prev,
                doctor: {
                    ...prev.doctor,
                    notify_cell: getNotifyCell.data.data?.providers?.[0]?.notify_cell
                        ? `0${getNotifyCell.data.data?.providers?.[0]?.notify_cell}`
                        : null
                }
            }));
        }
    }, [getNotifyCell.status]);

    useEffect(() => {
        if (insurancesRequest.isSuccess) {
            const insurances = insurancesRequest?.data ?? {};
            setInfo(prev => ({
                ...prev,
                isEnablePrescription:
                    !isEmpty(insurances?.tamin) || insurances?.salamat?.length > 0,
                insurances
            }));
        }
    }, [insurancesRequest.status]);

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

    useEffect(() => {
        if (
            info?.doctor &&
            info?.center &&
            info?.center?.type_id !== OFFICE_CENTER &&
            info.center?.id !== CONSULT_CENTER_ID &&
            props.dontShowForHospital
        ) {
            toast.error('دسترسی مرکز به این قسمت وجود ندارد.');
            history.replace('/');
        }
    }, [info?.center, info.doctor]);

    if (
        props.path !== '/create-center' &&
        !info.doctor &&
        !isError &&
        !getCentersDoctor.status.error
    )
        return <Loading show={true} simple={isEmbed()} />;
    return (
        <>
            <Helmet>
                <title>{props.title}</title>
            </Helmet>
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
            <Modal title="تغییرات اخیر" isOpen={changeLogModal} onClose={setChangeLogModal}>
                <span className="pr-3 text-sm font-medium leading-8 text-gray-500 whitespace-pre-line border-r-2 border-gray-300 border-solid">
                    {getLatestVersion.isSuccess && getLatestVersion.data.changeLog}
                </span>
                <span className="mx-auto text-sm font-medium text-gray-300">
                    {getLatestVersion.isSuccess && getLatestVersion.data.name}
                </span>
            </Modal>
            <OtpCodePresciprion />
        </>
    );
};

export default memo(PrivateRoute);
