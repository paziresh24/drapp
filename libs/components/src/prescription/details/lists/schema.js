export const schema = {
    drugs: [
        {
            title: 'نام دارو',
            meta: {
                width: '25%'
            },
            field: {
                key: 'service.name',
                type: 'text',
                favorite: true
            }
        },
        {
            title: 'تعداد',
            meta: {
                width: '2%'
            }
        },
        {
            title: 'دوره تکرار',
            field: 'repeat',
            meta: {
                width: '3%',
                provider: 'tamin'
            }
        },
        {
            title: 'زمان مصرف',
            meta: {
                width: '5%'
            }
        },
        {
            title: 'طریقه مصرف',
            meta: {
                width: '5%'
            }
        },
        {
            title: 'مقادیر مصرف',
            meta: {
                width: '5%'
            }
        },
        {
            title: 'تاریخ موثر',
            meta: {
                width: '4%',
                provider: 'salamat'
            }
        }
    ],
    lab: [
        {
            title: 'نام آزمایش',
            meta: {
                width: '55%'
            },
            field: {
                key: 'service.name',
                type: 'text',
                favorite: true
            }
        },
        {
            title: 'تعداد',
            meta: {
                width: '5%'
            }
        },
        {
            title: 'تاریخ موثر',
            meta: {
                width: '10%'
            }
        }
    ],
    imaging: [
        {
            title: 'نام خدمت تصویربرداری',
            meta: {
                width: '55%'
            },
            field: {
                key: 'service.name',
                type: 'text',
                favorite: true
            }
        },
        {
            title: 'تعداد',
            meta: {
                width: '5%'
            }
        },
        {
            title: 'تاریخ موثر',
            meta: {
                width: '10%'
            }
        }
    ],
    others: [
        {
            title: 'نام پاراکلینیک',
            meta: {
                width: '55%'
            },
            field: {
                key: 'service.name',
                type: 'text',
                favorite: true
            }
        },
        {
            title: 'تعداد',
            meta: {
                width: '5%'
            }
        },
        {
            title: 'تاریخ موثر',
            meta: {
                width: '10%'
            }
        }
    ]
};
