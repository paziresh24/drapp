import axios from 'axios';

const isProduction = process.env.NODE_ENV === 'production';

export const nextClient = axios.create({
    withCredentials: true,
    baseURL: `${isProduction ? process.env.NEXT_PUBLIC_BASE_PATH : ''}/api`
});

export const clinicClient = axios.create({
    withCredentials: true,
    baseURL: `${process.env.NEXT_PUBLIC_CLINIC_BASE_URL}/api`
});

export const prescriptionClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_PRESCRIPTION_API
});
