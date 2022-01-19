import isEmpty from 'lodash/isEmpty';
import styles from './turnList.module.scss';
import { TurnCard } from '../turnCard';
import { PrescriptionCard } from '../prescriptionCard';
import { useEffect, useState } from 'react';
import Loading from './loading';
import { Default, Mobile } from '@paziresh24/hooks/core/device';

const TurnsWrapper = ({ loading, turns, refetchData }) => {
    const [dropDownShow, setDropDownShow] = useState(false);
    const [nearTurns, setNearTurns] = useState([]);

    useEffect(() => {
        if (!isEmpty(turns)) {
            setNearTurns(
                turns
                    .filter(
                        turn =>
                            (turn.type === 'book'
                                ? !turn.prescription?.finalized ?? false
                                : !turn.finalized) &&
                            (turn.type === 'book'
                                ? turn.from * 1000
                                : new Date(turn.created_at).getTime()) <= new Date().getTime() &&
                            (turn.type === 'book'
                                ? turn.from * 1000
                                : new Date(turn.created_at).getTime()) -
                                new Date().getTime() >=
                                -900000
                    )
                    .reverse()
                    .slice(0, 2)
                    .reverse(),
                turns
                    .filter(
                        turn =>
                            (turn.type === 'book'
                                ? !turn.prescription?.finalized ?? false
                                : !turn.finalized) &&
                            (turn.type === 'book'
                                ? turn.from * 1000
                                : new Date(turn.created_at).getTime()) >= new Date().getTime() &&
                            (turn.type === 'book'
                                ? turn.from * 1000
                                : new Date(turn.created_at).getTime()) -
                                new Date().getTime() <=
                                900000
                    )
                    .slice(0, 2)
            );
        }
    }, [turns]);

    document.body.addEventListener('click', () => {
        if (dropDownShow) {
            setDropDownShow(false);
        }
    });

    return (
        !isEmpty(turns) && (
            <>
                {!isEmpty(nearTurns) && (
                    <tr className={styles['head-title']}>
                        <td>نوبت های نزدیک</td>
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                    </tr>
                )}

                {!isEmpty(nearTurns) &&
                    nearTurns.map(turn =>
                        turn.type === 'book' ? (
                            <TurnCard
                                turn={turn}
                                key={turn.id}
                                dropDownShowKey={turn.id + 'near'}
                                refetchData={refetchData}
                                dropDownShow={dropDownShow}
                                setDropDownShow={setDropDownShow}
                            />
                        ) : (
                            <PrescriptionCard
                                dropDownShow={dropDownShow}
                                setDropDownShow={setDropDownShow}
                                turn={turn}
                                key={turn.id}
                                dropDownShowKey={turn.id + 'near'}
                                refetchData={refetchData}
                            />
                        )
                    )}

                {!isEmpty(nearTurns) && (
                    <tr className={styles['head-title']}>
                        <td>نوبت ها</td>
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                    </tr>
                )}

                {turns.map(turn =>
                    turn.type === 'book' ? (
                        <TurnCard
                            turn={turn}
                            key={turn.id}
                            dropDownShowKey={turn.id}
                            refetchData={refetchData}
                            dropDownShow={dropDownShow}
                            setDropDownShow={setDropDownShow}
                        />
                    ) : (
                        <PrescriptionCard
                            dropDownShow={dropDownShow}
                            setDropDownShow={setDropDownShow}
                            turn={turn}
                            key={turn.id}
                            dropDownShowKey={turn.id}
                            refetchData={refetchData}
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
