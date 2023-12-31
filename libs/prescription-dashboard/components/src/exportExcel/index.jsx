import styles from './exportExcel.module.scss';
import ReactExport from 'react-export-excel-xlsx-fix';
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const ExportExcel = ({ data, schema }) => {
    return (
        <ExcelFile
            element={
                <button className={styles.excelExportButton}>
                    <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M11.7881 2.70158C11.6571 2.69793 11.5236 2.70958 11.3896 2.73771L4.28613 4.2338C3.24992 4.45254 2.5 5.37523 2.5 6.43498V18.9018C2.5 19.9613 3.2492 20.8848 4.28613 21.1029L11.3896 22.5981C12.4616 22.824 13.5 21.9814 13.5 20.8861V4.4506C13.5 3.49227 12.7049 2.72708 11.7881 2.70158ZM15 4.66837V5.41837V6.16837V19.6684V20.4184V21.1684H19.25C20.4838 21.1684 21.5 20.1521 21.5 18.9184V6.91837C21.5 5.68462 20.4838 4.66837 19.25 4.66837H15ZM17.25 8.16837H18.75C19.164 8.16837 19.5 8.50387 19.5 8.91837C19.5 9.33287 19.164 9.66837 18.75 9.66837H17.25C16.836 9.66837 16.5 9.33287 16.5 8.91837C16.5 8.50387 16.836 8.16837 17.25 8.16837ZM6.26855 9.1674C6.51001 9.17375 6.74414 9.29435 6.88477 9.5131L8 11.2738L9.11523 9.5131C9.34023 9.1631 9.80527 9.06361 10.1553 9.28361C10.5003 9.50861 10.6048 9.97365 10.3848 10.3236L8.88965 12.6684L10.3848 15.0131C10.6048 15.3631 10.5003 15.8281 10.1553 16.0531C10.0303 16.1281 9.89 16.1684 9.75 16.1684C9.505 16.1684 9.26023 16.0436 9.11523 15.8236L8 14.0629L6.88477 15.8236C6.73977 16.0436 6.495 16.1684 6.25 16.1684C6.11 16.1684 5.96973 16.1281 5.84473 16.0531C5.49973 15.8281 5.39523 15.3631 5.61523 15.0131L7.11035 12.6684L5.61523 10.3236C5.39523 9.97365 5.49973 9.50861 5.84473 9.28361C5.97598 9.20111 6.12368 9.16359 6.26855 9.1674ZM17.25 12.1684H18.75C19.164 12.1684 19.5 12.5039 19.5 12.9184C19.5 13.3329 19.164 13.6684 18.75 13.6684H17.25C16.836 13.6684 16.5 13.3329 16.5 12.9184C16.5 12.5039 16.836 12.1684 17.25 12.1684ZM17.25 16.1684H18.75C19.164 16.1684 19.5 16.5039 19.5 16.9184C19.5 17.3329 19.164 17.6684 18.75 17.6684H17.25C16.836 17.6684 16.5 17.3329 16.5 16.9184C16.5 16.5039 16.836 16.1684 17.25 16.1684Z"
                            fill="#fff"
                        />
                    </svg>
                    <span>دریافت Excel</span>
                </button>
            }
        >
            <ExcelSheet data={data} name="Employees">
                {schema.map(column => (
                    <ExcelColumn key={column.filed} label={column.title} value={column.field} />
                ))}
            </ExcelSheet>
        </ExcelFile>
    );
};

export default ExportExcel;
