import isEmpty from 'lodash/isEmpty';
import styles from './turnList.module.scss';
import { TurnCard } from '../turnCard';
import { PrescriptionCard } from '../prescriptionCard';
import { useEffect, useState } from 'react';
import Loading from './loading';
import { Default, Mobile } from '@paziresh24/hooks/core/device';
import { ChevronIcon } from '@paziresh24/components/icons';
import { isMobile } from 'react-device-detect';
import { isLessThanExpertDegreeDoctor } from 'apps/drapp/src/functions/isLessThanExpertDegreeDoctor';
import { useDrApp } from '@paziresh24/context/drapp';

const TurnsWrapper = ({ loading, turns, refetchData }) => {
    const [info] = useDrApp();
    const [dropDownShow, setDropDownShow] = useState(false);
    const [isOpenActiveTurns, setIsOpenActiveTurns] = useState(true);
    const [isOpenFinalizedTurns, setIsOpenFinalizedTurns] = useState(true);
    const isExpertDoctor = !isLessThanExpertDegreeDoctor(info.doctor?.expertises);

    document.body.addEventListener('click', () => {
        if (dropDownShow) {
            setDropDownShow(false);
        }
    });

    const ActivePatientsList = ({ finalized }) => (
        <div className="flex justify-between items-center bg-[#f6f8fb] w-full py-4 px-8 text-xl font-bold">
            <div>
                <span className="text-[#68778d]">
                    {finalized
                        ? isExpertDoctor
                            ? 'نسخه های ثبت شده'
                            : 'ویزیت شده'
                        : 'لیست بیماران'}
                </span>
                <span className="text-[#68778d] mr-2">
                    (
                    {
                        turns.filter(turn =>
                            isExpertDoctor
                                ? turn.prescription?.finalized === finalized ||
                                  turn.finalized === finalized
                                : finalized
                                ? turn.book_status === 'visited'
                                : turn.book_status && turn.book_status !== 'visited'
                        ).length
                    }
                    )
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
        Turn: ({ turn }) => (
            <TurnCard
                turn={turn}
                key={turn.id}
                dropDownShowKey={turn.id}
                refetchData={refetchData}
                dropDownShow={dropDownShow}
                setDropDownShow={setDropDownShow}
            />
        ),
        Prescription: ({ turn }) => (
            <PrescriptionCard
                dropDownShow={dropDownShow}
                setDropDownShow={setDropDownShow}
                turn={turn}
                key={turn.id}
                dropDownShowKey={turn.id}
                refetchData={refetchData}
            />
        )
    };

    const isTurnActive = turn => {
        if (!isExpertDoctor) {
            if (turn.book_status !== 'visited') return false;
            return true;
        }
        if (turn.type === 'book') {
            if (!turn.prescription?.finalized) return false;
            return true;
        }
        if (turn.finalized) return true;
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
                    turns.map(
                        turn =>
                            !isTurnActive(turn) &&
                            (turn.type === 'book' ? (
                                <TurnRow.Turn turn={turn} />
                            ) : (
                                isExpertDoctor && <TurnRow.Prescription turn={turn} />
                            ))
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
                    turns.map(
                        turn =>
                            isTurnActive(turn) &&
                            (turn.type === 'book' ? (
                                <TurnRow.Turn turn={turn} />
                            ) : (
                                isExpertDoctor && <TurnRow.Prescription turn={turn} />
                            ))
                    )}
            </>
        )
    );
};

const TurnsList = ({ turns, loading, refetchData }) => {
    return (
        <>
            <Default>
                <table width="100%" className={styles.turnsList}>
                    <colgroup>
                        <col span="1" style={{ width: '17%' }} />
                        <col span="1" style={{ width: '10%' }} />
                        <col span="1" style={{ width: '10%' }} />
                        <col span="1" style={{ width: '10%' }} />
                        <col span="1" style={{ width: '10%' }} />
                        <col span="1" style={{ width: '7%' }} />
                    </colgroup>
                    <thead>
                        <tr className={styles.red}>
                            <th>نام بیمار</th>
                            <th>شماره‌موبایل</th>
                            <th>وضعیت نسخه</th>
                            <th>بیمه</th>
                            <th>تاریخ نوبت</th>
                            <th> </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && Loading()}
                        <TurnsWrapper turns={turns} refetchData={refetchData} loading={loading} />
                    </tbody>
                </table>
            </Default>
            <Mobile>
                {loading && Loading()}
                <TurnsWrapper turns={turns} refetchData={refetchData} loading={loading} />
            </Mobile>
        </>
    );
};

export default TurnsList;
