import queryString from 'query-string';
import _ from 'lodash';
import { providers } from '../../../constants/prescription.json';

// HOOKS
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAddPrescription, useGetMe, useGetPrescriptions } from '../../../hooks/prescription/';
import { v4 as uuid } from 'uuid';
import { getToken, setToken } from '@paziresh24/utils/localstorage.js';
import {
    GETـPRESCRIPTIONـTOKEN,
    CLEAR_PRESCRIPTIONـTOKEN
} from '@paziresh24/utils/services/prescription/localstorage.js';
import { toEnglishNumber } from '@paziresh24/utils';

// COMPONENTS
import { Loading } from '../../../components/prescription/loading';
import Error from '../../../components/core/error';
import { toast } from 'react-toastify';
import { useBackPage } from 'context/core/backPage';

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

    useEffect(() => {
        addPrescription.reset();
        getPrescription.remove();
        if (params.token) {
            setToken(params.token);
        }

        setBackPage(params.back_page ?? null);
    }, []);

    const validParams = params.patient_nationalcode && params.patient_cell;

    useEffect(() => {
        if (getMe.isSuccess) {
            if (
                !_.isEmpty(getMe.data['salamat_doctor']) ||
                !_.isEmpty(getMe.data['tamin_doctor'])
            ) {
                return getPrescription.refetch();
            }
            history.replace(`/providers`);
        }
    }, [getMe.status]);

    useEffect(() => {
        if (getPrescription.isSuccess) {
            if (_.isEmpty(getPrescription.data)) {
                addPrescription.mutate(
                    {
                        patientNationalCode: params.patient_nationalcode,
                        patientCell: !toEnglishNumber(params.patient_cell).startsWith('0')
                            ? `0${toEnglishNumber(params.patient_cell)}`
                            : toEnglishNumber(params.patient_cell),
                        issuer_center: params.provider,
                        identifier: params.book_id ?? uuidInstance,
                        tags: JSON.parse(params.tags) ?? null
                    },
                    {
                        onError: err => {
                            toast.error(err.response.data.message);
                        }
                    }
                );
            } else {
                return history.replace(`/${getPrescription.data[0]?.id}`);
            }
        }
    }, [getPrescription.status]);

    useEffect(() => {
        if (
            addPrescription.isSuccess &&
            addPrescription.data?.message !== 'کد تایید دو مرحله‌ای را ارسال کنید'
        ) {
            return history.replace(`/${addPrescription.data.result?.id}`);
        }
    }, [addPrescription.status]);

    if (_.isEmpty(validParams)) {
        return <Error code="400" error="Bad Request" message="مقادیر ارسالی نامعتبر است" />;
    }

    return <Loading show={true} />;
};

export default Create;
