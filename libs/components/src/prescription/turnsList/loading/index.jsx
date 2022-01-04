import { Default, Mobile } from '@paziresh24/hooks/device';
import styles from './loading.module.scss';

const Loading = () => {
    const show10Row = () => {
        const row = [];

        for (let a = 10; a > 0; a--) {
            row.push(
                <tr key={a} className={styles.loadingTable}>
                    <td>
                        <div
                            className="skeleton"
                            style={{ width: '70%', background: `rgb(219,223,229,${a * 10 + 20}%)` }}
                        />
                    </td>
                    <td>
                        <div
                            className="skeleton"
                            style={{ width: '70%', background: `rgb(219,223,229,${a * 10 + 20}%)` }}
                        />
                    </td>
                    <td>
                        <div
                            className="skeleton"
                            style={{ width: '70%', background: `rgb(219,223,229,${a * 10 + 20}%)` }}
                        />
                    </td>
                    <td>
                        <div
                            className="skeleton"
                            style={{ width: '70%', background: `rgb(219,223,229,${a * 10 + 20}%)` }}
                        />
                    </td>
                    <td>
                        <div
                            className="skeleton"
                            style={{ width: '50%', background: `rgb(219,223,229,${a * 10 + 20}%)` }}
                        />
                    </td>
                    <td>
                        <div
                            className="skeleton"
                            style={{
                                width: '50%',
                                background: `rgb(219,223,229,${a * 10 + 20}%)`,
                                float: 'left',
                                marginLeft: '1rem'
                            }}
                        />
                    </td>
                </tr>
            );
        }

        return row;
    };

    const show10RowMobile = () => {
        const row = [];

        for (let a = 4; a > 0; a--) {
            row.push(
                <div
                    key={a}
                    className="bg-white w-full flex flex-col space-y-6"
                    style={{ padding: '1.5rem' }}
                >
                    <div
                        className="skeleton"
                        style={{ width: '70%', background: `rgb(219,223,229,${a * 10 + 20}%)` }}
                    />
                    <div className="flex justify-between" style={{ gap: '1rem' }}>
                        <div
                            className="skeleton"
                            style={{ width: '50%', background: `rgb(219,223,229,${a * 10 + 20}%)` }}
                        />
                        <div
                            className="skeleton"
                            style={{ width: '50%', background: `rgb(219,223,229,${a * 10 + 20}%)` }}
                        />
                    </div>
                    <div className="flex justify-between" style={{ gap: '1rem' }}>
                        <div
                            className="skeleton"
                            style={{ width: '50%', background: `rgb(219,223,229,${a * 10 + 20}%)` }}
                        />
                        <div
                            className="skeleton"
                            style={{ width: '50%', background: `rgb(219,223,229,${a * 10 + 20}%)` }}
                        />
                    </div>
                    <div className="flex justify-between" style={{ gap: '1rem' }}>
                        <div
                            className="skeleton"
                            style={{
                                width: '50%',
                                background: `rgb(219,223,229,${a * 10 + 20}%)`,
                                height: '3.5rem',
                                borderRadius: '0.6rem'
                            }}
                        />
                        <div
                            className="skeleton"
                            style={{
                                width: '50%',
                                background: `rgb(219,223,229,${a * 10 + 20}%)`,
                                height: '3.5rem',
                                borderRadius: '0.6rem'
                            }}
                        />
                    </div>
                </div>
            );
        }

        return row;
    };
    return (
        <>
            <Default>{show10Row()}</Default>
            <Mobile>{show10RowMobile()}</Mobile>
        </>
    );
};

export default Loading;
