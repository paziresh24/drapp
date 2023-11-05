import queryString from 'query-string';

export const isEmbed = () => {
    const urlParams = queryString.parse(window.location.search);

    return urlParams.isWebView || window.location !== window.parent.location;
};

export default isEmbed;
