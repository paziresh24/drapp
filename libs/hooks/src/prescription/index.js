// HOOKS
import { useMutation, useQuery } from 'react-query';

// AUTH
import { auth } from '@paziresh24/apis/prescription/auth/login';
import { me } from '@paziresh24/apis/prescription/auth/me';
import { checkOtp } from '@paziresh24/apis/prescription/auth/checkOtp';
import { setSalamatData } from '@paziresh24/apis/prescription/auth/setSalamatData';
import { setTaminData } from '@paziresh24/apis/prescription/auth/setTaminData';

// HOME
import { addPrescription } from '@paziresh24/apis/prescription/home/addtPrescription';
import { getPrescriptions } from '@paziresh24/apis/prescription/home/getPrescriptions';

// FETCHPRESCRIPTION
import { getPrescriptionByPrintcode } from '@paziresh24/apis/prescription/fetchPrescription/printCode';
import { getPrescriptionBySamadcode } from '@paziresh24/apis/prescription/fetchPrescription/samadCode';
import { getPrescriptionReference } from '@paziresh24/apis/prescription/fetchPrescription/reference';

import { getPrescriptionPDF } from '@paziresh24/apis/prescription/home/getPrescriptionPDF';
import { getFavoritePrescriptions } from '@paziresh24/apis/prescription/favoriteFolder/getFavoritePrescriptions';
import { postFavoritePrescriptions } from '@paziresh24/apis/prescription/favoriteFolder/postFavoritePrescriptions';
import { deleteFavoritePrescriptions } from '@paziresh24/apis/prescription/favoriteFolder/deleteFavoritePrescriptions';

// TYPES
import { getOnePrescription } from '@paziresh24/apis/prescription/types/getOnePrescription';
import { getTypes } from '@paziresh24/apis/prescription/types/getTypes';
import { getItemServices } from '@paziresh24/apis/prescription/types/getItemServices';
import { finalizePrescription } from '@paziresh24/apis/prescription/types/finalize';
import { taminParTarefs } from '@paziresh24/apis/prescription/types/taminParTarefs';
import { deletePrescription } from '@paziresh24/apis/prescription/types/deletePrescription';

// SEARCH
import { search } from '@paziresh24/apis/prescription/search';
import { getFavoriteServices } from '@paziresh24/apis/prescription/search/getFavoriteServices';
import { addFavoriteServices } from '@paziresh24/apis/prescription/search/addFavoriteServices';
import { deleteFavoriteServices } from '@paziresh24/apis/prescription/search/deleteFavoriteServices';
import { getFrequentItems } from '@paziresh24/apis/prescription/search/getFrequentItems';

// DETAILS
import { getOneService } from '@paziresh24/apis/prescription/details/getOneService';
import { drugInstructions } from '@paziresh24/apis/prescription/details/drugInstructions';
import { drugAmounts } from '@paziresh24/apis/prescription/details/drugAmounts';
import { addItemService } from '@paziresh24/apis/prescription/details/addItemService';
import { deleteItemService } from '@paziresh24/apis/prescription/details/deleteItemServices';
import { editItemService } from '@paziresh24/apis/prescription/details/editItemServices';
import { getOneItemService } from '@paziresh24/apis/prescription/details/getOneItemService';

// CREATE
import { clinicLogin } from '@paziresh24/apis/prescription/auth/clinicLogin';

// DELIVER
import { deliverPrescription } from '@paziresh24/apis/prescription/deliver/deliverPrescription';
import { deliverPrescriptionInfo } from '@paziresh24/apis/prescription/deliver/deliverPrescriptionInfo';
import { deliverPrescriptionPriceInfo } from '@paziresh24/apis/prescription/deliver/deliverPrescriptionPriceInfo';

import { getLatestVersion } from '@paziresh24/apis/prescription/getLatestVersion';

import { importRequests } from '@paziresh24/apis/prescription/import/importRequests';
import { importStatus } from '@paziresh24/apis/prescription/import/importStatus';
import { importRequestsSalamat } from '@paziresh24/apis/prescription/import/salamat/importRequests';
import { importCaptchaSalamat } from '@paziresh24/apis/prescription/import/salamat/importCaptcha';
import { importOtpSalamat } from '@paziresh24/apis/prescription/import/salamat/importOtp';

const useAuth = () => {
    return useMutation(auth);
};

const useGetMe = () => {
    return useQuery('getMe', me, {
        enabled: false
    });
};

const useCheckOtp = () => {
    return useMutation(checkOtp);
};

const useClinicLogin = params => {
    return useQuery(['clinicLogin', params], () => clinicLogin(params), {
        enabled: false
    });
};

const useFinalizePrescription = () => {
    return useMutation(finalizePrescription);
};

const useGetOnePrescription = params => {
    return useQuery(['getOnePrescription', params], () => getOnePrescription(params), {
        enabled: false
    });
};

const useGetPrescriptions = params => {
    return useQuery(['getPrescriptions', params], () => getPrescriptions(params), {
        enabled: false
    });
};

const useGetItemServices = params => {
    return useQuery(['getItemServices', params], () => getItemServices(params), {
        enabled: false
    });
};

const useAddPrescription = () => {
    return useMutation(addPrescription);
};

const useGetTypes = params => {
    return useQuery(['getTypes', params], () => getTypes(params), {
        enabled: false
    });
};

const useSearch = (endpoint, params) => {
    return useQuery(['search', (endpoint, params)], () => search(endpoint, params), {
        enabled: false
    });
};
const useGetOneService = (provider, id) => {
    return useQuery(['getOneService', (provider, id)], () => getOneService(provider, id), {
        enabled: false
    });
};

const useGetDrugInstructions = params => {
    return useQuery(['getDrugInstructions', params], () => drugInstructions(params), {
        enabled: false
    });
};

const useGeTDrugAmounts = params => {
    return useQuery(['getDrugAmounts', params], () => drugAmounts(params), {
        enabled: false
    });
};

const useGetTaminParTarefs = () => {
    return useQuery(['taminParTarefs'], () => taminParTarefs(), {
        enabled: false
    });
};

const useAddItemService = () => {
    return useMutation(addItemService);
};

const useDeleteItemService = () => {
    return useMutation(deleteItemService);
};

const useEditItemService = () => {
    return useMutation(editItemService);
};

const useGetOneItemService = params => {
    return useQuery(['getOneItemService', params], () => getOneItemService(params), {
        enabled: false
    });
};

const useDeletePrescription = () => {
    return useMutation(deletePrescription);
};

const useGetFavoriteServices = params => {
    return useQuery(['favoriteServices', params], () => getFavoriteServices(params), {
        enabled: false
    });
};

const useAddFavoriteServices = () => {
    return useMutation(addFavoriteServices);
};

const useDeleteFavoriteServices = () => {
    return useMutation(deleteFavoriteServices);
};

const useGetPrescriptionPDF = params => {
    return useQuery(['getPdf', params], () => getPrescriptionPDF(params), {
        enabled: false
    });
};

const useGetPrescriptionByPrintcode = params => {
    return useQuery(
        ['getPrescriptionPrintcode', params],
        () => getPrescriptionByPrintcode(params),
        {
            enabled: false
        }
    );
};

const useGetPrescriptionBySamadcode = params => {
    return useQuery(
        ['getPrescriptionBySamadcode', params],
        () => getPrescriptionBySamadcode(params),
        {
            enabled: false
        }
    );
};

const useGetFavoritePrescriptions = params => {
    return useQuery(['getFavoritePrescriptions', params], () => getFavoritePrescriptions(params), {
        enabled: false
    });
};

const usePostFavoritePrescriptions = () => {
    return useMutation(postFavoritePrescriptions);
};

const useDeleteFavoritePrescriptions = () => {
    return useMutation(deleteFavoritePrescriptions);
};

const useSetSalamatData = () => {
    return useMutation(setSalamatData);
};

const useSetTaminData = () => {
    return useMutation(setTaminData);
};

export const useDeliverPrescription = () => useMutation(deliverPrescription);
export const useDeliverPrescriptionInfo = params =>
    useQuery(['deliverPrescriptionInfo', params], () => deliverPrescriptionInfo(params), {
        enabled: false
    });
export const useDeliverPrescriptionPriceInfo = () => useMutation(deliverPrescriptionPriceInfo);

export const useGetPrescriptionReference = () => useMutation(getPrescriptionReference);

export const useGetFrequentItems = params =>
    useQuery(['getFrequentItems', params], () => getFrequentItems(params), {
        enabled: false
    });

export const useGetLatestVersion = params => {
    return useQuery(['getLatestVersion', params], () => getLatestVersion(params));
};

export const useImportRequests = () => useMutation(importRequests);
export const useImportRequestsSalamat = () => useMutation(importRequestsSalamat);
export const useImportCaptchaSalamat = () => useMutation(importCaptchaSalamat);
export const useImportOtpSalamat = () => useMutation(importOtpSalamat);
export const useImportStatus = params => {
    return useQuery(['importStatus', params], () => importStatus(params), { enabled: false });
};

export {
    useGetPrescriptionByPrintcode,
    useGetPrescriptionBySamadcode,
    useAuth,
    useGetMe,
    useGetOnePrescription,
    useGetPrescriptions,
    useAddPrescription,
    useGetTypes,
    useSearch,
    useGetOneService,
    useGetDrugInstructions,
    useGeTDrugAmounts,
    useAddItemService,
    useGetItemServices,
    useFinalizePrescription,
    useDeleteItemService,
    useEditItemService,
    useGetOneItemService,
    useGetTaminParTarefs,
    useDeletePrescription,
    useGetFavoriteServices,
    useAddFavoriteServices,
    useDeleteFavoriteServices,
    useClinicLogin,
    useCheckOtp,
    useGetPrescriptionPDF,
    useGetFavoritePrescriptions,
    usePostFavoritePrescriptions,
    useDeleteFavoritePrescriptions,
    useSetSalamatData,
    useSetTaminData
};
