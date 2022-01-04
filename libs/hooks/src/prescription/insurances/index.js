import { insurances } from '@paziresh24/apis/prescription/auth/insurances';
import { useQuery, useMutation } from 'react-query';
import { createSalamatDoctor } from '@paziresh24/apis/prescription/auth/createSalamatDoctor';
import { createTaminDoctor } from '@paziresh24/apis/prescription/auth/createTaminDoctor';
import { updateSalamatDoctor } from '@paziresh24/apis/prescription/auth/updateSalamatDoctor';
import { updateTaminDoctor } from '@paziresh24/apis/prescription/auth/updateTaminDoctor';

export const useInsurances = params => {
    return useQuery(['insurances', params], () => insurances(params), {
        enabled: false
    });
};

export const useCreateSalamatDoctor = () => {
    return useMutation(createSalamatDoctor);
};

export const useCreateTaminDoctor = () => {
    return useMutation(createTaminDoctor);
};

export const useUpdateSalamatDoctor = () => {
    return useMutation(updateSalamatDoctor);
};

export const useUpdateTaminDoctor = () => {
    return useMutation(updateTaminDoctor);
};
