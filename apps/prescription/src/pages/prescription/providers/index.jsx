/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import styles from '../../../assets/styles/pages/prescription/auth.module.scss';

// HOOKS
import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

// COMPONENTS
import { Body } from '@paziresh24/components/prescription/panel/body';
import { PoroviderItem } from '@paziresh24/components/prescription/providerItem';
import { useState } from 'react';
import { useInsurances } from '@paziresh24/hooks/prescription/insurances/index';
import { Default, Mobile } from '@paziresh24/hooks/device';
import { useDrApp } from '@paziresh24/context/drapp';
import { isMobile } from 'react-device-detect';

const Providers = () => {
    const insurances = useInsurances();
    const [info] = useDrApp();
    const [isAuthenticated, setIsAuthenticated] = useState();

    useEffect(() => {
        insurances.refetch();
    }, []);

    return (
        <Body>
            <div className={styles.wrapper}>
                <Default>
                    <DescriptionBox />
                </Default>
                <div className={styles.providerColumn}>
                    {!insurances.isSuccess ? (
                        <>
                            <ProviderItemSkeleton />
                            <ProviderItemSkeleton />
                        </>
                    ) : (
                        <>
                            <PoroviderItem
                                provider="tamin"
                                data={insurances.data}
                                setIsAuthenticated={setIsAuthenticated}
                                refetch={insurances.refetch}
                            />
                            <PoroviderItem
                                provider="salamat"
                                centers={info.centers}
                                data={insurances.data}
                                setIsAuthenticated={setIsAuthenticated}
                                refetch={insurances.refetch}
                            />
                        </>
                    )}
                </div>
                <Mobile>
                    <DescriptionBox />
                </Mobile>
            </div>
        </Body>
    );
};

const ProviderItemSkeleton = () => {
    return isMobile ? (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                padding: '1rem'
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%'
                }}
            >
                <div
                    className="skeleton"
                    style={{
                        width: '40%',
                        height: '0.9rem',
                        borderRadius: '1rem',
                        marginBottom: '1rem'
                    }}
                ></div>
                <div
                    className="skeleton"
                    style={{ width: '20%', height: '0.9rem', borderRadius: '1rem' }}
                ></div>
            </div>
            <div
                className="skeleton"
                style={{ width: '35%', height: '2rem', borderRadius: '100rem' }}
            ></div>
        </div>
    ) : (
        <div
            className="skeleton"
            style={{ width: '100%', height: '10rem', borderRadius: '0.4rem' }}
        />
    );
};

const DescriptionBox = () => {
    return (
        <div className={styles.descriptionBox}>
            <p>
                برای احراز هویت نسخه نویسی، کافیست یکبار برای همیشه اطلاعات مربوط به احراز هویت بیمه
                سلامت و تامین اجتماعی خود را وارد کنید.
            </p>
            <p>
                - اطلاعات کاربری تامین اجتماعی برای مرکز درمانی و مطب شخصی یکسان می باشد و با ورود
                کد نظام، کد ملی و شماره موبایل ثبت شده در سامانه تامین اجتماعی، احراز هویت کنید.
            </p>
            <p>
                - نام کاربری و رمز عبور شما در مطب و هر مرکز درمانی برای بیمه سلامت متفاوت است که آن
                را می توانید از سازمان بیمه سلامت دریافت کنید.
            </p>
            <p>
                - ممکن است برای احراز هویت بیمه سلامت رمز عبور دو مرحله ای داشته باشید که هر 24 ساعت
                یکبار، می بایست موقع نسخه نویسی، کد 5 رقمی پیامک شده را وارد کنید.
            </p>
        </div>
    );
};

export default Providers;
