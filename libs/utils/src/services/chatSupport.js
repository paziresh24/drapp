import { captureMessage } from '@sentry/react';

export const ChatSupport = {
    goftinoId: process.env.REACT_APP_GOFTINO_ID,
    init() {
        const i = this.goftinoId;
        function g() {
            const g = document.createElement('script'),
                s = 'https://www.goftino.com/widget/' + i,
                l = localStorage.getItem('goftino_' + i);
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            (g.async = !0), (g.src = l ? s + '?o=' + l : s), (g.id = 'goftino-script');

            document.getElementsByTagName('head')[0].appendChild(g);
        }
        'complete' === document.readyState
            ? g()
            : window.attachEvent
            ? window.attachEvent('onload', g)
            : window.addEventListener('load', g, !1);
    },
    setUserInfo(userInfo) {
        try {
            if (window.__goftino_ready) {
                window.Goftino.setUser({
                    email: '',
                    name: `دکتر ${userInfo.name} ${userInfo.family}`,
                    phone: userInfo.cell,
                    avatar: userInfo.image,
                    tags: userInfo.expertises
                        .map(
                            item =>
                                item.degree?.name && `${item.degree.name} ${item.expertise.name}`
                        )
                        .join(','),
                    forceUpdate: true
                });
            }
        } catch (e) {
            captureMessage('not set user goftino');
        }
    },
    setUserId(userId = null, setUserIdPromises) {
        try {
            if (window.__goftino_ready) {
                if (userId !== null) {
                    window.Goftino.setUserId(userId);
                } else {
                    const newId = window.Goftino.getUserId();
                    setUserIdPromises({ goftino_id: newId });
                }
            }
        } catch (e) {
            captureMessage('not set user ID goftino');
        }
    }
};
