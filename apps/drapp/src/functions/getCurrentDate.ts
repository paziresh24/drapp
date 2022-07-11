import axios from 'axios';

const getCurrentDate = async (): Promise<Date> => {
    try {
        const res = await axios.get('/api/currentDate.json', {
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
        return new Date(res.headers.date);
    } catch (e) {
        return new Date();
    }
};

export default getCurrentDate;
