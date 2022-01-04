import styles from './itemInfo.module.scss';
import providers from '@paziresh24/constants/prescription.json';
import _ from 'lodash';
import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';

const ItemInfo = props => {
    const [prescriptionInfo] = useSelectPrescription();
    // const [stared, setStared] = useState(props.stared);

    // const addStar = () => {
    //     setStared(true);

    //     return addFavoriteServices.mutate({
    //         provider: prescriptionInfo.insuranceType,
    //         serviceId: props.id
    //     });
    // };

    // const removeStar = () => {
    //     setStared(false);
    //     return deleteFavoriteServices.mutate({
    //         id: props.stared?.id ? props.stared?.id : addFavoriteServices.data.id
    //     });
    // };

    return (
        <div className={styles['wrapper']}>
            {!props.data && (
                <div className="skeleton-wrapper">
                    <div className="skeleton-col">
                        <span className="skeleton" style={{ width: '9rem' }} />
                        <span className="skeleton" style={{ width: '100%' }} />
                        <span className="skeleton" style={{ width: '80%' }} />
                    </div>
                </div>
            )}
            {props.data && (
                <>
                    <div>
                        <span className={styles['type']}>
                            {prescriptionInfo?.insuranceType === providers.tamin
                                ? props.from === 'edit'
                                    ? props.data.srvId.serviceType.srvTypeDes
                                    : props.data.serviceType.srvTypeDes
                                : props.from === 'edit'
                                ? props.data.type.description
                                : props.data.serviceType.description}
                        </span>
                        {!_.isEmpty(props.data.shape) && (
                            <span className={styles['shape']}>
                                {prescriptionInfo?.insuranceType === providers.salamat &&
                                props.from === 'edit'
                                    ? props.data.type.description
                                    : props.data.shape.description}
                            </span>
                        )}
                        {/* {!stared ? (
                            <div
                                className={styles['actionButtonStar']}
                                onClick={addStar}
                                aria-hidden
                            >
                                <StarIcon className={styles['icon']} />
                            </div>
                        ) : (
                            <div
                                className={styles['actionButtonStar']}
                                onClick={removeStar}
                                aria-hidden
                            >
                                <UndoStarIcon className={styles['icon']} />
                            </div>
                        )} */}
                    </div>

                    <span className={styles['title']}>
                        {prescriptionInfo?.insuranceType === providers.tamin
                            ? props.from === 'edit'
                                ? props.data.srvId.srvName
                                : props.data.srvName
                            : props.from === 'edit'
                            ? props.data.service.fullName
                            : props.data.fullName}
                    </span>
                </>
            )}
        </div>
    );
};

export default ItemInfo;
