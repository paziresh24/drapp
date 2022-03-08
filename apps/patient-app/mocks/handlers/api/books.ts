import { rest } from 'msw';

export const booksHandlers = [
    rest.get('/api/books', (req, res, ctx) => {
        const { P24SESSION: p24session, certificate } = req.cookies;

        if (!p24session || !certificate) {
            return res(ctx.status(401));
        }

        return res(
            ctx.status(200),
            ctx.json({
                data: [
                    {
                        status: 'requested',
                        doctor_info: {
                            first_name: 'درخواست نوبت',
                            last_name: 'درمانگاه ام اس',
                            avatar: '/api/getImage/p24/search-men/noimage.png',
                            slug: 'دکتر-دزخواست-نوبت-درمانگاه-ام-اس'
                        },
                        patient_info: {},
                        center_info: {
                            center_id: '76580965-bc20-11ea-88de-005056b09c11',
                            has_paging: false
                        },
                        turn_details: {
                            tracking_code: '1853944673'
                        },
                        location: {
                            address:
                                'تهران ؛ میدان امام خمینی (ره) - نرسیده به میدان حسن آباد- بیمارستان سینا - نبش خیابان 30 تیر ( درمانگاه فوق تخصصی ام اس )'
                        },
                        prescription: {}
                    },
                    {
                        status: 'rejected',
                        doctor_info: {
                            first_name: 'پذیرش بستری',
                            last_name: 'بیمارستان مجیبیان',
                            avatar: '/api/getImage/p24/search-men/75da988f9bac46482a190149cf3d25a8.jpg',
                            slug: 'دکتر-پذیرش-بستری-1'
                        },
                        patient_info: {},
                        center_info: {
                            center_id: '5328275b-b6cb-11eb-a8e0-005056b09c11',
                            has_paging: false
                        },
                        turn_details: {
                            tracking_code: '2445060308'
                        },
                        location: {
                            address: 'خیابان کاشانی، بیمارستان دکتر مجیبیان'
                        },
                        prescription: {}
                    },
                    {
                        id: '149671e6-9d3b-11ec-9b06-005056ade667',
                        status: 'not_visited',
                        doctor_info: {
                            first_name: 'محمد',
                            last_name: 'شاهی',
                            avatar: '/api/getImage/p24/search-men/026f7582146200457155f6276a821543.jpg',
                            expertise: 'متخصص پوست و مو',
                            slug: 'دکتر-محمد-شاهی'
                        },
                        patient_info: {
                            national_code: '4420797282'
                        },
                        center_info: {
                            center_type: '1',
                            center_id: '4907',
                            has_paging: true
                        },
                        turn_details: {
                            book_time: '1647240600',
                            waiting_time: 1,
                            tracking_code: '1720241084'
                        },
                        location: {
                            address:
                                'بلوار جمهوری، روبروی سه راه استقلال،  کوچه 48 افشار ، داخل کوچه نبش چهار راه دوم ، روبروی دبیرستان فرهنگ، پلاک 4',
                            lat: '31.9198347',
                            lng: '54.3192038'
                        },
                        feedback_url:
                            'https://www.paziresh24.com/doctors-survey/?userID=521016&pname=سحر ثنایی&pID=148fd1f0-9d3b-11ec-9b06-005056ade667&consCode=149671e6-9d3b-11ec-9b06-005056ade667&docName=محمد شاهی&docID=25321&docGexp=بیماریهای پوست&docSID=1&refID=1720241084&userCell=9104490454&bookDate=۱۴۰۰-۱۲-۲۳&bookTime=۱۰:۲۰&docNameU=محمد_شاهی&bookType=وب کلینیک',
                        prescription: {
                            pdf: null
                        }
                    },
                    {
                        id: 'b340c259-9c84-11ec-9b06-005056ade668',
                        status: 'not_visited',
                        doctor_info: {
                            first_name: 'فاطمه',
                            last_name: 'حسینی',
                            avatar: '/api/getImage/p24/search-women/c3119eae3369fc4f1b494ffc482b9739.jpg',
                            expertise: 'زنان و زایمان - مشاور سلامت جنسی',
                            slug: 'دکتر-فاطمه-حسینی-11'
                        },
                        patient_info: {
                            national_code: '4420797282'
                        },
                        center_info: {
                            center_type: '1',
                            center_id: 'ee91672a-e176-4ee6-8ed6-1b1a78a303fd',
                            has_paging: true
                        },
                        turn_details: {
                            book_time: '1646566500',
                            waiting_time: 2,
                            tracking_code: '2893908205'
                        },
                        location: {
                            address: 'پاکدشت/بلوارقمی شمالی/بین جماران3و5/درمانگاه سبز',
                            lat: '35.481513625497',
                            lng: '51.68216586113'
                        },
                        feedback_url:
                            'https://www.paziresh24.com/doctors-survey/?userID=521016&pname=سحر ثنایی&pID=b3116afa-9c84-11ec-9b06-005056ade667&consCode=b340c259-9c84-11ec-9b06-005056ade667&docName=فاطمه حسینی&docID=2ff110a7-2b6f-4dd0-8dec-95b2bae69010&docGexp=مامایی&docSID=1&refID=2893908205&userCell=9104490454&bookDate=۱۴۰۰-۱۲-۱۵&bookTime=۱۵:۰۵&docNameU=فاطمه_حسینی&bookType=وب کلینیک',
                        prescription: {
                            pdf: null
                        }
                    },
                    {
                        id: 'b340c259-9c84-11ec-9b06-005056ade667',
                        status: 'visited',
                        doctor_info: {
                            first_name: 'فاطمه',
                            last_name: 'حسینی',
                            avatar: '/api/getImage/p24/search-women/c3119eae3369fc4f1b494ffc482b9739.jpg',
                            expertise: 'زنان و زایمان - مشاور سلامت جنسی',
                            slug: 'دکتر-فاطمه-حسینی-11'
                        },
                        patient_info: {
                            national_code: '4420797282'
                        },
                        center_info: {
                            center_type: '1',
                            center_id: 'ee91672a-e176-4ee6-8ed6-1b1a78a303fd',
                            has_paging: false
                        },
                        turn_details: {
                            book_time: '1646566500',
                            waiting_time: 2,
                            tracking_code: '2893908205'
                        },
                        location: {
                            address: 'پاکدشت/بلوارقمی شمالی/بین جماران3و5/درمانگاه سبز',
                            lat: '35.481513625497',
                            lng: '51.68216586113'
                        },
                        feedback_url:
                            'https://www.paziresh24.com/doctors-survey/?userID=521016&pname=سحر ثنایی&pID=b3116afa-9c84-11ec-9b06-005056ade667&consCode=b340c259-9c84-11ec-9b06-005056ade667&docName=فاطمه حسینی&docID=2ff110a7-2b6f-4dd0-8dec-95b2bae69010&docGexp=مامایی&docSID=1&refID=2893908205&userCell=9104490454&bookDate=۱۴۰۰-۱۲-۱۵&bookTime=۱۵:۰۵&docNameU=فاطمه_حسینی&bookType=وب کلینیک',
                        prescription: {
                            pdf: null
                        }
                    },
                    {
                        id: '6f7ec8d2-9c77-11ec-9b39-000c291fca7c',
                        status: 'expired',
                        doctor_info: {
                            first_name: 'نبی اله',
                            last_name: 'اسدپور',
                            avatar: '/api/getImage/p24/search-men/noimage.png',
                            expertise: 'فوق تخصص قلب اطفال',
                            slug: 'دکتر-نبی-اله-اسدپور-2'
                        },
                        patient_info: {
                            national_code: '4420797282'
                        },
                        center_info: {
                            center_type: '3',
                            center_id: '408',
                            has_paging: false
                        },
                        turn_details: {
                            book_time: '1646565300',
                            waiting_time: 1,
                            tracking_code: '1552560569'
                        },
                        location: {
                            address: 'خیابان شریعتی - روبروی اداره دارایی',
                            lat: '32.32564100',
                            lng: '50.86049300'
                        },
                        feedback_url:
                            'https://www.paziresh24.com/doctors-survey/?userID=521016&pname=سحر ثنایی&pID=6f7a47b9-9c77-11ec-9b39-000c291fca7c&consCode=6f7ec8d2-9c77-11ec-9b39-000c291fca7c&docName=نبی اله اسدپور&docID=7886&docGexp=قلب اطفال&docSID=33&refID=1552560569&userCell=9104490454&bookDate=۱۴۰۰-۱۲-۱۵&bookTime=۱۴:۴۵&docNameU=نبی_اله_اسدپور&bookType=وب کلینیک',
                        prescription: {
                            pdf: null
                        }
                    },
                    {
                        status: 'deleted',
                        doctor_info: {
                            first_name: 'علیرضا',
                            last_name: 'صمیمی',
                            avatar: '/api/getImage/p24/search-men/noimage.png',
                            slug: 'دکتر-پزشک-ام-ار-ای'
                        },
                        patient_info: {},
                        center_info: {
                            center_id: 'eafb8f64-8ebf-11ea-8b02-005056b09c11',
                            has_paging: false
                        },
                        turn_details: {
                            tracking_code: '3068713841'
                        },
                        location: {
                            address: 'بوشهر'
                        },
                        prescription: {}
                    }
                ]
            })
        );
    })
];
