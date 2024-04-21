import React, { useMemo } from 'react';
import { GlobalActionsProvider } from '@plasmicapp/host';
import { ToastPosition, toast } from 'react-toastify';

export const Fragment = ({ children }: React.PropsWithChildren) => {
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
