import FormData from 'form-data';
import { NextApiRequest, NextApiResponse } from 'next';
import { clinicClient, prescriptionClient } from '../../apis/client';

const doctorExpertise = ({
    alias_title,
    degree,
    expertise
}: {
    alias_title: string;
    degree: string;
    expertise: string;
}): string => {
    if (alias_title) {
        return alias_title;
    }

    if (degree && expertise) {
        return degree + ' ' + expertise;
    }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const data = new FormData();
        data.append('certificate', req.cookies.certificate);
        data.append('page', req.query?.page ?? '1');
        data.append('type', 'book_request');

        const books = await clinicClient.post('/getBooks', data, {
            headers: {
                Cookie: req.cookies.P24SESSION,
                ...data.getHeaders()
            }
        });

        const reformattedBooks = Object.keys(books.data.result)
            .filter(key => key !== '#total_count')
            .map(key => books.data.result[key]);

        if (reformattedBooks.length === 0) return res.status(204).json({ data: [] });

        const prescriptions = await prescriptionClient.get('/V1/pdf', {
            params: { identifier: reformattedBooks.map(book => book.book_id) }
        });

        const reformattedResponse = reformattedBooks.map(book => ({
            id: book.book_id,
            status: book.book_delete === '1' ? 'deleted' : book.book_status,
            doctor_info: {
                first_name: book.doctor_name,
                last_name: book.doctor_family,
                avatar: book.doctor_image,
                expertise: doctorExpertise({
                    alias_title: book.expertises?.[0]?.alias_title,
                    degree: book.expertises?.[0]?.degree?.name,
                    expertise: book.expertises?.[0]?.expertise?.name
                }),
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

        res.status(200).json({ data: reformattedResponse });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: 'Something went wrong'
        });
    }
}
