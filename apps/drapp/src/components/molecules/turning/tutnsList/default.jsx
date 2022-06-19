import isEmpty from 'lodash/isEmpty';
import styles from './turnList.module.scss';
import { TurnCard } from '../turnCard';
import { PrescriptionCard } from '../prescriptionCard';
import { useState } from 'react';
import Loading from './loading';
import { Default, Mobile } from '@paziresh24/hooks/core/device';
import { ChevronIcon } from '@paziresh24/shared/icon';
import { isMobile } from 'react-device-detect';
import { useDrApp } from '@paziresh24/context/drapp';

const TurnsWrapper = ({ loading, turns, refetchData }) => {
    const [info] = useDrApp();
    const [dropDownShow, setDropDownShow] = useState(false);
    const [isOpenActiveTurns, setIsOpenActiveTurns] = useState(true);
    const [isOpenFinalizedTurns, setIsOpenFinalizedTurns] = useState(true);

    document.body.addEventListener('click', () => {
        if (dropDownShow) {
            setDropDownShow(false);
        }
    });

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
            <TurnCard
                turn={turn}
                finalized={turn.book_status === 'visited' || turn.prescription?.finalized}
                key={turn.id}
                dropDownShowKey={turn.id}
                refetchData={refetchData}
                dropDownShow={dropDownShow}
                setDropDownShow={setDropDownShow}
                lineNumber={lineNumber}
            />
        ),
        Prescription: ({ turn, lineNumber }) => (
            <PrescriptionCard
                dropDownShow={dropDownShow}
                setDropDownShow={setDropDownShow}
                turn={turn}
                key={turn.id}
                dropDownShowKey={turn.id}
                refetchData={refetchData}
                lineNumber={lineNumber}
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
                <table width="100%" className={styles.turnsList}>
                    <colgroup>
                        <col span="1" style={{ width: '17%' }} />
                        <col span="1" style={{ width: '10%' }} />
                        <col span="1" style={{ width: '10%' }} />
                        <col span="1" style={{ width: '10%' }} />
                        <col span="1" style={{ width: '10%' }} />
                        <col span="1" style={{ width: '3%' }} />
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
