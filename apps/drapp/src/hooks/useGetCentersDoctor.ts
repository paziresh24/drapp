import { useDrApp } from '@paziresh24/context/drapp';
import { centerInfo } from '@paziresh24/apis/drApp/profile/centerInfo';
import isEmpty from 'lodash/isEmpty';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';

export const useGetCentersDoctor = () => {
    const [, setDoctorInfo] = useDrApp();
    const router = useHistory();
    const [status, setStatus] = useState({
        loading: false,
        error: false,
        success: false
    });
    const [data, setData] = useState();

    const setDataCenter = (centers: any) => {
        let center: any;
        const isPrescriptionLocalInstallFieldAvailable =
            centers[0]?.prescription_local_install !== undefined;

        const isAllHospitalCentersNotInstalledPrescriptionLocal =
            centers
                .filter(
                    (item: { type_id: number; id: string }) =>
                        item.type_id !== 1 && item.id !== '5532'
                )
                .every(
                    (item: { prescription_local_install: boolean }) =>
                        item?.prescription_local_install === false
                ) &&
            !centers.some(
                (item: { type_id: number; id: string }) => item.type_id === 1 || item.id === '5532'
            );

        if (
            (!(window as any)._env_.P24_IS_PROXY_CENTER &&
                isPrescriptionLocalInstallFieldAvailable &&
                isAllHospitalCentersNotInstalledPrescriptionLocal) ||
            isEmpty(centers)
        )
            return router.push('/create-center');

        if (
            isEmpty(
                centers.find(
                    (item: { id: string | null }) => item.id === localStorage.getItem('center_id')
                )
            )
        ) {
            center =
                router.location.pathname === '/onlineVisitRules'
                    ? centers.find((center: { id: string }) => center.id === '5532')
                    : centers[0];
            localStorage.setItem('center_id', center.id);
        } else {
            center = centers.find(
                (item: { id: string | null }) =>
                    item.id ===
                    (router.location.pathname === '/onlineVisitRules'
                        ? '5532'
                        : localStorage.getItem('center_id'))
            );
        }
        const centerConsult = centers.find((center: { id: string }) => center.id === '5532') ?? {};
        const onlyConsult = centerConsult.id === '5532' && isEmpty(center);

        setDoctorInfo((prev: any) => ({
            ...prev,
            centers,
            center,
            centerConsult,
            onlyConsult
        }));
    };

    const handleStatus = ({
        loading = false,
        error = false,
        success = false
    }: {
        loading?: boolean;
        error?: boolean;
        success?: boolean;
    }) => {
        setStatus({
            loading,
            error,
            success
        });
    };

    const refetch = async () => {
        handleStatus({ loading: true });
        try {
            const { data } = await centerInfo();
            setData(data);
            setDataCenter(data);
            handleStatus({ loading: false, success: true });
            return new Promise(resolve => resolve(data));
        } catch (e) {
            handleStatus({ loading: false, error: true });
            return new Promise((_, reject) => reject(e));
        }
    };

    return { refetch, status, data };
};
