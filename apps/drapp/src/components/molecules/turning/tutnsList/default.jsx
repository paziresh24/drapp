import isEmpty from 'lodash/isEmpty';
import { useState } from 'react';
import Loading from './loading';
import { Default, Mobile } from '@paziresh24/hooks/core/device';
import { ChevronIcon } from '@paziresh24/shared/icon';
import { isMobile } from 'react-device-detect';
import TurnRowc from '../turnRow';
import { useTurnsStore } from 'apps/drapp/src/store/turns.store';

const TurnsWrapper = () => {
    const [isOpenActiveTurns, setIsOpenActiveTurns] = useState(true);
    const [isOpenFinalizedTurns, setIsOpenFinalizedTurns] = useState(true);
    const turns = useTurnsStore(state => state.turns);

    const ActivePatientsList = ({ finalized }) => (
        <div className="flex justify-between items-center bg-[#f6f8fb] w-full py-2 px-4 text-sm font-bold">
            <div>
                <span className="text-[#68778d]">
                    {finalized ? 'بیماران ویزیت شده' : 'لیست بیماران'}
                </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                        finalized
                            ? setIsOpenFinalizedTurns(prev => !prev)
                            : setIsOpenActiveTurns(prev => !prev)
                    }
                    aria-hidden
                >
                    <ChevronIcon
                        dir={
                            (finalized ? isOpenFinalizedTurns : isOpenActiveTurns)
                                ? 'top'
                                : 'bottom'
                        }
                    />
                </div>
            </div>
        </div>
    );

    const TurnRow = {
        Turn: ({ turn, lineNumber }) => (
            <TurnRowc
                key={turn.id}
                id={turn.id}
                date={turn?.from}
                name={turn.name ?? ''}
                family={turn.family ?? ''}
                mobileNumber={turn?.cell}
                nationalCode={
                    turn.national_code
                        ? turn.national_code
                        : turn?.prescription?.patientNationalCode
                }
                type={turn.type}
                number={lineNumber}
                paymentStatus={turn.payment_status}
                paymentPrice={turn.user_payment}
                refId={turn.ref_id}
                bookStatus={turn.book_status}
                prescription={{
                    id: turn.prescription?.id,
                    finalized: turn.book_status === 'visited' || turn.prescription?.finalized,
                    isReference: turn?.prescription?.salamat_prescription?.isReference,
                    issuerType: turn?.prescription?.patientAdditionalData?.issuerType,
                    status: turn.prescription?.status,
                    pdfName: turn?.prescription?.pdf,
                    provider: turn?.prescription?.insuranceType,
                    trackingCode:
                        turn.prescription &&
                        (turn.prescription?.insuranceType === 'tamin'
                            ? turn.prescription.tamin_prescription.map(item => item.head_EPRSC_ID)
                            : [turn.prescription.salamat_prescription?.trackingCode]),
                    sequenceNumber:
                        turn.prescription.salamat_prescription?.trackingCode?.sequenceNumber
                }}
            />
        ),
        Prescription: ({ turn, lineNumber }) => (
            <TurnRowc
                key={turn.id}
                id={turn.id}
                date={new Date(turn.created_at).getTime() / 1000}
                name={turn.patientAdditionalData?.name}
                family={turn.patientAdditionalData?.lastName}
                mobileNumber={turn.patientCell ?? turn?.patientAdditionalData?.cellPhoneNumber}
                nationalCode={turn?.patientNationalCode}
                type={turn.type}
                number={lineNumber}
                prescription={{
                    id: turn.id,
                    finalized: turn?.finalized,
                    isReference: turn?.salamat_prescription?.isReference,
                    issuerType: turn?.patientAdditionalData?.issuerType,
                    status: turn?.status,
                    pdfName: turn.pdf,
                    provider: turn.insuranceType,
                    trackingCode:
                        turn?.insuranceType === 'tamin'
                            ? turn.tamin_prescription.map(item => item.head_EPRSC_ID)
                            : [turn.salamat_prescription?.trackingCode],
                    sequenceNumber: turn.salamat_prescription?.trackingCode?.sequenceNumber
                }}
            />
        )
    };

    const isTurnActive = turn => {
        if (turn.finalized) return true;
        if (turn.type === 'book') {
            if (turn.book_status === 'visited') return true;
            if (!turn.prescription?.finalized) return false;
            return true;
        }

        return false;
    };

    return (
        !isEmpty(turns) && (
            <>
                {!isMobile ? (
                    <tr>
                        <td colSpan="100" className="!p-0">
                            <ActivePatientsList finalized={false} />
                        </td>
                    </tr>
                ) : (
                    <ActivePatientsList finalized={false} />
                )}

                {isOpenActiveTurns &&
                    turns
                        .filter(turn => !isTurnActive(turn))
                        .map((turn, index) =>
                            turn.type === 'book' ? (
                                <TurnRow.Turn turn={turn} key={turn.id} lineNumber={index + 1} />
                            ) : (
                                <TurnRow.Prescription
                                    turn={turn}
                                    key={turn.id}
                                    lineNumber={index + 1}
                                />
                            )
                        )}

                {!isMobile ? (
                    <tr>
                        <td colSpan="100" className="!p-0">
                            <ActivePatientsList finalized={true} />
                        </td>
                    </tr>
                ) : (
                    <ActivePatientsList finalized={true} />
                )}

                {isOpenFinalizedTurns &&
                    turns
                        .filter(turn => isTurnActive(turn))
                        .map((turn, index) =>
                            turn.type === 'book' ? (
                                <TurnRow.Turn turn={turn} key={turn.id} lineNumber={index + 1} />
                            ) : (
                                <TurnRow.Prescription
                                    turn={turn}
                                    key={turn.id}
                                    lineNumber={index + 1}
                                />
                            )
                        )}
            </>
        )
    );
};

const TurnsList = ({ turns, loading, refetchData }) => {
    return (
        <>
            <Default>
                <table className="w-full text-sm text-right">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-solid border-b-gray-100">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                نام بیمار
                            </th>
                            <th scope="col" className="px-6 py-3">
                                شماره‌موبایل
                            </th>
                            <th scope="col" className="px-6 py-3">
                                وضعیت نسخه
                            </th>
                            <th scope="col" className="px-6 py-3">
                                بیمه
                            </th>
                            <th scope="col" className="px-6 py-3">
                                تاریخ نوبت
                            </th>
                            <th scope="col" className="px-6 py-3" />
                        </tr>
                    </thead>
                    <tbody>
                        {loading && Loading()}
                        <TurnsWrapper refetchData={refetchData} loading={loading} />
                    </tbody>
                </table>
            </Default>
            <Mobile>
                {loading && Loading()}
                <TurnsWrapper refetchData={refetchData} loading={loading} />
            </Mobile>
        </>
    );
};

export default TurnsList;
