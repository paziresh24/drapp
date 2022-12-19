import isEmpty from 'lodash/isEmpty';

export const isZibalUser = ({ doctorId, centerId }: { doctorId: string; centerId: string }) => {
    const list: string[] = JSON.parse(window._env_?.P24_ZIBAL_USERS ?? '[]');
    if (isEmpty(list)) return true;
    return list.some((item: any) => item.doctorId === doctorId && item.centerId === centerId);
};
