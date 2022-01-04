import { createContext, useContext, useMemo, useState } from 'react';
import { useLocation } from 'react-router';
import queryString from 'query-string';
import isEmpty from 'lodash/isEmpty';

const IsActiveLearnContext = createContext();

const useIsActiveLearn = () => {
    const context = useContext(IsActiveLearnContext);
    if (!context) {
        throw new Error(`useIsActiveLearn must be used within a IsActiveLearnContext`);
    }

    return context;
};

const IsActiveLearnProvider = props => {
    const { search } = useLocation();
    const urlParams = queryString.parse(search);

    const [isActive, setIsActive] = useState(!isEmpty(urlParams.learn));

    const value = useMemo(() => [isActive, setIsActive], [isActive]);
    return <IsActiveLearnContext.Provider value={value} {...props} />;
};

export { useIsActiveLearn, IsActiveLearnProvider };
