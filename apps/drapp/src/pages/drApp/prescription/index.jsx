// import styles from 'assets/styles/pages/drApp/consult.module.scss';
// import { getToken } from '@paziresh24/utils/localstorage';
// import { useEffect, useRef, useState } from 'react';
// import { Overlay } from '@paziresh24/components/core/overlay';
// import { toast } from 'react-toastify';
// import { useHistory } from 'react-router';
// import { baseURL } from '@paziresh24/utils/baseUrl';
// import { useDrApp } from '@paziresh24/context/drapp';

import Prescriptions from '@paziresh24/apps/prescription/pages/prescription/home';

const Prescription = () => {
    return (
        <Prescriptions />
        // <div className={styles['iframeWrapper']}>
        //     {loading && <Overlay />}
        //     <iframe
        //         src={`${baseURL(
        //             'PRESCRIPTION_IFRAM'
        //         )}?isDoctorApp=1&access_token=${token}&identifier=${info.center.id}${
        //             info.center.local_base_url ? `&baseURL=${info.center.local_base_url}` : ''
        //         }`}
        //         title="Prescription"
        //         ref={iframe}
        //         className={styles['iframe']}
        //         allow="*"
        //     />
        // </div>
    );
};

export default Prescription;
