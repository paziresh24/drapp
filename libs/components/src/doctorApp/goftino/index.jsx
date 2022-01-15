import { useEffect } from 'react';
import { useState } from 'react';
import styles from './goftino.module.scss';
import { openGoftino, closeGoftino } from '@paziresh24/utils/services/goftino';
import { useGetUserGoftino, useSetUserGoftino } from '@paziresh24/hooks/drapp/goftino';
import { isDesktop, isMobile } from 'react-device-detect';
import { useSupport } from '@paziresh24/context/core/supportChat';
import Modal from '../../core/modal';
import QRCode from 'qrcode.react';
import Button from '../../core/button';

import chatSupport from '@paziresh24/assets/videos/drapp/chatSupport.gif';
import { useShortLink } from '@paziresh24/hooks/core';
import { Overlay } from '../../core/overlay';
import { toast } from 'react-toastify';

const Goftino = ({ openState = false, smsSupport = true }) => {
    const [isOpen, setIsOpen] = useSupport(openState);
    // const getUserGoftino = useGetUserGoftino();
    const setUserGoftino = useSetUserGoftino();
    const shortLink = useShortLink();

    // useEffect(() => {
    //     getUserGoftino.refetch();
    // }, []);

    // useEffect(() => {
    //     if (getUserGoftino.isSuccess)
    //         ChatSupport.setUserId(getUserGoftino.data.data, setUserGoftino.mutate);
    // }, [getUserGoftino.status]);

    useEffect(() => {
        if (isOpen) {
            window.location.host !== window._env_.P24_MAIN_DOMAIN &&
                smsSupport &&
                shortLink.mutate();
            (window.location.host === window._env_.P24_MAIN_DOMAIN ||
                window.location.hostname === 'localhost') &&
                openGoftino();
            isDesktop && document.body.classList.add(styles['open-chat']);
        } else {
            document.body.classList.remove(styles['open-chat']);
        }
    }, [isOpen]);

    const close = () => {
        closeGoftino();
        setIsOpen(false);
    };

    const sendMessage = () => {
        shortLink.mutate(
            {
                sendSms: true
            },
            {
                onSuccess: () => {
                    toast.success('لینک پشتیبانی اختصاصی، برای شما پیامک شد.');
                }
            }
        );
    };

    return (
        <>
            <div className={styles['root']}>
                <div
                    className={`${styles['mask']} ${isOpen && styles['show']}`}
                    onClick={close}
                    aria-hidden
                />
            </div>
            {window.location.host !== window._env_.P24_MAIN_DOMAIN &&
                window.location.hostname !== 'localhost' &&
                smsSupport && (
                    <Modal
                        title="گفتگو با پشتیبان"
                        isOpen={isOpen}
                        onClose={setIsOpen}
                        maxWidth={!isMobile && '90rem'}
                        // noBodyPad
                        // noHeader
                        // fullPage
                    >
                        <div className={styles.flexWrap}>
                            <div className={styles.barcodeWrap}>
                                <div className={styles.title}>
                                    <span>
                                        برای گفتگو با پشتیبان QRCode را با موبایل خود اسکن کنید.
                                    </span>
                                    <span className={styles.titleSmall}>
                                        از ساعت ۷تا ۲۴ پاسخگوی شما هستیم
                                    </span>
                                </div>

                                {shortLink.isSuccess && (
                                    <QRCode
                                        bgColor="#fff"
                                        fgColor="#3f3f79"
                                        renderAs="svg"
                                        level="M"
                                        size={130}
                                        value={
                                            shortLink.isSuccess &&
                                            `http://${shortLink.data.shorten_url}`
                                        }
                                    />
                                )}
                                <Button
                                    size="medium"
                                    onClick={sendMessage}
                                    loading={shortLink.isLoading}
                                    variant="secondary"
                                >
                                    ارسال لینک پشتیبانی بصورت پیامک
                                </Button>
                                {shortLink.isLoading && <Overlay />}
                            </div>

                            <img src={chatSupport} alt="" />
                        </div>
                    </Modal>
                )}
        </>
    );
};

export { Goftino };
