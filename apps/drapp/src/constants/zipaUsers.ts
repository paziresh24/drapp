import isEmpty from 'lodash/isEmpty';

export const isZibalUser = ({ userCenterId }: { userCenterId: string }) => {
    const list: string[] = JSON.parse(window._env_?.P24_ZIBAL_USERS ?? '[]');
    if (isEmpty(list)) return true;
    return list.includes(userCenterId);
};
