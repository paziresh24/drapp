import { useMutation, useQuery } from 'react-query';
import { getLatestVersion } from '@paziresh24/apis/core/getLatestVersion';
import { googleSheet } from '@paziresh24/apis/core/googleSheet';
import { sendMessageTelegram } from '@paziresh24/apis/core/sendMessageTelegram';
import { shortLink } from '@paziresh24/apis/drApp/shortLink';

const useGetLatestVersion = params => {
    return useQuery(['getLatestVersion', params], () => getLatestVersion(params));
};

const useGoogleSheet = () => {
    return useMutation(googleSheet);
};

const useSendMessageTelegram = () => {
    return useMutation(sendMessageTelegram);
};

const useShortLink = () => {
    return useMutation(shortLink);
};

export { useGetLatestVersion, useGoogleSheet, useSendMessageTelegram, useShortLink };
