import styles from '../lists.module.scss';

import ReactTooltip from 'react-tooltip';
import StarService from '../../atom/starService';

const ServiceName = ({ name, service, favorite = true, insuranceType }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {favorite && <StarService insuranceType={insuranceType} service={service} />}
            <span className={styles.nameService} data-tip data-for={`serviceName-${service.id}`}>
                {name}
            </span>
            <ReactTooltip id={`serviceName-${service.id}`} place="top" type="dark" effect="solid">
                {name}
            </ReactTooltip>
        </div>
    );
};

export default ServiceName;
