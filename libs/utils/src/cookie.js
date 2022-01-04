export const getCookie = name => {
    var cookieItems = document.cookie.split(';').map(function (item) {
        var itemArr = item.trim().split('=');
        return {
            name: itemArr[0],
            value: itemArr[1]
        };
    });

    for (var i in cookieItems) {
        if (cookieItems[i].name === name) return cookieItems[i].value;
    }

    return '';
};

export const setCookie = (name, value, expire) => {
    expire = expire === undefined ? false : expire;

    if (expire) {
        const expiresAt = 'expires=' + expire;

        document.cookie = name + '=' + value + ';' + expiresAt + ';path=/';
    } else {
        document.cookie = name + '=' + value + ';';
    }
};
