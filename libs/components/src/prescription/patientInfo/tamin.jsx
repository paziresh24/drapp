import styles from './patientInfo.module.scss';
import classNames from 'classnames';
import styled from 'styled-components';
import { relationType, productId, issuerType, genders } from '../../../constants/patientInfo.json';
import providers from '../../../constants/prescription.json';
import { strDateToDate } from '../../../utils';
import Button from '../../core/button';
import Modal from '../../core/modal';
import { useState } from 'react';
import { useMe } from '../../../context/prescription/me-context';

const Image = styled.div`
    background-image: url(${props => props.data && props.data.memberImage});
`;

const PatientInfoTamin = ({ data, patientCell }) => {
    const [me] = useMe();
    const [detailsModal, setDetailsModal] = useState(false);

    return (
        <>
            <div
                className={classNames({
                    [styles['wrapper']]: true,
                    [styles['tamin']]: true
                })}
            >
                <div className={styles['info']}>
                    {!data && (
                        <div className="skeleton-wrapper">
                            <div className="skeleton-row">
                                {me?.provider === providers.salamat && (
                                    <div
                                        className="skeleton-square"
                                        style={{ maxWidth: '8rem', height: '8rem' }}
                                    />
                                )}
                                <div className="skeleton-col">
                                    <div className="skeleton" style={{ width: '50%' }} />
                                    <div className="skeleton" style={{ width: '40%' }} />
                                    <div className="skeleton" style={{ width: '70%' }} />
                                </div>
                            </div>
                        </div>
                    )}

                    {data && (
                        <>
                            {me?.provider === providers.salamat && (
                                <Image data={data} className={styles['image']} />
                            )}

                            <div
                                className={classNames({
                                    [styles['main']]: true,
                                    [styles['tamin']]: true
                                })}
                            >
                                <div className={styles['name']}>
                                    <span className={styles['value']}>
                                        {data.firstName + ' ' + data.lastName}
                                    </span>
                                </div>
                                <div className={styles['row']}>
                                    <div className={styles['col']}>
                                        <span className={styles['title']}>کدملی</span>
                                        <span className={styles['value']}>{data.nationalCode}</span>
                                    </div>
                                    <div className={styles['col']}>
                                        <span className={styles['title']}>تاریخ تولد</span>
                                        <span className={styles['value']}>{data.birthDate}</span>
                                    </div>
                                </div>
                                <div className={styles['row']}>
                                    <div className={styles['col']}>
                                        <span className={styles['title']}>بیماری خاص</span>
                                        <span className={styles['value']}>
                                            {data.special ? 'دارد' : 'ندارد'}
                                        </span>
                                    </div>
                                    <div className={styles['col']}>
                                        <span className={styles['title']}>شماره موبایل</span>
                                        <span className={styles['value']}>{patientCell}</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className={styles['options']}>
                    {!data && me?.provider === providers.salamat && (
                        <div className="skeleton-wrapper">
                            <div className="skeleton-row">
                                {/* <div
                                    className='skeleton-square'
                                    style={{
                                        maxWidth: '50%',
                                        height: '4rem',
                                        margin: '0',
                                        marginLeft: '0.5rem'
                                    }}
                                /> */}
                                <div
                                    className="skeleton-square"
                                    style={{
                                        maxWidth: '100%',
                                        height: '4rem',
                                        margin: '0',
                                        marginRight: '0.5rem'
                                    }}
                                />
                            </div>
                        </div>
                    )}
                    {data && data && me?.provider === providers.salamat && (
                        <>
                            {/* <Button variant="secondary" block size="small">
                                بیماری های مهم
                            </Button> */}
                            <Button
                                onClick={() => setDetailsModal(true)}
                                variant="secondary"
                                block
                                size="small"
                            >
                                اطلاعات بیشتر
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {data && data && me?.provider === providers.salamat && (
                <Modal title="اطلاعات بیمار" isOpen={detailsModal} onClose={setDetailsModal}>
                    <div className={styles['patientInfo__modal-wrapper']}>
                        <div className={styles['row']}>
                            <div className={styles['col']}>
                                <span className={styles['title']}>نام</span>
                                <span className={styles['value']}>{data.name}</span>
                            </div>
                            <div className={styles['col']}>
                                <span className={styles['title']}>نام خانوادگی</span>
                                <span className={styles['value']}>{data.lastName}</span>
                            </div>
                        </div>
                        <div className={styles['row']}>
                            <div className={styles['col']}>
                                <span className={styles['title']}>سن</span>
                                <span className={styles['value']}>{data.age}</span>
                            </div>
                            <div className={styles['col']}>
                                <span className={styles['title']}>نسبت</span>
                                <span className={styles['value']}>
                                    {relationType[data.relationType]}
                                </span>
                            </div>
                        </div>
                        <div className={styles['row']}>
                            <div className={styles['col']}>
                                <span className={styles['title']}>جنسیت</span>
                                <span className={styles['value']}>{genders[data.gender]}</span>
                            </div>
                            <div className={styles['col']}>
                                <span className={styles['title']}>تاریخ تولد</span>
                                <span className={styles['value']}>
                                    {strDateToDate(data.birthDate)}
                                </span>
                            </div>
                        </div>
                        <div className={styles['row']}>
                            <div className={styles['col']}>
                                <span className={styles['title']}>اعتبار بیمه</span>
                                <span className={styles['value']}>
                                    {strDateToDate(data.accountValidto)}
                                </span>
                            </div>
                            <div className={styles['col']}>
                                <span className={styles['title']}>صادر کننده</span>
                                <span className={styles['value']}>
                                    {issuerType[data.issuerType]}
                                </span>
                            </div>
                        </div>
                        <div className={styles['row']}>
                            <div className={styles['col']}>
                                <span className={styles['title']}>محل تولد</span>
                                <span className={styles['value']}>{data.geoInfo}</span>
                            </div>
                            <div className={styles['col']}>
                                <span className={styles['title']}>تحت پوشش بیمه</span>
                                <span className={styles['value']}>
                                    {data.isCovered ? 'بله' : 'خیر'}
                                </span>
                            </div>
                        </div>
                        <div className={styles['row']}>
                            <span className={styles['title']}>صندوق بیمه</span>
                            <span className={styles['value']}>{productId[data.productId]}</span>
                        </div>
                        {data.specialAccount && (
                            <div className={styles['row']}>
                                <span className={styles['title']}>بیماری خاص</span>
                                <span className={styles['value']}>{data.specialAccount}</span>
                            </div>
                        )}
                    </div>
                </Modal>
            )}
        </>
    );
};

export { PatientInfoTamin };
