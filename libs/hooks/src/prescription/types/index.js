import { useMutation, useQuery } from 'react-query';
import { bulkItems } from '@paziresh24/apis/prescription/bulkItems';
import { getBrands } from '@paziresh24/apis/prescription/getBrands';
import { getDefault } from '@paziresh24/apis/prescription/getDefault';
import { updatePrescription } from '@paziresh24/apis/prescription/updatePrescription';
import { diseases } from '@paziresh24/apis/prescription/diseases';

export const useBulkItems = () => {
    return useMutation(bulkItems);
};

export const useGetBrands = params => {
    return useQuery(['brands', params], () => getBrands(params), {
        enabled: false
    });
};

export const useUpdatePrescription = () => {
    return useMutation(updatePrescription);
};

export const useGetDefault = params => {
    return useQuery(['getDefault', params], () => getDefault(params), {
        enabled: false
    });
};

export const useGetDiseases = params => {
    return useQuery(['diseases', params], () => diseases(params), {
        enabled: false
    });
};
