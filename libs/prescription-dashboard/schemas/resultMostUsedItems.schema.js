export const resultSchema = {
    doctor: [
        {
            title: 'نام مرکز',
            field: 'center_name',
            meta: {
                width: '4%'
            }
        },
        {
            title: 'نام سرویس',
            field: 'name',
            meta: {
                width: '13%'
            }
        },
        {
            title: 'تعداد',
            field: 'total',
            meta: {
                width: '1%'
            }
        },
        {
            title: 'نوع نسخه',
            field: 'prescription_type',
            meta: {
                width: '3%'
            }
        }
    ],
    hospital: [
        {
            title: 'نام مرکز',
            field: 'center_name',
            meta: {
                width: '4%'
            }
        },
        {
            title: 'نام پزشک',
            field: 'doctor_id',
            meta: {
                width: '4%'
            }
        },
        {
            title: 'نام سرویس',
            field: 'name',
            meta: {
                width: '13%'
            }
        },
        {
            title: 'تعداد',
            field: 'total',
            meta: {
                width: '1%'
            }
        },
        {
            title: 'نوع نسخه',
            field: 'prescription_type',
            meta: {
                width: '3%'
            }
        }
    ],
    university: [
        {
            title: 'نام مرکز',
            meta: {
                width: '4%'
            }
        },
        {
            title: 'نام پزشک',
            meta: {
                width: '4%'
            }
        },
        {
            title: 'نام سرویس',
            meta: {
                width: '2%'
            }
        },
        {
            title: 'تعداد',
            meta: {
                width: '3%',
                provider: 'tamin'
            }
        },
        {
            title: 'نوع نسخه',
            meta: {
                width: '5%'
            }
        }
    ]
};
