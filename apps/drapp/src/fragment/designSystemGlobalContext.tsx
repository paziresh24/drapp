import React, { useEffect, useMemo, useState } from 'react';
import { ToastPosition, toast } from 'react-toastify';
import { GlobalActionsProvider } from '@plasmicapp/react-web/lib/host';
import axios from 'axios';
export const Fragment = ({
    children,
    previewApiConfig,
    apiConfig
}: React.PropsWithChildren<{
    previewApiConfig: Record<string, any>;
    apiConfig: Record<string, any>;
}>) => {
    const actions = useMemo(
        () => ({
            showToast: (
                type: 'success' | 'error',
                message: string,
                placement: ToastPosition = 'top-right',
                duration?: number
            ) => {
                toast[type ?? 'success'](message, {
                    autoClose: duration,
                    position: placement
                });
            },
            apiRequest: async (
                method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH',
                url: string,
                params: Record<string, string | string[]> = {},
                body?: Record<string, any>,
                config?: Record<string, any>
            ) => {
                try {
                    let result;
                    if (method === 'GET') {
                        result = await axios.get(url, {
                            params,
                            ...apiConfig,
                            ...previewApiConfig,
                            ...config
                        });
                    }
                    if (method !== 'GET') {
                        result = await axios[
                            method.toLowerCase() as 'post' | 'delete' | 'put' | 'patch'
                        ](url, body, {
                            params,
                            ...apiConfig,
                            ...previewApiConfig,
                            ...config
                        });
                    }
                    return result;
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        return error.response;
                    }
                }
            }
        }),
        []
    );

    return (
        <GlobalActionsProvider contextName="Fragment" actions={actions}>
            {children}
        </GlobalActionsProvider>
    );
};
