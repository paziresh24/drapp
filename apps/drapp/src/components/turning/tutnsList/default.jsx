import isEmpty from 'lodash/isEmpty';
import { useState } from 'react';
import Loading from './loading';
import { Default, Mobile } from '@paziresh24/hooks/core/device';
import { ChevronIcon } from '@paziresh24/shared/icon';
import TurnRowc from '../turnRow';
import { useTurnsStore } from 'apps/drapp/src/store/turns.store';
import { useMediaQuery } from 'react-responsive';

const checkPaymentStatus = turn => {
    if (
        turn.payment_status === 'refunded' ||
        turn.payment_status === 'refund_request' ||
        !!turn.book_delete
    )
        return 'refunded';

    return 'paid';
};

const ListHeader = ({ title, count, onToggle, isOpen }) => {
    return (
        <div className="flex justify-between items-center bg-[#f6f8fb] w-full py-2 px-4 text-sm font-bold">
            <div>
                <span className="text-[#68778d]">
                    {title} ({count})
                </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ cursor: 'pointer' }} onClick={onToggle} aria-hidden>
                    <ChevronIcon dir={isOpen ? 'top' : 'bottom'} />
                </div>
            </div>
        </div>
    );
};

const TurnRow = {
    Turn: ({ turn, lineNumber }) => (
        <TurnRowc
            key={turn.id}
            id={turn.id}
            date={turn?.from_date}
            name={turn.name ?? ''}
            family={turn.family ?? ''}
            mobileNumber={turn?.cell}
            nationalCode={
                turn.national_code ? turn.national_code : turn?.prescription?.patientNationalCode
            }
            type={turn.type}
            number={lineNumber}
            paymentStatus={checkPaymentStatus(turn)}
            paymentPrice={turn.user_payment}
            refId={turn.ref_id}
            bookStatus={turn.book_status}
            isDeletedTurn={turn.book_delete}
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
                sequenceNumber: turn.prescription?.salamat_prescription?.sequenceNumber
            }}
        />
    ),
    Prescription: ({ turn, lineNumber }) => (
        <TurnRowc
            key={turn.id}
            id={turn.id}
            date={new Date(turn.created_at)}
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
                sequenceNumber: turn.salamat_prescription?.sequenceNumber
            }}
        />
    )
};

const TurnsWrapper = () => {
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const [isOpenActiveTurns, setIsOpenActiveTurns] = useState(true);
    const [isOpenFinalizedTurns, setIsOpenFinalizedTurns] = useState(true);
    const turns = useTurnsStore(state => state.turns);
    const statistics = useTurnsStore(state => state.statistics);

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
                            <ListHeader
                                title="لیست بیماران"
                                count={statistics.activePatients}
                                onToggle={() => setIsOpenActiveTurns(prev => !prev)}
                                isOpen={isOpenActiveTurns}
                            />
                        </td>
                    </tr>
                ) : (
                    <ListHeader
                        title="لیست بیماران"
                        count={statistics.activePatients}
                        onToggle={() => setIsOpenActiveTurns(prev => !prev)}
                        isOpen={isOpenActiveTurns}
                    />
                )}

                {isOpenActiveTurns &&
                    turns
                        .filter(turn => !isTurnActive(turn) && !turn.book_delete)
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
                            <ListHeader
                                title="بیماران ویزیت شده"
                                count={statistics.visitedPatients}
                                onToggle={() => setIsOpenFinalizedTurns(prev => !prev)}
                                isOpen={isOpenFinalizedTurns}
                            />
                        </td>
                    </tr>
                ) : (
                    <ListHeader
                        title="بیماران ویزیت شده"
                        count={statistics.visitedPatients}
                        onToggle={() => setIsOpenFinalizedTurns(prev => !prev)}
                        isOpen={isOpenFinalizedTurns}
                    />
                )}

                {isOpenFinalizedTurns &&
                    turns
                        .filter(turn => isTurnActive(turn) || !!turn.book_delete)
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
                    <thead className="text-xs text-gray-700 uppercase border-b border-solid bg-gray-50 border-b-gray-100">
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
