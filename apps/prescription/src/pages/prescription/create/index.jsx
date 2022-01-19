import queryString from 'query-string';
import isEmpty from 'lodash/lodash';

// HOOKS
import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAddPrescription, useGetMe, useGetPrescriptions } from '@paziresh24/hooks/prescription/';
import { v4 as uuid } from 'uuid';
import { getToken, setToken } from '@paziresh24/utils/localstorage.js';
import { toEnglishNumber } from '@paziresh24/utils';

// COMPONENTS
import { Loading } from '@paziresh24/components/prescription/loading';
import Error from '@paziresh24/components/core/error';
import { toast } from 'react-toastify';
import { useBackPage } from '@paziresh24/context/core/backPage';

const Create = () => {
    const { search } = useLocation();
    const params = queryString.parse(search);
    const getMe = useGetMe();
    const addPrescription = useAddPrescription();
    const getPrescription = useGetPrescriptions({
        identifier: params.book_id ?? null
    });

    const history = useHistory();
    const uuidInstance = uuid();
    const [, setBackPage] = useBackPage();

    const validParams = params.patient_nationalcode && params.patient_cell;
    useEffect(() => {
        addPrescription.reset();
        getPrescription.remove();
        if (params.token) {
            setToken(params.token);
        }

        if (validParams) {
            getPrescription.refetch();
        }

        setBackPage(params.back_page ?? null);
    }, []);

    useEffect(() => {
        if (getPrescription.isSuccess) {
            if (isEmpty(getPrescription.data) || !params.book_id) {
                addPrescription.mutate(
                    {
                        patientNationalCode: params.patient_nationalcode,
                        patientCell: !toEnglishNumber(params.patient_cell).startsWith('0')
                            ? `0${toEnglishNumber(params.patient_cell)}`
                            : toEnglishNumber(params.patient_cell),
                        identifier: params.book_id ?? uuidInstance,
                        ...(params.tags && { tags: JSON.parse(params.tags) })
                    },
                    {
                        onError: err => {
                            toast.error(err.response.data.message);
                        }
                    }
                );
            } else {
                return history.replace(`/prescription/patient/${getPrescription.data[0]?.id}`);
            }
        }
    }, [getPrescription.status]);

    useEffect(() => {
        if (
            addPrescription.isSuccess &&
            addPrescription.data?.message !== 'کد تایید دو مرحله‌ای را ارسال کنید'
        ) {
            return history.replace(`/prescription/patient/${addPrescription.data.result?.id}`);
        }
    }, [addPrescription.status]);

    if (isEmpty(validParams)) {
        return <Error code="400" error="Bad Request" message="مقادیر ارسالی نامعتبر است" />;
    }

    return <Loading show={true} />;
};

export default Create;
