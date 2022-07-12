import isEmpty from 'lodash/isEmpty';
import styles from './turnList.module.scss';
import { Item } from '../item';
import { memo, useState } from 'react';
import { Default, Mobile } from '@paziresh24/hooks/device';
import Loading from './loading';
// import { Default, Mobile } from '../../../hooks/device';

const TurnsWrapper = ({ loading, turns, refetchData }) => {
    const [dropDownShow, setDropDownShow] = useState(false);

    document.body.addEventListener('click', () => {
        if (dropDownShow) {
            setDropDownShow(false);
        }
    });

    return (
        !isEmpty(turns) && (
            <>
                {turns.map(
                    turn =>
                        turn.finalized && (
                            <Item
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
                            <th>کد توالی</th>
                            <th>کدپیگیری</th>
                            <th>بیمه</th>
                            <th>زمان ثبت</th>
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

export default memo(TurnsList);
