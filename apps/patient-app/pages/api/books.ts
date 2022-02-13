import axios from 'axios';
import FormData from 'form-data';

export default async function handler(req, res) {
    const data = new FormData();
    data.append('certificate', '$2y$10$lGttgXxc3vgPbsZg8EbnvehGTE4aFOdJO3JFVW5Z7H3k6ZM8Yubrq');
    data.append('page', req.query?.page ?? '1');
    data.append('type', '"book_request\'');

    try {
        const books = await axios.post('https://www.paziresh24.com/api/getBooks', data, {
            headers: {
                Cookie: 'P24SESSION=l2ok4nmttnk32f7v43c0fcbpu7',
                ...data.getHeaders()
            }
        });

        const reformatBooks = Object.keys(books.data.result)
            .filter(key => key !== '#total_count')
            .map(key => books.data.result[key]);

        if (reformatBooks.length === 0) return res.status(204).json({ data: [] });

        const prescriptions = await axios.get('https://prescription-api.paziresh24.com/V1/pdf', {
            params: { identifier: reformatBooks.map(book => book.book_id) }
        });

        const reformatResponse = reformatBooks.map(book => ({
            id: book.book_id,
            status: book.book_delete === '1' ? 'deleted' : book.book_status,
            doctor_info: {
                first_name: book.doctor_name,
                last_name: book.doctor_family,
                avatar: book.doctor_image,
                expertise:
                    book.expertises?.[0]?.alias_title ??
                    book.expertises?.[0]?.degree?.name +
                        ' ' +
                        book.expertises?.[0]?.expertise?.name,
                slug: book.doctor_slug
            },
            patient_info: {
                national_code: book.patient_temp_national_code
            },
            center_info: {
                center_type: book.center_type,
                center_id: book.center_id
            },
            turn_details: {
                book_time: book.book_from,
                waiting_time: book.rate_info?.waiting_time,
                tracking_code: book.book_ref_id
            },
            location: {
                address: book.center_address,
                lat: book.center_lat,
                lng: book.center_lon
            },
            feedback_url: book.feedback_link,
            prescription: {
                pdf: prescriptions.data.find(
                    prescription => prescription.identifier === book.book_id
                )?.pdf
            }
        }));

        res.status(200).json({ data: reformatResponse });
    } catch (e) {
        res.status(500).json({
            message: 'Something went wrong',
            results: e
        });
    }
}
