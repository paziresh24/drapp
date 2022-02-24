import type { TurnProps } from './turnType';
import Card from '../../atoms/card';
import { useState, useEffect } from 'react';
import { BookStatus } from 'apps/patient-app/types/bookStatus';

import { TurnBody, TurnFooter, TurnHeader } from '../../molecules/turnCard';
import { turnDetailsData } from './turnDetails';

export const Turn: React.FC<TurnProps> = props => {
    const {
        status,
        doctorInfo,
        turnDetails,
        location,
        feedbackUrl,
        prescription,
        centerType,
        patientInfo,
        centerInfo,
        id
    } = props;

    const [detailsData, setDetailsData] = useState([]);

    useEffect(() => {
        setDetailsData(
            turnDetailsData({
                data: turnDetails,
                centerType,
                status
            })
        );
    }, [turnDetails, status, centerType]);

    return (
        <Card
            className="space-y-2 relative"
            style={{ opacity: status === BookStatus.deleted && '0.5' }}
        >
            <TurnHeader
                id={id}
                doctorInfo={doctorInfo}
                centerId={centerInfo.centerId}
                trackingCode={turnDetails.trackingCode}
                nationalCode={patientInfo.nationalCode}
                status={status}
            />

            <TurnBody
                centerType={centerType}
                detailsData={detailsData}
                location={location}
                feedbackUrl={feedbackUrl}
                status={status}
            />

            <TurnFooter
                centerType={centerType}
                pdfLink={prescription.pdf}
                slug={doctorInfo.slug}
                status={status}
            />
        </Card>
    );
};

export default Turn;
