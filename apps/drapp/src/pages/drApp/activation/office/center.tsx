import {
    Alert,
    BaseTextFieldProps,
    Container,
    InputAdornment,
    Skeleton,
    TextField,
    TextFieldProps,
    Typography
} from '@mui/material';
import Button from '@mui/lab/LoadingButton';
import { useDrApp } from '@paziresh24/context/drapp';
import { useCenterInfoUpdate, useDoctorInfoUpdate } from '@paziresh24/hooks/drapp/profile';
import { EditIcon, PhoneIcon } from '@paziresh24/shared/icon';
import Map from '@paziresh24/shared/ui/map';
import Modal from '@paziresh24/shared/ui/modal';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useActivationStore } from '../activation.store';
import { useGetReverseGeocoding } from '@paziresh24/hooks/drapp/geocoding';
import { iranCityWithPrefixPhoneNumber } from 'apps/drapp/src/constants/iranCityWithPrefixPhoneNumber';

const CenterOfficeActivation = () => {
    const [{ doctor, center }] = useDrApp();
    const centerUpdate = useCenterInfoUpdate();
    const doctorInfoUpdate = useDoctorInfoUpdate();
    const router = useHistory();
    const [{ lat, lng }, setLatLng] = useState({
        lat: 35.70069003610754,
        lng: 51.35918498039246
    });
    const getReverseGeocoding = useGetReverseGeocoding({
        lat,
        long: lng
    });
    const [officePhoneNumber, setOfficePhoneNumber] = useState('');
    const [secretaryPhoneNumber, setSecretaryPhoneNumber] = useState('');
    const [centerInfoModal, setCenterInfoModal] = useState(false);
    const [addressEditModal, setAddressEditModal] = useState(false);
    const setSelectedService = useActivationStore(state => state.setSelectedService);
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');

    useEffect(() => {
        setSelectedService(prev => prev.filter(service => service !== 'office'));
    }, []);

    useEffect(() => {
        getReverseGeocoding.refetch();
    }, [lat, lng]);

    useEffect(() => {
        setAddress((getReverseGeocoding.data as any)?.formatted_address);
        const cityFormatted = (getReverseGeocoding.data as any)?.state
            .split(' ')
            .filter((_: any, i: number) => i !== 0)
            .join(' ');
        setCity(cityFormatted);
        if (officePhoneNumber.length <= 3) {
            setOfficePhoneNumber(
                iranCityWithPrefixPhoneNumber.find(city => city.name === cityFormatted)?.code ?? ''
            );
        }
    }, [getReverseGeocoding.data]);

    const handleSubmit = async () => {
        try {
            await centerUpdate.mutateAsync({
                centerId: center.id,
                data: {
                    address,
                    ...(officePhoneNumber && { tell: officePhoneNumber }),
                    lat: lat,
                    lon: lng
                }
            });
            if (secretaryPhoneNumber)
                await doctorInfoUpdate.mutateAsync({
                    name: doctor.name,
                    family: doctor.family,
                    medical_code: doctor.medical_code,
                    secretary_phone: secretaryPhoneNumber
                });
            router.push('/activation/office/duration');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message);
            }
        }
    };

    return (
        <Container
            maxWidth="sm"
            className="h-full md:h-[35rem] rounded-md !p-0 md:!p-1 bg-white md:mt-8 md:shadow-2xl md:shadow-slate-300 !flex flex-col items-center relative"
        >
            <div className="bg-white absolute top-4 z-[900] h-10 px-8 rounded-full flex items-center justify-center shadow-xl space-s-2">
                {(getReverseGeocoding.isLoading || getReverseGeocoding.isIdle) && (
                    <Skeleton width={60} />
                )}

                {getReverseGeocoding.isSuccess && (
                    <>
                        <svg
                            width="17"
                            height="17"
                            viewBox="0 0 17 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M5.35666 4.86527C5.35666 3.97752 5.35666 3.53365 5.16993 3.27267C5.00699 3.04493 4.75601 2.89594 4.47806 2.86195C4.15953 2.82299 3.76985 3.03554 2.9905 3.46064L1.74752 4.13863C1.50657 4.27006 1.35666 4.52259 1.35666 4.79705V14.6152C1.35666 14.8799 1.49619 15.125 1.72381 15.2602C1.95143 15.3953 2.23342 15.4004 2.4658 15.2737L4.52282 14.1516C4.82616 13.9862 4.97783 13.9035 5.08834 13.7848C5.18609 13.6799 5.26014 13.5552 5.30544 13.4191C5.35666 13.2653 5.35666 13.0925 5.35666 12.747L5.35666 4.86527ZM6.85666 12.9548C6.85666 13.0984 6.85666 13.1703 6.86562 13.2367C6.90187 13.5058 7.046 13.7486 7.26487 13.9093C7.31893 13.949 7.38199 13.9834 7.50809 14.0522C7.83072 14.2281 7.99203 14.3161 8.11839 14.3471C8.64789 14.477 9.18386 14.1589 9.32337 13.6318C9.35666 13.506 9.35666 13.3223 9.35666 12.9548L9.35666 4.27569C9.35666 4.13204 9.35666 4.06021 9.3477 3.99375C9.31145 3.72465 9.16732 3.48187 8.94845 3.32119C8.89439 3.2815 8.83133 3.2471 8.70522 3.17832C8.3826 3.00234 8.22129 2.91435 8.09492 2.88335C7.56543 2.75345 7.02946 3.07162 6.88995 3.59866C6.85666 3.72444 6.85666 3.90819 6.85666 4.27569L6.85666 12.9548ZM14.8567 2.61523C14.8567 2.35053 14.7171 2.10543 14.4895 1.97031C14.2619 1.83519 13.9799 1.83006 13.7475 1.95681L11.6905 3.07883C11.3872 3.24428 11.2355 3.32701 11.125 3.44563C11.0272 3.55056 10.9532 3.67529 10.9079 3.81135C10.8567 3.96516 10.8567 4.13793 10.8567 4.48346L10.8567 12.3652C10.8567 13.2529 10.8567 13.6968 11.0434 13.9578C11.2063 14.1855 11.4573 14.3345 11.7353 14.3685C12.0538 14.4075 12.4435 14.1949 13.2228 13.7698L14.4658 13.0918C14.7067 12.9604 14.8567 12.7079 14.8567 12.4334V2.61523Z"
                                fill="#464C52"
                                fillOpacity="0.95"
                            />
                        </svg>

                        <span className="font-medium">{city}</span>
                    </>
                )}
            </div>
            <Map lat={lat} lng={lng} zoom={1} sendPosition={setLatLng} />
            <div className="bg-white flex flex-col space-y-3 p-4 w-full">
                <span className="font-medium">محل مطب خود را از روی نقشه انتخاب کنید.</span>
                {(getReverseGeocoding.isLoading || getReverseGeocoding.isIdle) && (
                    <div
                        className="h-16 bg-disabled animate-pulse rounded-md flex items-center px-3 space-s-3"
                        onClick={() => setAddressEditModal(true)}
                    />
                )}
                {getReverseGeocoding.isSuccess && (
                    <div
                        className="h-16 bg-disabled bg-opacity-50 rounded-md flex items-center px-3 space-s-3"
                        onClick={() => setAddressEditModal(true)}
                    >
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="min-w-[22px]"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M17.1593 4.90346C17.6361 4.47008 18.3642 4.47009 18.8409 4.90349C18.8596 4.92048 18.884 4.94459 18.9698 5.03033C19.0555 5.11606 19.0796 5.14047 19.0966 5.15917C19.53 5.63593 19.53 6.36399 19.0966 6.84075C19.0796 6.85945 19.0555 6.88385 18.9697 6.96959L18.1627 7.77665C17.0865 7.80091 16.1991 6.91356 16.2233 5.83742L17.0305 5.0303C17.1162 4.94456 17.1406 4.92046 17.1593 4.90346ZM14.9524 7.10832L7.09722 14.9634C6.29045 15.7702 5.98987 16.0796 5.78372 16.4437C5.57758 16.8078 5.46691 17.2247 5.19019 18.3316L5.03079 18.9692L5.6684 18.8098C6.77527 18.5331 7.1922 18.4224 7.55629 18.2163C7.92038 18.0101 8.22978 17.7095 9.03654 16.9028L16.8917 9.04759C16.0064 8.70195 15.2981 7.99364 14.9524 7.10832ZM19.8499 3.79356C18.801 2.84007 17.1993 2.84005 16.1504 3.79351C16.1016 3.83787 16.0497 3.88972 15.9824 3.95705L15.9698 3.96963L6.03657 13.9028L5.96302 13.9763C5.25466 14.6844 4.79718 15.1417 4.47843 15.7047C4.15967 16.2676 4.00291 16.8952 3.76019 17.8669L3.73498 17.9678L3.27241 19.8181C3.20851 20.0737 3.2834 20.344 3.46969 20.5303C3.65597 20.7166 3.92634 20.7915 4.18192 20.7276L6.03221 20.265L6.1331 20.2398C7.1048 19.9971 7.73236 19.8403 8.29534 19.5216C8.85831 19.2028 9.31561 18.7453 10.0237 18.037L10.0972 17.9635L20.0304 8.03025L20.043 8.01763C20.1103 7.95033 20.1622 7.8985 20.2065 7.84971C21.16 6.80085 21.16 5.19912 20.2066 4.15023C20.1622 4.10145 20.1104 4.04963 20.0431 3.98235L20.043 3.98228L20.0305 3.96969L20.0179 3.95713L20.0179 3.95709C19.9506 3.88977 19.8987 3.83792 19.8499 3.79356Z"
                                fill="#000"
                            />
                        </svg>

                        <span className="text-sm text-gray-600 font-medium line-clamp-2">
                            {address}
                        </span>
                    </div>
                )}
                <Button
                    variant="contained"
                    onClick={() => {
                        setCenterInfoModal(true);
                    }}
                >
                    انجام شد
                </Button>
            </div>

            <Modal title="اطلاعات تماس مطب" isOpen={centerInfoModal} onClose={setCenterInfoModal}>
                <TextField
                    label="شماره تلفن مطب"
                    variant="outlined"
                    inputProps={{
                        inputMode: 'tel',
                        style: { textAlign: 'left', direction: 'ltr' }
                    }}
                    inputRef={input => input && input.focus()}
                    placeholder="02123456789"
                    onChange={e => setOfficePhoneNumber(e.target.value)}
                    value={officePhoneNumber}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="start">
                                <svg
                                    width="21"
                                    height="21"
                                    viewBox="0 0 21 21"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M6.97266 10.0735L5.86662 10.9982C6.92182 12.8712 8.40715 14.3566 10.2802 15.4118L11.2049 14.3057L11.2246 14.2821L11.2246 14.2821C11.5317 13.9147 11.7924 13.6028 12.0319 13.3623C12.286 13.107 12.5527 12.8933 12.8882 12.7477C13.0474 12.6787 13.2127 12.6249 13.382 12.587C13.739 12.5071 14.0803 12.5228 14.436 12.5796C14.7712 12.6331 15.1656 12.7317 15.6301 12.8478L15.66 12.8553L16.8388 13.15L16.8506 13.1529L16.8507 13.153L16.8509 13.153L16.8509 13.153C16.9154 13.1691 16.9656 13.1817 17.0121 13.1951C18.1561 13.5241 18.9586 14.5518 19.0003 15.7415C19.002 15.79 19.002 15.8417 19.002 15.9083V15.9085V15.9205C19.002 15.9603 19.0019 15.9893 18.9993 16.0486C18.9661 16.8017 18.5858 17.4717 18.0742 17.9358C17.5813 18.3829 16.9104 18.6901 16.1889 18.6764L16.1733 18.6773L16.1552 18.6774L16.1394 18.6772L16.1236 18.6767L16.1084 18.6759L16.0968 18.675L16.0893 18.6744L16.0864 18.6741L16.0813 18.6736L16.0763 18.6732C13.8633 18.4572 11.8684 17.9041 10.1285 17.0299C7.5427 15.7306 5.54776 13.7357 4.24851 11.1499C3.37432 9.41002 2.82113 7.41506 2.60521 5.20205L2.60473 5.19706L2.60424 5.19195L2.60397 5.18903L2.60333 5.18154L2.60249 5.16994L2.60167 5.1548L2.60113 5.13896C2.60101 5.13235 2.60095 5.11542 2.60111 5.1051L2.60202 5.08947C2.58825 4.36801 2.89544 3.69705 3.34253 3.20421C3.80672 2.69253 4.47664 2.3123 5.22981 2.27905C5.2891 2.27643 5.31806 2.27637 5.35783 2.27637L5.36992 2.27637C5.43659 2.27636 5.48837 2.27636 5.53689 2.27806C6.72655 2.3198 7.75428 3.12224 8.08331 4.26625C8.09674 4.31291 8.10929 4.36315 8.12546 4.42783L8.12838 4.43955L8.4231 5.61841L8.43056 5.64825L8.43056 5.64826C8.54672 6.11282 8.64531 6.50717 8.6988 6.84238C8.75556 7.19807 8.77129 7.53941 8.6914 7.89637C8.65351 8.06566 8.59968 8.23098 8.53065 8.39013C8.38507 8.72571 8.17139 8.99237 7.91611 9.24647C7.67553 9.48593 7.36366 9.74665 6.99627 10.0538L6.99626 10.0538L6.97266 10.0735ZM16.3462 18.6429L16.3287 18.6479C16.4609 18.5649 16.6987 18.2354 16.7442 17.8513C16.7871 17.8387 16.8296 17.8245 16.8716 17.8089C16.8769 17.8501 16.8814 17.9001 16.8821 17.9302C16.8804 17.9743 16.8694 18.0614 16.8601 18.1042C16.8489 18.1448 16.8205 18.2218 16.8037 18.2579C16.7866 18.2904 16.7494 18.35 16.7298 18.3772C16.7112 18.4007 16.6733 18.4433 16.6543 18.4624C16.6369 18.4788 16.6025 18.5082 16.5857 18.5214C16.5705 18.5326 16.541 18.5528 16.5268 18.5619C16.5139 18.5697 16.4891 18.5837 16.4771 18.59C16.4476 18.6053 16.4213 18.6165 16.4007 18.6244C16.3798 18.6324 16.3612 18.6384 16.3462 18.6429ZM3.42706 4.5341C3.04299 4.57961 2.71344 4.81749 2.6305 4.9497L2.63546 4.93226C2.63994 4.91719 2.64597 4.89866 2.65399 4.87775C2.66189 4.85714 2.673 4.83087 2.68829 4.80135C2.6946 4.78942 2.70866 4.76458 2.71643 4.75172C2.72547 4.73747 2.74568 4.70795 2.75692 4.69276C2.77004 4.67597 2.79944 4.64163 2.81579 4.62421C2.83488 4.60522 2.87745 4.56736 2.90101 4.54873C2.92815 4.52909 2.9877 4.49196 3.02015 4.47481C3.0563 4.45801 3.13321 4.4296 3.17382 4.41832C3.21664 4.40902 3.30376 4.39799 3.34777 4.39632C3.37802 4.39694 3.42817 4.40147 3.4695 4.4068C3.45389 4.4488 3.43972 4.49126 3.42706 4.5341ZM11.6687 6.35988C11.6687 5.94567 12.0045 5.60988 12.4187 5.60988C13.3248 5.60988 14.1119 6.17144 14.6329 6.72811C14.9267 7.04199 15.1761 7.39544 15.3557 7.74482C15.5277 8.07946 15.6687 8.47473 15.6687 8.85988C15.6687 9.27409 15.3329 9.60988 14.9187 9.60988C14.5045 9.60988 14.1687 9.27409 14.1687 8.85988C14.1687 8.81312 14.1419 8.66455 14.0215 8.43043C13.9088 8.21105 13.7416 7.97084 13.5378 7.75315C13.134 7.32178 12.7168 7.10988 12.4187 7.10988C12.0045 7.10988 11.6687 6.77409 11.6687 6.35988ZM12.4187 3.10988C12.0045 3.10988 11.6687 3.44567 11.6687 3.85988C11.6687 4.27409 12.0045 4.60988 12.4187 4.60988C14.7659 4.60988 16.6687 6.51267 16.6687 8.85988C16.6687 9.27409 17.0045 9.60988 17.4187 9.60988C17.8329 9.60988 18.1687 9.27409 18.1687 8.85988C18.1687 5.68424 15.5943 3.10988 12.4187 3.10988Z"
                                        fill="#3C3C3D"
                                    />
                                </svg>
                            </InputAdornment>
                        )
                    }}
                />
                <TextField
                    label="شماره موبایل منشی"
                    variant="outlined"
                    inputProps={{
                        inputMode: 'tel',
                        style: { textAlign: 'left', direction: 'ltr' }
                    }}
                    placeholder="09123456789"
                    onChange={e => setSecretaryPhoneNumber(e.target.value)}
                    value={secretaryPhoneNumber}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="start">
                                <svg
                                    width="25"
                                    height="25"
                                    viewBox="0 0 25 25"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M5.75204 9.20606C5.75204 6.39713 5.75204 4.99267 6.42617 3.98377C6.718 3.54701 7.093 3.17201 7.52976 2.88018C8.53866 2.20605 9.94312 2.20605 12.752 2.20605C15.561 2.20605 16.9654 2.20605 17.9743 2.88018C18.4111 3.17201 18.7861 3.54701 19.0779 3.98377C19.752 4.99267 19.752 6.39713 19.752 9.20605V15.2061C19.752 18.015 19.752 19.4194 19.0779 20.4283C18.7861 20.8651 18.4111 21.2401 17.9743 21.5319C16.9654 22.2061 15.561 22.2061 12.752 22.2061C9.94312 22.2061 8.53866 22.2061 7.52976 21.5319C7.093 21.2401 6.718 20.8651 6.42617 20.4283C5.75204 19.4194 5.75204 18.015 5.75204 15.2061V9.20606ZM10.002 19.2061C10.002 18.7918 10.3378 18.4561 10.752 18.4561H14.752C15.1663 18.4561 15.502 18.7918 15.502 19.2061C15.502 19.6203 15.1663 19.9561 14.752 19.9561H10.752C10.3378 19.9561 10.002 19.6203 10.002 19.2061ZM12.752 6.20605C13.3043 6.20605 13.752 5.75834 13.752 5.20605C13.752 4.65377 13.3043 4.20605 12.752 4.20605C12.1998 4.20605 11.752 4.65377 11.752 5.20605C11.752 5.75834 12.1998 6.20605 12.752 6.20605Z"
                                        fill="#3C3C3D"
                                    />
                                </svg>
                            </InputAdornment>
                        )
                    }}
                />
                <Alert icon={false} className="!bg-[#F3F6F9]">
                    <Typography fontSize="0.9rem" fontWeight="medium">
                        لطفا برای اطلاع رسانی نوبت های مطب شماره موبایل منشی خود را وارد نمایید.
                    </Typography>
                </Alert>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    loading={centerUpdate.isLoading || doctorInfoUpdate.isLoading}
                >
                    ذخیره
                </Button>
            </Modal>
            <Modal title="ویرایش آدرس" isOpen={addressEditModal} onClose={setAddressEditModal}>
                <TextField multiline value={address} onChange={e => setAddress(e.target.value)} />
                <Button variant="contained" onClick={() => setAddressEditModal(false)}>
                    تایید
                </Button>
            </Modal>
        </Container>
    );
};

export default CenterOfficeActivation;
