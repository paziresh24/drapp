export const getMobileOS = () => {
    const ua = navigator.userAgent;
    if (
        /iPad|iPhone|iPod/.test(ua) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    ) {
        return 'iOS';
    }

    return 'Android';
};

export default getMobileOS;
