/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import styles from 'assets/styles/pages/drApp/home.module.scss';
import { PromoteBanner } from '@paziresh24/components/doctorApp/home/promoteBanner';
import { TurnBoxes } from '@paziresh24/components/doctorApp/home/turnBoxes';
import { RevenueBox } from '@paziresh24/components/doctorApp/home/revenueBox';
import { BoxTitle } from '@paziresh24/components/doctorApp/home/boxTitle';
import { useGetRevenue } from '@paziresh24/hooks/drapp/home';
import { useGetBooks } from '@paziresh24/hooks/drapp/home';
import { getToken } from '@paziresh24/utils/localstorage';
import { useEffect, useLayoutEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useDrApp } from '@paziresh24/context/drapp';

const DrApp = () => {
    const [info] = useDrApp();
    const token = getToken();
    const getRevenue = useGetRevenue({ center_id: info.center.id });
    const getBooks = useGetBooks({ center_id: info.center.id });
    const location = useLocation();
    const history = useHistory();

    useLayoutEffect(() => {
        history.replace('/');
    }, []);

    useEffect(() => {
        // getBooks.refetch();
        // getRevenue.refetch();
    }, [info.center]);

    // useEffect(() => {
    //     if (location.state?.afterLogin === true) {
    //         toast.success(`دکتر ${info.doctor.name} ${info.doctor.family} خوش آمدید.`, {
    //             position: isMobile && 'bottom-center'
    //         });
    //         history.replace();
    //     }
    // }, []);
    const excludeUser = [
        // { cell: '9131033886', amount: 385000 },
        // { cell: '9133513421', amount: 245000 },
        // { cell: '9103551159', amount: 1323000 },
        // { cell: '9125443700', amount: 294000 },
        // { cell: '9173003062', amount: 700000 },
        // { cell: '9131510758', amount: 70000000 },
        // { cell: '9224458590', amount: 70000000 }
    ];

    const consultTurn = excludeUser.find(user => user.cell === info.doctor.cell);

    return (
        <div className={styles['wrapper-content']}>
            <PromoteBanner />
            <div className={styles['boxes-wrapper']}>
                {!getRevenue.isError && (
                    <div className={styles['box-wrapper']}>
                        <BoxTitle title="درآمد" subtitle="مدیریت مالی" link="/financial" />
                        <RevenueBox revenue={getRevenue} consultTurn={consultTurn} />
                    </div>
                )}
                <div className={styles['box-wrapper']}>
                    <BoxTitle title="نوبت های امروز" subtitle="نوبت های من" link="/" />
                    <TurnBoxes books={getBooks} />
                </div>
            </div>
            {/* <div className={styles['box-wrapper']}>
                <BoxTitle title="دسترسی سریع" />
                <ServicesBox />
            </div> */}
        </div>
    );
};

export default DrApp;
