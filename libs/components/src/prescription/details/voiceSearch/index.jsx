import { useState, useRef, useEffect } from 'react';
import Modal from '../../../core/modal';
import styles from './voiceSearch.module.scss';
import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';
import { Search } from './../Search';
import { isMobile } from 'react-device-detect';
import { sendEvent } from '@paziresh24/utils';

const VoiceSearch = ({ onChange, type, typeId, insuranceType, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenSearch, setIsOpenSearch] = useState(false);
    const [prescriptionInfo] = useSelectPrescription();
    const spechToTextButtton = useRef();
    const [searchValue, setSearchValue] = useState('');

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = insuranceType === 'salamat' ? 'fa-IR' : type === 'drugs' ? 'en-US' : 'fa-IR';
    recognition.continuous = true;
    recognition.interimResults = true;

    useEffect(() => {
        if (isOpen) {
            recognition.start();
            setSearchValue('');
            sendEvent('voiceSearch', 'prescription', 'voiceSearchClick');
        } else {
            recognition.stop();
        }
    }, [isOpen]);

    recognition.onresult = function (event) {
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            setSearchValue(event.results[i][0].transcript);

            if (event.results[i].isFinal) {
                spechToTextButtton.current.classList.remove(styles.start);
                recognition.stop();
                setIsOpen(false);
                setIsOpenSearch(true);
                sendEvent(
                    'voiceSearch',
                    'prescription',
                    `voiceSearchResult - ${event.results[i][0].transcript}`
                );
            }
        }
    };

    return (
        <>
            <div
                className={`${styles.spechToTextButtton} ${isMobile ? 'ml-[1rem]' : ''}`}
                ref={spechToTextButtton}
                onClick={() => setIsOpen(true)}
                aria-hidden
            >
                <svg
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        opacity="0.4"
                        d="M19.1197 9.11986C18.7297 9.11986 18.4197 9.42986 18.4197 9.81986V11.3999C18.4197 14.9399 15.5397 17.8199 11.9997 17.8199C8.45969 17.8199 5.57969 14.9399 5.57969 11.3999V9.80986C5.57969 9.41986 5.26969 9.10986 4.87969 9.10986C4.48969 9.10986 4.17969 9.41986 4.17969 9.80986V11.3899C4.17969 15.4599 7.30969 18.8099 11.2997 19.1699V21.2999C11.2997 21.6899 11.6097 21.9999 11.9997 21.9999C12.3897 21.9999 12.6997 21.6899 12.6997 21.2999V19.1699C16.6797 18.8199 19.8197 15.4599 19.8197 11.3899V9.80986C19.8097 9.42986 19.4997 9.11986 19.1197 9.11986Z"
                        fill="#1659df"
                    />
                    <path
                        d="M12.0001 2C9.56008 2 7.58008 3.98 7.58008 6.42V11.54C7.58008 13.98 9.56008 15.96 12.0001 15.96C14.4401 15.96 16.4201 13.98 16.4201 11.54V6.42C16.4201 3.98 14.4401 2 12.0001 2ZM13.3101 8.95C13.2401 9.21 13.0101 9.38 12.7501 9.38C12.7001 9.38 12.6501 9.37 12.6001 9.36C12.2101 9.25 11.8001 9.25 11.4101 9.36C11.0901 9.45 10.7801 9.26 10.7001 8.95C10.6101 8.64 10.8001 8.32 11.1101 8.24C11.7001 8.08 12.3201 8.08 12.9101 8.24C13.2101 8.32 13.3901 8.64 13.3101 8.95ZM13.8401 7.01C13.7501 7.25 13.5301 7.39 13.2901 7.39C13.2201 7.39 13.1601 7.38 13.0901 7.36C12.3901 7.1 11.6101 7.1 10.9101 7.36C10.6101 7.47 10.2701 7.31 10.1601 7.01C10.0501 6.71 10.2101 6.37 10.5101 6.27C11.4701 5.92 12.5301 5.92 13.4901 6.27C13.7901 6.38 13.9501 6.71 13.8401 7.01Z"
                        fill="#1659df"
                    />
                </svg>
            </div>
            <Modal noHeader noBodyPadding isOpen={isOpen} onClose={setIsOpen}>
                <div className={styles.speechWrapper}>
                    <div className={styles.recordIcon}>
                        <svg
                            width="49"
                            height="49"
                            viewBox="0 0 49 49"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                opacity="0.4"
                                d="M38.6232 18.6992C37.8432 18.6992 37.2232 19.3192 37.2232 20.0992V23.2592C37.2232 30.3392 31.4632 36.0992 24.3832 36.0992C17.3032 36.0992 11.5432 30.3392 11.5432 23.2592V20.0792C11.5432 19.2992 10.9232 18.6792 10.1432 18.6792C9.36316 18.6792 8.74316 19.2992 8.74316 20.0792V23.2392C8.74316 31.3792 15.0032 38.0792 22.9832 38.7992V43.0592C22.9832 43.8392 23.6032 44.4592 24.3832 44.4592C25.1632 44.4592 25.7832 43.8392 25.7832 43.0592V38.7992C33.7432 38.0992 40.0232 31.3792 40.0232 23.2392V20.0792C40.0032 19.3192 39.3832 18.6992 38.6232 18.6992Z"
                                fill="#1659df"
                            />
                            <path
                                d="M24.3832 4.45923C19.5032 4.45923 15.5432 8.41923 15.5432 13.2992V23.5392C15.5432 28.4192 19.5032 32.3792 24.3832 32.3792C29.2632 32.3792 33.2232 28.4192 33.2232 23.5392V13.2992C33.2232 8.41923 29.2632 4.45923 24.3832 4.45923ZM27.0032 18.3592C26.8632 18.8792 26.4032 19.2192 25.8832 19.2192C25.7832 19.2192 25.6832 19.1992 25.5832 19.1792C24.8032 18.9592 23.9832 18.9592 23.2032 19.1792C22.5632 19.3592 21.9432 18.9792 21.7832 18.3592C21.6032 17.7392 21.9832 17.0992 22.6032 16.9392C23.7832 16.6192 25.0232 16.6192 26.2032 16.9392C26.8032 17.0992 27.1632 17.7392 27.0032 18.3592ZM28.0632 14.4792C27.8832 14.9592 27.4432 15.2392 26.9632 15.2392C26.8232 15.2392 26.7032 15.2192 26.5632 15.1792C25.1632 14.6592 23.6032 14.6592 22.2032 15.1792C21.6032 15.3992 20.9232 15.0792 20.7032 14.4792C20.4832 13.8792 20.8032 13.1992 21.4032 12.9992C23.3232 12.2992 25.4432 12.2992 27.3632 12.9992C27.9632 13.2192 28.2832 13.8792 28.0632 14.4792Z"
                                fill="#1659df"
                            />
                        </svg>
                    </div>
                    {searchValue ? (
                        <span className={styles.recordValue}>{searchValue}</span>
                    ) : (
                        <span className={styles.recordPlaceholder}>درحال شنیدن صدای شما</span>
                    )}
                </div>
                <div className={styles.speechFooter}>
                    <span>
                        این قابلیت به صورت آزمایشی می باشد و شما با گفتن نام{' '}
                        {label.replace('انتخاب ', '')} می توانید آن را جستجو کنید.
                    </span>
                    <span>مثلا بگویید استامینوفن ...</span>
                </div>
            </Modal>
            <Modal noHeader noBodyPadding isOpen={isOpenSearch} onClose={setIsOpenSearch}>
                <div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '2rem',
                            paddingBottom: '3rem',
                            background: '#e2ecf5'
                        }}
                    >
                        <span style={{ fontWeight: 'bold', fontSize: '1.7rem' }}>
                            {searchValue}
                        </span>
                        <span
                            style={{ fontWeight: '500', fontSize: '1.5rem', marginTop: '0.5rem' }}
                        >
                            {label.replace('انتخاب ', '')} موردنظر را انتخاب نمایید
                        </span>
                    </div>
                    <div className={styles.resultWrapper}>
                        <Search
                            isOpen={true}
                            type={type}
                            noSearchBar={true}
                            typeId={typeId}
                            searchValue={searchValue}
                            setSearchValue={setSearchValue}
                            setSelectItem={value => {
                                onChange({ item: value, speechValue: searchValue });
                                setIsOpenSearch(false);
                                sendEvent(
                                    'voiceSearchSuccess',
                                    'prescription',
                                    `voiceSearchSuccess - ${value?.name}`
                                );
                            }}
                            insuranceType={insuranceType}
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default VoiceSearch;
