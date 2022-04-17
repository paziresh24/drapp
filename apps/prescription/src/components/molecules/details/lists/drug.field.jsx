import ServiceName from './atom/serviceName';
import fieldType from './fieldType';

const Field = ({ type, fieldName, service }) => {
    return (
        <>
            {type === fieldType.TEXT && <ServiceName name={service[fieldName]} />}
            {type === fieldType.CITY && <ServiceName name={service[fieldName]} />}
        </>
    );
};

export default Field;
