import isEmpty from 'lodash/isEmpty';
import styles from './turnList.module.scss';
import { TurnCard } from '../turnCard';
import { PrescriptionCard } from '../prescriptionCard';
import { useEffect, useState } from 'react';
import Loading from './loading';
import { Default, Mobile } from '@paziresh24/hooks/core/device';
import { ChevronIcon } from '@paziresh24/components/icons';
import { isMobile } from 'react-device-detect';

const TurnsWrapper = ({ loading, turns, refetchData }) => {
    const [dropDownShow, setDropDownShow] = useState(false);
    const [isOpenActiveTurns, setIsOpenActiveTurns] = useState(true);
    const [isOpenFinalizedTurns, setIsOpenFinalizedTurns] = useState(true);

    document.body.addEventListener('click', () => {
        if (dropDownShow) {
            setDropDownShow(false);
        }
    });

    return (
        !isEmpty(turns) && (
            <>
                {!isMobile ? (
                    <tr className={styles['head-title']}>
                        <td>
                            لیست بیماران
                            <span style={{ marginRight: '0.5rem' }}>
                                (
                                {
                                    turns.filter(
                                        turn =>
                                            turn.prescription?.finalized === false ||
                                            turn.finalized === false
                                    ).length
                                }
                                )
                            </span>
                        </td>
                        <td />
                        <td />
                        <td />
                        <td />
                        <td>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <div
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => setIsOpenActiveTurns(prev => !prev)}
                                    aria-hidden
                                >
                                    <ChevronIcon dir={isOpenActiveTurns ? 'top' : 'bottom'} />
                                </div>
                            </div>
                        </td>
                    </tr>
                ) : (
                    <div
                        className={styles['head-title']}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                            padding: '1rem 2rem'
                        }}
                    >
                        <div>
                            <span>لیست بیماران</span>
                            <span style={{ marginRight: '0.5rem' }}>
                                (
                                {
                                    turns.filter(
                                        turn =>
                                            turn.prescription?.finalized === false ||
                                            turn.finalized === false
                                    ).length
                                }
                                )
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <div
                                style={{ cursor: 'pointer' }}
                                onClick={() => setIsOpenActiveTurns(prev => !prev)}
                                aria-hidden
                            >
                                <ChevronIcon dir={isOpenActiveTurns ? 'top' : 'bottom'} />
                            </div>
                        </div>
                    </div>
                )}

                {isOpenActiveTurns &&
                    turns.map(turn =>
                        turn.type === 'book'
                            ? !turn.prescription?.finalized && (
                                  <TurnCard
                                      turn={turn}
                                      key={turn.id}
                                      dropDownShowKey={turn.id}
                                      refetchData={refetchData}
                                      dropDownShow={dropDownShow}
                                      setDropDownShow={setDropDownShow}
                                  />
                              )
                            : !turn?.finalized && (
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

                {!isMobile ? (
                    <tr
                        className={styles['head-title']}
                        style={{ borderTop: '1px solid #e6e6e683' }}
                    >
                        <td>
                            <span>نسخه های ثبت شده</span>
                            <span style={{ marginRight: '0.5rem' }}>
                                (
                                {
                                    turns.filter(
                                        turn =>
                                            turn.prescription?.finalized === true ||
                                            turn.finalized === true
                                    ).length
                                }
                                )
                            </span>
                        </td>
                        <td />
                        <td />
                        <td />
                        <td />
                        <td>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <div
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => setIsOpenFinalizedTurns(prev => !prev)}
                                    aria-hidden
                                >
                                    <ChevronIcon dir={isOpenFinalizedTurns ? 'top' : 'bottom'} />
                                </div>
                            </div>
                        </td>
                    </tr>
                ) : (
                    <div
                        className={styles['head-title']}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                            padding: '1rem 2rem'
                        }}
                    >
                        <div>
                            <span>نسخه های ثبت شده</span>
                            <span style={{ marginRight: '0.5rem' }}>
                                (
                                {
                                    turns.filter(
                                        turn =>
                                            turn.prescription?.finalized === true ||
                                            turn.finalized === true
                                    ).length
                                }
                                )
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <div
                                style={{ cursor: 'pointer' }}
                                onClick={() => setIsOpenFinalizedTurns(prev => !prev)}
                                aria-hidden
                            >
                                <ChevronIcon dir={isOpenFinalizedTurns ? 'top' : 'bottom'} />
                            </div>
                        </div>
                    </div>
                )}

                {isOpenFinalizedTurns &&
                    turns.map(turn =>
                        turn.type === 'book'
                            ? turn.prescription?.finalized && (
                                  <TurnCard
                                      turn={turn}
                                      key={turn.id}
                                      dropDownShowKey={turn.id}
                                      refetchData={refetchData}
                                      dropDownShow={dropDownShow}
                                      setDropDownShow={setDropDownShow}
                                  />
                              )
                            : turn?.finalized && (
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
