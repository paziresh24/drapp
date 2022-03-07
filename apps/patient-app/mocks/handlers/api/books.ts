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
                        status: 'not_visited',
                        doctor_info: {
                            first_name: 'درخواست نوبت از',
                            last_name: 'کلینیک جراحی چاقی',
                            avatar: '/api/getImage/p24/search-men/noimage.png',
                            slug: 'دکتر-درخواست-نوبت-از-کلینیک-جراحی-چاقی'
                        },
                        patient_info: {},
                        center_info: {
                            center_id: '957',
                            has_paging: false
                        },
                        turn_details: {
                            tracking_code: '1005143291'
                        },
                        location: {
                            address:
                                'میدان امام خمینی {ره}  - خیابان امام خمینی  - نرسیده به میدان حسن آباد - بیمارستان سینا'
                        },
                        prescription: {}
                    },
                    {
                        status: 'expired',
                        doctor_info: {
                            first_name: 'محسن',
                            last_name: 'اسفندبد( بیمارجدید )',
                            avatar: '/api/getImage/p24/search-men/noimage.png',
                            slug: 'دکتر-محسن-اسفندبد(-بیمار-جدید-)'
                        },
                        patient_info: {},
                        center_info: {
                            center_id: '957',
                            has_paging: false
                        },
                        turn_details: {
                            tracking_code: '5040304342'
                        },
                        location: {
                            address:
                                'میدان امام خمینی {ره}  - خیابان امام خمینی  - نرسیده به میدان حسن آباد - بیمارستان سینا'
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
                        status: 'visited',
                        doctor_info: {
                            first_name: 'پزشک',
                            last_name: 'ام آر آی',
                            avatar: '/api/getImage/p24/search-men/noimage.png',
                            slug: 'دکتر-پزشک-ام-آر-آی'
                        },
                        patient_info: {},
                        center_info: {
                            center_id: 'eafb8f64-8ebf-11ea-8b02-005056b09c11',
                            has_paging: false
                        },
                        turn_details: {
                            tracking_code: '3347612209'
                        },
                        location: {
                            address: 'بوشهر'
                        },
                        prescription: {}
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
                    },
                    {
                        status: 'not_visited',
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
                            tracking_code: '9663114078'
                        },
                        location: {
                            address: 'بوشهر'
                        },
                        prescription: {}
                    },
                    {
                        status: 'requested',
                        doctor_info: {
                            first_name: 'واحد',
                            last_name: 'هولتر فشارخون',
                            avatar: '/api/getImage/p24/search-men/noimage.png',
                            slug: 'دکتر-واحد-هولتر-فشارخون'
                        },
                        patient_info: {},
                        center_info: {
                            center_id: '516',
                            has_paging: false
                        },
                        turn_details: {
                            tracking_code: '7454333754'
                        },
                        location: {
                            address: 'انتهای بلوار کشاورز - خیابان دکتر محمد قریب - پلاک 62'
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
                        id: 'b340c259-9c84-11ec-9b06-005056ade667',
                        status: 'expired',
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
                        id: '8afb7f7f-9c87-11ec-9b06-005056ade667',
                        status: 'expired',
                        doctor_info: {
                            first_name: 'شبنم',
                            last_name: 'وثوقی',
                            avatar: '/api/getImage/p24/search-men/58120dfc4c83a5ab95ba404887af7a88.png',
                            expertise: 'متخصص زنان و زایمان',
                            slug: 'دکتر-شبنم-وثوقی-0'
                        },
                        patient_info: {
                            national_code: '4420797282'
                        },
                        center_info: {
                            center_type: '1',
                            center_id: '8ae696d7-a059-11ea-8c9e-005056b09c11',
                            has_paging: false
                        },
                        turn_details: {
                            book_time: '1646548200',
                            waiting_time: 1,
                            tracking_code: '2414356215'
                        },
                        location: {
                            address: 'خیابان شهید بهشتی_برج آرین_طبقه اول',
                            lat: null,
                            lng: null
                        },
                        feedback_url:
                            'https://www.paziresh24.com/doctors-survey/?userID=521016&pname=ببلریب بلربی&pID=8ad044bc-9c87-11ec-9b06-005056ade667&consCode=8afb7f7f-9c87-11ec-9b06-005056ade667&docName=شبنم وثوقی&docID=8b00d573-a059-11ea-8c9e-005056b09c11&docGexp=زنان و زایمان&docSID=1&refID=2414356215&userCell=9223058148&bookDate=۱۴۰۰-۱۲-۱۵&bookTime=۱۰:۰۰&docNameU=شبنم_وثوقی&bookType=وب کلینیک',
                        prescription: {
                            pdf: null
                        }
                    },
                    {
                        id: '05981c8f-96f1-11ec-8b49-005056ade667',
                        status: 'expired',
                        doctor_info: {
                            first_name: 'احسان',
                            last_name: 'اکبرزاده',
                            avatar: '/api/getImage/p24/search-men/8e13a641e5448aedad30cbbc374aa74d.jpg',
                            expertise: 'دکترای پزشکی',
                            slug: 'دکتر-احسان-اکبرزاده'
                        },
                        patient_info: {
                            national_code: '4420797282'
                        },
                        center_info: {
                            center_type: '1',
                            center_id: '9ad83929-0826-4720-a310-d49735948d04',
                            has_paging: false
                        },
                        turn_details: {
                            book_time: '1645872300',
                            tracking_code: '1746443365'
                        },
                        location: {
                            address: 'یزد، خیابان مطهری',
                            lat: '1',
                            lng: '1'
                        },
                        feedback_url:
                            'https://www.paziresh24.com/doctors-survey/?userID=521016&pname=سحر ثنایی&pID=0522bd27-96f1-11ec-8b49-005056ade667&consCode=05981c8f-96f1-11ec-8b49-005056ade667&docName=احسان اکبرزاده&docID=c0340b9b-e467-11ea-bed6-005056b09c11&docGexp=&docSID=1&refID=1746443365&userCell=9104490454&bookDate=۱۴۰۰-۱۲-۰۷&bookTime=۱۴:۱۵&docNameU=احسان_اکبرزاده&bookType=وب کلینیک',
                        prescription: {
                            pdf: null
                        }
                    },
                    {
                        id: '868bdb62-8a4b-11ec-ac8c-000c29e93d8f',
                        status: 'expired',
                        doctor_info: {
                            first_name: 'سیمین',
                            last_name: 'وحیدی',
                            avatar: '/api/getImage/p24/search-women/noimage.png',
                            expertise: 'متخصص اورولوژی',
                            slug: 'دکتر-سیمین-وحیدی-0'
                        },
                        patient_info: {
                            national_code: '4420797282'
                        },
                        center_info: {
                            center_type: '2',
                            center_id: '5547',
                            has_paging: false
                        },
                        turn_details: {
                            book_time: '1644823800',
                            waiting_time: 0,
                            tracking_code: '2677491859'
                        },
                        location: {
                            address:
                                'تهران،ضلع شمالی اتوبان همت، روبروی پارک جوانمردان بیمارستان نیکان غرب',
                            lat: null,
                            lng: null
                        },
                        feedback_url:
                            'https://www.paziresh24.com/doctors-survey/?userID=521016&pname=سحر ثنایی&pID=8688c01c-8a4b-11ec-ac8c-000c29e93d8f&consCode=868bdb62-8a4b-11ec-ac8c-000c29e93d8f&docName=سیمین وحیدی&docID=4d49f611-88d8-11ec-ac8c-000c29e93d8f&docGexp=جراحی کلیه و مجاری ادراری تناسلی&docSID=16&refID=2677491859&userCell=9104490454&bookDate=۱۴۰۰-۱۱-۲۵&bookTime=۱۱:۰۰&docNameU=سیمین_وحیدی&bookType=وب کلینیک',
                        prescription: {
                            pdf: null
                        }
                    },
                    {
                        id: 'bf7d8a5a-8952-11ec-b122-000c29bb9fca',
                        status: 'expired',
                        doctor_info: {
                            first_name: 'هومن',
                            last_name: 'انگورانی',
                            avatar: '/api/getImage/p24/search-men/noimage.png',
                            expertise:
                                'دردهای عضلانی-آسیب ورزشی-حفظ تناسب اندام- طب سوزنی-prp(سلول درمانی)-ازون درمانی',
                            slug: 'دکتر-هومن-انگورانی'
                        },
                        patient_info: {
                            national_code: '4420797282'
                        },
                        center_info: {
                            center_type: '2',
                            center_id: '247',
                            has_paging: false
                        },
                        turn_details: {
                            book_time: '1644815640',
                            waiting_time: 1,
                            tracking_code: '1819326795'
                        },
                        location: {
                            address: 'ستارخان، خیابان نیاش، مجتمع آموزشی درمانی حضرت رسول اکرم (ص)',
                            lat: '35.71951580',
                            lng: '51.36968380'
                        },
                        feedback_url:
                            'https://www.paziresh24.com/doctors-survey/?userID=521016&pname=سحر ثنایی&pID=bdd39eec-8952-11ec-b122-000c29bb9fca&consCode=bf7d8a5a-8952-11ec-b122-000c29bb9fca&docName=هومن انگورانی&docID=2380&docGexp=پزشکی ورزشی&docSID=5&refID=1819326795&userCell=9104490454&bookDate=۱۴۰۰-۱۱-۲۵&bookTime=۰۸:۴۴&docNameU=هومن_انگورانی&bookType=وب کلینیک',
                        prescription: {
                            pdf: null
                        }
                    },
                    {
                        id: '3d4eed1c-8a42-11ec-a23b-000c29f3399f',
                        status: 'expired',
                        doctor_info: {
                            first_name: 'حمید رضا',
                            last_name: 'حاتمی',
                            avatar: '/api/getImage/p24/search-men/b7afaf98c38e677c64941b5a062c08a1.jpg',
                            expertise: 'فوق تخصص ایمونولوژی و آلرژی بالینی',
                            slug: 'دکتر-حمید-رضا-حاتمی'
                        },
                        patient_info: {
                            national_code: '4420797282'
                        },
                        center_info: {
                            center_type: '2',
                            center_id: '5328275b-b6cb-11eb-a8e0-005056b09c11',
                            has_paging: false
                        },
                        turn_details: {
                            book_time: '1644669720',
                            tracking_code: '3135253208'
                        },
                        location: {
                            address: 'خیابان کاشانی، بیمارستان دکتر مجیبیان',
                            lat: '31.871613',
                            lng: '54.377688'
                        },
                        feedback_url:
                            'https://www.paziresh24.com/doctors-survey/?userID=521016&pname=سحر ثنایی&pID=3d4d865a-8a42-11ec-a23b-000c29f3399f&consCode=3d4eed1c-8a42-11ec-a23b-000c29f3399f&docName=حمید رضا حاتمی&docID=ace5d842-b878-11eb-9e93-000c29c3fbc7&docGexp=&docSID=102&refID=3135253208&userCell=9104490454&bookDate=۱۴۰۰-۱۱-۲۳&bookTime=۱۶:۱۲&docNameU=حمید_رضا_حاتمی&bookType=وب کلینیک',
                        prescription: {
                            pdf: null
                        }
                    },
                    {
                        id: '0eac0ab0-88c5-11ec-a39a-000c29986207',
                        status: 'expired',
                        doctor_info: {
                            first_name: 'واحد',
                            last_name: 'هولتر نوار قلب',
                            avatar: '/api/getImage/p24/search-men/noimage.png',
                            expertise: 'کارشناس پرستاری',
                            slug: 'دکتر-واحد-هولتر-نوار-قلب'
                        },
                        patient_info: {
                            national_code: '4420797282'
                        },
                        center_info: {
                            center_type: '2',
                            center_id: '516',
                            has_paging: false
                        },
                        turn_details: {
                            book_time: '1644381000',
                            waiting_time: 1,
                            tracking_code: '3117574070'
                        },
                        location: {
                            address: 'انتهای بلوار کشاورز - خیابان دکتر محمد قریب - پلاک 62',
                            lat: '35.70596800',
                            lng: '51.38291800'
                        },
                        feedback_url:
                            'https://www.paziresh24.com/doctors-survey/?userID=521016&pname=سحر ثنایی&pID=0ea90c5d-88c5-11ec-a39a-000c29986207&consCode=0eac0ab0-88c5-11ec-a39a-000c29986207&docName=واحد هولتر نوار قلب&docID=ee269936-c59f-11ea-9361-0050568946f0&docGexp=پرستاری&docSID=88&refID=3117574070&userCell=9104490454&bookDate=۱۴۰۰-۱۱-۲۰&bookTime=۰۸:۰۰&docNameU=واحد_هولتر_نوار_قلب&bookType=وب کلینیک',
                        prescription: {
                            pdf: null
                        }
                    },
                    {
                        id: 'b34d2ccb-88c1-11ec-915a-005056ade667',
                        status: 'expired',
                        doctor_info: {
                            first_name: 'طیبه',
                            last_name: 'صباغی',
                            avatar: '/api/getImage/p24/search-women/noimage.png',
                            expertise: 'کارشناس مامایی',
                            slug: 'دکتر-طیبه-صباغی'
                        },
                        patient_info: {
                            national_code: '4420797282'
                        },
                        center_info: {
                            center_type: '1',
                            center_id: '118ed547-ef93-11eb-89b2-005056ade667',
                            has_paging: false
                        },
                        turn_details: {
                            book_time: '1644312600',
                            waiting_time: 3,
                            tracking_code: '2978160794'
                        },
                        location: {
                            address: 'خیابان آزادی روبه روی مترو شادمان جنب پست کوچه زمانی پلاک 6',
                            lat: '35.688184648074',
                            lng: '51.393077373505'
                        },
                        feedback_url:
                            'https://www.paziresh24.com/doctors-survey/?userID=521016&pname=سحر ثنایی&pID=b339581c-88c1-11ec-915a-005056ade667&consCode=b34d2ccb-88c1-11ec-915a-005056ade667&docName=طیبه صباغی&docID=8ca81b13-ef83-11eb-8d33-005056ade6b5&docGexp=مامایی&docSID=1&refID=2978160794&userCell=9104490454&bookDate=۱۴۰۰-۱۱-۱۹&bookTime=۱۳:۰۰&docNameU=طیبه_صباغی&bookType=وب کلینیک',
                        prescription: {
                            pdf: null
                        }
                    }
                ]
            })
        );
    })
];
