import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const useShouldShowActionBars = () => {
    const router = useLocation();

    const [shouldShowActionBars, setShouldShowActionBars] = useState(false);
    const excloudShowActionBars = useRef(['/activation/*']);
    const excloudShowActionBarsRegex = excloudShowActionBars.current.map(item => new RegExp(item));

    useEffect(() => {
        setShouldShowActionBars(
            !excloudShowActionBarsRegex.some(item => item.test(router.pathname))
        );
    }, [router.pathname]);

    return shouldShowActionBars;
};

export default useShouldShowActionBars;
