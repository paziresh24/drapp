import { memo } from 'react';
import { useMediaQuery } from 'react-responsive';

export const Desktop = memo(({ children }) => {
    const isDesktop = useMediaQuery({ minWidth: 992 });
    if (children) return isDesktop ? children : null;
    return isDesktop;
});
export const Tablet = memo(({ children }) => {
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
    if (children) return isTablet ? children : null;
    return isTablet;
});
export const Mobile = memo(({ children }) => {
    const isMobile = useMediaQuery({ maxWidth: 767 });
    if (children) return isMobile ? children : null;
    return isMobile;
});
export const Default = memo(({ children }) => {
    const isNotMobile = useMediaQuery({ minWidth: 768 });
    if (children) return isNotMobile ? children : null;
    return isNotMobile;
});
