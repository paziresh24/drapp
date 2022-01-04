import { useQuery, useMutation } from 'react-query';
import { getSettings } from '@paziresh24/apis/prescription/settings/getSettings';
import { setSetting } from '@paziresh24/apis/prescription/settings/setSetting';
import { removeSetting } from '@paziresh24/apis/prescription/settings/removeSetting';

export const useGetSettings = params => {
    return useQuery(['getSettings', params], () => getSettings(params), {
        enabled: false
    });
};

export const useSetSetting = () => {
    return useMutation(setSetting);
};

export const useRemoveSetting = () => {
    return useMutation(removeSetting);
};
