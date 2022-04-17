export const schema = [
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
];
