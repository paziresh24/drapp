import { BookStatus } from '../../../types/bookStatus';
import { CenterType } from '../../../types/centerType';

export interface TurnProps {
    status?: BookStatus;
    id: string;
    centerType: CenterType;
    centerInfo: {
        centerId: string;
        centerType: string;
        isPaging: boolean;
    };
    doctorInfo: {
        avatar: string;
        firstName: string;
        lastName: string;
        expertise?: string;
        slug: string;
    };
    patientInfo: {
        nationalCode: string;
    };
    turnDetails: {
        bookTime: number;
        waitingTime?: 0 | 1 | 2 | 3;
        trackingCode: string;
    };
    location: {
        address: string;
        lat: number;
        lng: number;
    };
    feedbackUrl: string | null;
    prescription?: {
        pdf?: string;
    };
}
