export const getCenterType = (center: any) => {
    if (center.type_id === 1) return 'office';
    if (center.id === '5532') return 'consult';
    return 'hospital';
};
