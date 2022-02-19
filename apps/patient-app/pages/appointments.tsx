import { Fragment, useState, useEffect } from 'react';
import Head from 'next/head';
import { useInView } from 'react-intersection-observer';

import Turn from '../components/organisms/turn';
import Text from '../components/atoms/text';
import Skeleton from './../components/atoms/skeleton/skeleton';

import { useGetBooks } from '../apis/getBooks/useGetBook.hook';
import { useBookStore } from '../store';

interface AppointmentsProps {
    isWebView: boolean;
}

export const Appointments: React.FC<AppointmentsProps> = ({ isWebView }) => {
    const [page, setPage] = useState<number>(1);
    const { books, addBooks } = useBookStore();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const getBooks = useGetBooks({ page });

    const [ref, inView] = useInView({
        threshold: 0
    });

    useEffect(() => {
        if (inView) setPage(prevState => prevState + 1);
    }, [inView]);

    useEffect(() => {
        getBooks.refetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]); //  getbook is not a dependency

    useEffect(() => {
        if (getBooks.isSuccess) {
            setIsLoading(false);
            getBooks.data?.data && addBooks(getBooks.data.data.data);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getBooks.status]); //  just getBooks.status dependency

    return (
        <>
            <Head>
                <title>نوبت های من</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <div className="flex flex-col container mx-auto">
                {isWebView && (
                    <div className="h-14 w-full flex items-center px-5 bg-white shadow-card fixed top-0 right-0 z-10">
                        <Text fontWeight="bold">نوبت های من</Text>
                    </div>
                )}
                <div
                    className={`p-5 space-y-3 ${
                        isWebView ? 'pt-20' : ''
                    } w-full lg:w-2/4 self-center`}
                >
                    {isLoading && (
                        <>
                            <Skeleton w="100%" h="15rem" rounded="lg" />
                            <Skeleton w="100%" h="15rem" rounded="lg" />
                            <Skeleton w="100%" h="15rem" rounded="lg" />
                            <Skeleton w="100%" h="15rem" rounded="lg" />
                        </>
                    )}
                    {books.length > 0 &&
                        books.map(turn => (
                            <Fragment key={turn.id}>
                                <Turn
                                    status={turn.status}
                                    id={turn.id}
                                    centerType={
                                        turn.center_info.center_type === '1'
                                            ? 'clinic'
                                            : turn.center_info.center_id === '5532'
                                            ? 'consult'
                                            : 'hospital'
                                    }
                                    centerInfo={{
                                        centerId: turn.center_info.center_id,
                                        centerType: turn.center_info.center_type
                                    }}
                                    doctorInfo={{
                                        avatar:
                                            process.env.NEXT_PUBLIC_CLINIC_BASE_URL +
                                            turn.doctor_info.avatar,
                                        firstName: turn.doctor_info.first_name,
                                        lastName: turn.doctor_info.last_name,
                                        expertise: turn.doctor_info.expertise,
                                        slug: turn.doctor_info.slug
                                    }}
                                    patientInfo={{
                                        nationalCode: turn.patient_info.national_code
                                    }}
                                    turnDetails={{
                                        bookTime: turn.turn_details.book_time,
                                        waitingTime: turn.turn_details.waiting_time,
                                        trackingCode: turn.turn_details.tracking_code
                                    }}
                                    location={{
                                        ...turn.location
                                    }}
                                    feedbackUrl={turn.feedback_url}
                                    prescription={{
                                        ...turn.prescription
                                    }}
                                />
                            </Fragment>
                        ))}
                    {!isLoading && getBooks.data?.status !== 204 && (
                        <div ref={ref} className="w-full flex justify-center py-8">
                            <svg
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                width="60px"
                                height="10px"
                                viewBox="0 0 80 20"
                            >
                                <circle cx="10" cy="10" r="10" fill="#2b2f33">
                                    <animate
                                        attributeName="cx"
                                        from="10"
                                        to="40"
                                        dur="0.5s"
                                        calcMode="spline"
                                        keySplines="0.42 0 0.58 1"
                                        keyTimes="0;1"
                                        repeatCount="indefinite"
                                    />
                                </circle>
                                <circle cx="10" cy="10" r="0" fill="#2b2f33">
                                    <animate
                                        attributeName="r"
                                        from="0"
                                        to="10"
                                        dur="0.5s"
                                        calcMode="spline"
                                        keySplines="0.42 0 0.58 1"
                                        keyTimes="0;1"
                                        repeatCount="indefinite"
                                    />
                                </circle>
                                <circle cx="40" cy="10" r="10" fill="#2b2f33">
                                    <animate
                                        attributeName="cx"
                                        from="40"
                                        to="70"
                                        dur="0.5s"
                                        calcMode="spline"
                                        keySplines="0.42 0 0.58 1"
                                        keyTimes="0;1"
                                        repeatCount="indefinite"
                                    />
                                </circle>
                                <circle cx="70" cy="10" r="10" fill="#2b2f33">
                                    <animate
                                        attributeName="r"
                                        from="10"
                                        to="0"
                                        dur="0.5s"
                                        calcMode="spline"
                                        keySplines="0.42 0 0.58 1"
                                        keyTimes="0;1"
                                        repeatCount="indefinite"
                                    />
                                </circle>
                            </svg>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export async function getServerSideProps(context) {
    const isWebView: boolean = context.req.query?.isWebView ?? false;
    return {
        props: {
            isWebView
        }
    };
}

export default Appointments;
