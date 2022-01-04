import styles from './ImportStatus.module.scss';
import ReactTooltip from 'react-tooltip';
import classNames from 'classnames';
import { useRef, useState, useEffect } from 'react';
import {
    useImportStatus,
    useGetFavoriteServices,
    useGetFavoritePrescriptions
} from '@paziresh24/hooks/prescription';
import Import from '../Import';
import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';
import SalamatImport from '../Import/salamat';

const ImportStatus = ({ type }) => {
    const [prescriptionInfo] = useSelectPrescription();
    const importStatus = useImportStatus({
        provider: prescriptionInfo?.insuranceType,
        _sort: 'created_at:DESC'
    });
    const [statusImport, setStatusImport] = useState();
    let importInterval = useRef(null);
    const [isOpenImportModal, setIsOpenImportModal] = useState(false);
    const getFavoriteServices = useGetFavoriteServices({
        provider: prescriptionInfo?.insuranceType
    });

    const getFavoritePrescriptions = useGetFavoritePrescriptions({
        [prescriptionInfo.insuranceType + 'Items_null']: false
    });

    useEffect(() => {
        importStatus.refetch();
    }, []);

    useEffect(() => {
        return () => {
            clearInterval(importInterval.current);
            importInterval.current = null;
        };
    }, []);

    useEffect(() => {
        if (importStatus.isSuccess) {
            const status = importStatus.data.filter(item => item.type === type)?.[0]?.status;
            setStatusImport(status);

            if (status === 'SUCCESS' && importInterval.current !== null) {
                getFavoriteServices.refetch();
                getFavoritePrescriptions.refetch();
                importStatus.remove();
            }

            if (status === 'SUBMITTED') {
                if (importInterval.current === null) {
                    importInterval.current = setInterval(() => {
                        importStatus.remove();
                        importStatus.refetch();
                    }, 1500);
                }
            } else {
                clearInterval(importInterval.current);
                importInterval.current = null;
            }
        }
    }, [importStatus.status]);
    return (
        <>
            <div
                className={classNames({
                    [styles.importButton]: true,
                    [styles.failedImport]: statusImport === 'FAILED',
                    [styles.successImport]: statusImport === 'SUCCESS',
                    [styles.loadingImport]: statusImport === 'SUBMITTED'
                })}
                onClick={() => setIsOpenImportModal(true)}
                aria-hidden
                data-tip
                data-for="importStatus"
            >
                {statusImport === 'FAILED' && (
                    <ReactTooltip id="importStatus" place="top" type="dark" effect="solid">
                        {importStatus.isSuccess &&
                            importStatus.data.filter(item => item.type === type)?.[0]
                                ?.error_message}
                    </ReactTooltip>
                )}
                {statusImport === 'SUCCESS' && (
                    <ReactTooltip id="importStatus" place="top" type="dark" effect="solid">
                        {type === 'favorite_service' &&
                            'انتقال سرویس های مورد علاقه شما با موفقیت انجام شد'}
                        {type === 'favorite_prescription' &&
                            'انتقال نسخه های پراستفاده شما با موفقیت انجام شد'}
                    </ReactTooltip>
                )}
                {statusImport === 'FAILED' && (
                    <svg
                        width="3"
                        height="13"
                        viewBox="0 0 4 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle cx="1.89506" cy="12.594" r="1.4019" fill="white" />
                        <path
                            d="M1.89502 8.3884V1.37891"
                            stroke="white"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                )}
                {statusImport === 'SUBMITTED' && (
                    <svg width="15" height="15" viewBox="0 0 38 38" stroke="#3f3f79">
                        <g fill="none" fillRule="evenodd">
                            <g transform="translate(1 1)" strokeWidth="3">
                                <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
                                <path d="M36 18c0-9.94-8.06-18-18-18">
                                    <animateTransform
                                        attributeName="transform"
                                        type="rotate"
                                        from="0 18 18"
                                        to="360 18 18"
                                        dur="1s"
                                        repeatCount="indefinite"
                                    />
                                </path>
                            </g>
                        </g>
                    </svg>
                )}
                {statusImport === 'SUCCESS' && (
                    <svg
                        width="13"
                        height="12"
                        viewBox="0 0 15 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={styles.successIcon}
                    >
                        <path
                            d="M5.08205 10.6231C4.80036 10.6231 4.53277 10.5104 4.33559 10.3133L0.349786 6.32745C-0.0586527 5.91901 -0.0586527 5.24297 0.349786 4.83454C0.758225 4.4261 1.43426 4.4261 1.8427 4.83454L5.08205 8.07388L12.3213 0.83465C12.7297 0.426211 13.4058 0.426211 13.8142 0.83465C14.2226 1.24309 14.2226 1.91912 13.8142 2.32756L5.8285 10.3133C5.63133 10.5104 5.36373 10.6231 5.08205 10.6231Z"
                            fill="white"
                        />
                    </svg>
                )}

                {statusImport !== 'SUBMITTED' && statusImport !== 'FAILED' && (
                    <svg
                        width="23"
                        height="20"
                        viewBox="0 0 25 23"
                        className={styles.importIcon}
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M12.0704 14.3705C11.8963 14.3705 11.7221 14.3063 11.5846 14.1688L9.23795 11.8222C8.97212 11.5563 8.97212 11.1163 9.23795 10.8505C9.50378 10.5847 9.94378 10.5847 10.2096 10.8505L12.0704 12.7113L13.9313 10.8505C14.1971 10.5847 14.6371 10.5847 14.9029 10.8505C15.1688 11.1163 15.1688 11.5563 14.9029 11.8222L12.5563 14.1688C12.4188 14.3063 12.2446 14.3705 12.0704 14.3705Z"
                            fill="white"
                        />
                        <path
                            d="M12.0708 14.3064C11.695 14.3064 11.3833 13.9947 11.3833 13.6189V4.29639C11.3833 3.92055 11.695 3.60889 12.0708 3.60889C12.4466 3.60889 12.7583 3.92055 12.7583 4.29639V13.6189C12.7583 13.9947 12.4466 14.3064 12.0708 14.3064Z"
                            fill="white"
                        />
                        <path
                            d="M12.1805 19.8155C7.45967 19.8155 4.15967 16.5155 4.15967 11.7947C4.15967 11.4188 4.47133 11.1072 4.84717 11.1072C5.223 11.1072 5.53467 11.4188 5.53467 11.7947C5.53467 15.7088 8.26633 18.4405 12.1805 18.4405C16.0947 18.4405 18.8263 15.7088 18.8263 11.7947C18.8263 11.4188 19.138 11.1072 19.5138 11.1072C19.8897 11.1072 20.2013 11.4188 20.2013 11.7947C20.2013 16.5155 16.9013 19.8155 12.1805 19.8155Z"
                            fill="white"
                        />
                    </svg>
                )}
            </div>
            {prescriptionInfo.insuranceType === 'salamat' && (
                <SalamatImport isOpen={isOpenImportModal} onClose={setIsOpenImportModal} />
            )}
            {prescriptionInfo.insuranceType === 'tamin' && (
                <Import isOpen={isOpenImportModal} onClose={setIsOpenImportModal} />
            )}
        </>
    );
};

export default ImportStatus;
