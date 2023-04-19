import { useQuery, useMutation } from 'react-query';
import { feedbacks } from '@paziresh24/apis/drApp/profile/feedbacks';
import { complaintsSummary } from '@paziresh24/apis/drApp/profile/complaints';
import { complaintsDetail } from '@paziresh24/apis/drApp/profile/complaints/details';
import { centerInfo } from '@paziresh24/apis/drApp/profile/centerInfo';
import { doctorInfo } from '@paziresh24/apis/drApp/profile/doctorInfo';
import { doctorInfoUpdate } from '@paziresh24/apis/drApp/profile/doctorInfoUpdate';
import { centerInfoUpdate } from '@paziresh24/apis/drApp/profile/centerInfoUpdate';
import { updateCenterAccess } from '@paziresh24/apis/drApp/profile/updateCenterAccess';
import { centerAccess } from '@paziresh24/apis/drApp/profile/centerAccess';
import { likeFeedbacks } from '@paziresh24/apis/drApp/profile/feedbacks/like';
import { replyFeedbacks } from '@paziresh24/apis/drApp/profile/feedbacks/reply';
import { unLikeFeedbacks } from '@paziresh24/apis/drApp/profile/feedbacks/unLike';
import { getExpertises } from '@paziresh24/apis/drApp/profile/expertises/getExpertises';
import { createExpertise } from '@paziresh24/apis/drApp/profile/expertises/createExpertises';
import { updateExpertise } from '@paziresh24/apis/drApp/profile/expertises/updateExpertise';
import { deleteExpertises } from '@paziresh24/apis/drApp/profile/expertises/deleteExpertises';
import { uploadPorfile } from '@paziresh24/apis/drApp/profile/uploadPorfile';
import { uploadGallery } from '@paziresh24/apis/drApp/profile/gallery/upload';
import { getGallery } from '@paziresh24/apis/drApp/profile/gallery/get';
import { deleteGallery } from '@paziresh24/apis/drApp/profile/gallery/delete';
import { bankInfo } from '@paziresh24/apis/drApp/profile/bank/update';
import { getBankInfo } from '@paziresh24/apis/drApp/profile/bank/get';
import { getWhatsapp } from '@paziresh24/apis/drApp/profile/whatsapp/get';
import { updateWhatsapp } from '@paziresh24/apis/drApp/profile/whatsapp/update';
import { getMessengerInfo } from '@paziresh24/apis/drApp/profile/messengers/get';
import { updateMessengers } from '@paziresh24/apis/drApp/profile/messengers/update';

const useGetFeedbacks = param => {
    return useQuery(['feedbacks', param], () => feedbacks(param));
};

const useGetCenterInfo = () => {
    return useQuery('centerInfo', centerInfo, {
        enabled: false
    });
};

const useComplaintsDetail = () => {
    return useQuery('complaintsDetail', complaintsDetail);
};

const useComplaintsSummary = () => {
    return useQuery('complaintsSummary', complaintsSummary);
};

const useGetDoctorInfo = params => {
    return useQuery(['doctorInfo', params], () => doctorInfo(params), {
        enabled: false
    });
};

const useDoctorInfoUpdate = () => {
    return useMutation(doctorInfoUpdate);
};

const useCenterInfoUpdate = () => {
    return useMutation(centerInfoUpdate);
};

const useUpdateCenterAccess = () => {
    return useMutation(updateCenterAccess);
};

const useGetCenterAccess = params => {
    return useQuery(['getCenterAccess', params], () => centerAccess(params), {
        enabled: false
    });
};

const useLikeFeedbacks = () => {
    return useMutation(likeFeedbacks);
};

const useReplyFeedbacks = () => {
    return useMutation(replyFeedbacks);
};

const useUnLikeFeedbacks = () => {
    return useMutation(unLikeFeedbacks);
};

const useGetExpertises = params => {
    return useQuery(['getExpertises', params], () => getExpertises(params), {
        enabled: false
    });
};

const useCreateExpertise = () => {
    return useMutation(createExpertise);
};

const useUpdateExpertise = () => {
    return useMutation(updateExpertise);
};

const useDeleteExpertises = () => {
    return useMutation(deleteExpertises);
};

const useUploadPorfile = () => {
    return useMutation(uploadPorfile);
};

const useUploadGallery = () => {
    return useMutation(uploadGallery);
};

const useGetGallery = params => {
    return useQuery(['getGallery', params], () => getGallery(params), {
        enabled: false
    });
};

const useDeleteGallery = () => {
    return useMutation(deleteGallery);
};

const useBankInfo = () => {
    return useMutation(bankInfo);
};

const useGetBankInfo = params => {
    return useQuery(['getBankInfo', params], () => getBankInfo(params));
};

const useGetWhatsApp = params => {
    return useQuery(['getWhatsapp', params], () => getWhatsapp(params));
};

const useUpdateWhatsapp = params => {
    return useMutation(updateWhatsapp);
};

const useGetMessengerInfo = () => {
    return useQuery('getMessengerInfo', getMessengerInfo);
};

const useUpdateMessengers = () => {
    return useMutation(updateMessengers);
};

export {
    useGetFeedbacks,
    useGetCenterInfo,
    useGetDoctorInfo,
    useDoctorInfoUpdate,
    useCenterInfoUpdate,
    useUpdateCenterAccess,
    useGetCenterAccess,
    useLikeFeedbacks,
    useReplyFeedbacks,
    useUnLikeFeedbacks,
    useGetExpertises,
    useCreateExpertise,
    useUpdateExpertise,
    useDeleteExpertises,
    useUploadPorfile,
    useUploadGallery,
    useGetGallery,
    useDeleteGallery,
    useBankInfo,
    useGetBankInfo,
    useComplaintsSummary,
    useComplaintsDetail,
    useGetWhatsApp,
    useUpdateWhatsapp,
    useGetMessengerInfo,
    useUpdateMessengers
};
