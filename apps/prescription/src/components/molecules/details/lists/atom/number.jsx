import Count from './../../atom/Count';

const Number = ({
    serviceId,
    value,
    editable = true,
    field,
    label,
    simple = true,
    services,
    setServices
}) => {
    const editNumber = number => {
        if (number) {
            services[services.findIndex(item => item.id === serviceId)][field] = number;
            setServices(services);
        }
    };

    return (
        <>
            {editable && (
                <Count
                    simple={simple}
                    label={label}
                    defaultValue={value}
                    onChange={value => editNumber(value)}
                />
            )}
            {!editable && <span>{value}</span>}
        </>
    );
};

export default Number;
