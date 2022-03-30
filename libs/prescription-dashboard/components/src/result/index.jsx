import { resultSchema } from '../../../schemas/result.schema';
import styles from './result.module.scss';
import isEmpty from 'lodash/isEmpty';

const Result = ({ level, data }) => {
    return (
        <>
            <table width="100%" className={styles.dashboard}>
                <colgroup>
                    {resultSchema[level].map(item => (
                        <col key={item.title} span="1" style={{ width: item.meta.width }} />
                    ))}
                </colgroup>
                <thead>
                    <tr className={styles.red}>
                        {resultSchema[level].map(item => (
                            <th className={styles.header} key={item.title}>
                                {item.title}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <tr key={item.starts_at + Math.random() * 10}>
                            {resultSchema[level].map(col => (
                                <td className={styles.rowTable} key={col.field}>
                                    {item[col.field]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {isEmpty(data) && (
                <div
                    style={{
                        position: 'absolute',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        inset: 0,
                        height: '40rem',
                        backgroundColor: '#fff',
                        borderRadius: '1rem'
                    }}
                >
                    <svg
                        width="92"
                        height="93"
                        viewBox="0 0 92 93"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M84.3337 84.8333H7.66699C6.09533 84.8333 4.79199 83.5299 4.79199 81.9583C4.79199 80.3866 6.09533 79.0833 7.66699 79.0833H84.3337C85.9053 79.0833 87.2087 80.3866 87.2087 81.9583C87.2087 83.5299 85.9053 84.8333 84.3337 84.8333Z"
                            fill="#CEE1E8"
                        />
                        <path
                            d="M37.375 15.8334V84.8334H54.625V15.8334C54.625 11.6167 52.9 8.16675 47.725 8.16675H44.275C39.1 8.16675 37.375 11.6167 37.375 15.8334Z"
                            fill="#CEE1E8"
                        />
                        <path
                            opacity="0.4"
                            d="M11.5 38.8334V84.8334H26.8333V38.8334C26.8333 34.6167 25.3 31.1667 20.7 31.1667H17.6333C13.0333 31.1667 11.5 34.6167 11.5 38.8334Z"
                            fill="#CEE1E8"
                        />
                        <path
                            opacity="0.4"
                            d="M65.167 57.9999V84.8333H80.5003V57.9999C80.5003 53.7833 78.967 50.3333 74.367 50.3333H71.3003C66.7003 50.3333 65.167 53.7833 65.167 57.9999Z"
                            fill="#CEE1E8"
                        />
                    </svg>
                    <span
                        style={{
                            fontSize: '1.5rem',
                            marginTop: '1rem',
                            fontWeight: '500',
                            color: '#96a7ae'
                        }}
                    >
                        آماری برای فیلتر انتخابی یافت نشد.
                    </span>
                </div>
            )}
        </>
    );
};

export default Result;
