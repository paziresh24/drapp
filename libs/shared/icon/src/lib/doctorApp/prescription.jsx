import { memo } from 'react';

const Prescription = memo(({ color }) => {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.9778 4.34385L14.9557 4.33581C14.956 5.22557 14.9604 5.83485 15.0222 6.29489C15.0843 6.75635 15.1915 6.95385 15.3218 7.08416C15.4521 7.21448 15.6496 7.3217 16.1111 7.38374C16.5941 7.44869 17.2417 7.45028 18.2057 7.45028H18.6294C18.4083 7.1258 18.0102 6.76942 17.1455 6.02484L16.5069 5.47491C15.6309 4.72057 15.3275 4.47365 14.9778 4.34385ZM13.0811 4.2032C13.216 4.2032 13.3405 4.20334 13.4557 4.20381L13.4557 4.25228C13.4557 5.15076 13.4556 5.89998 13.5356 6.49476C13.62 7.12255 13.8057 7.68935 14.2611 8.14482C14.7166 8.60029 15.2834 8.78596 15.9112 8.87037C16.506 8.95033 17.2552 8.95031 18.1537 8.95028L18.2057 8.95028H18.9611C18.9683 9.23159 18.9697 9.57455 18.9697 10.0031V14.5469C18.9697 15.9824 18.9682 16.9835 18.8666 17.7388C18.7679 18.4726 18.5875 18.8612 18.3107 19.1379C18.034 19.4147 17.6454 19.5951 16.9116 19.6938C16.1563 19.7954 15.1552 19.7969 13.7197 19.7969H10.2803C8.84486 19.7969 7.84374 19.7954 7.08839 19.6938C6.35462 19.5951 5.96605 19.4147 5.68928 19.1379C5.41252 18.8612 5.23208 18.4726 5.13342 17.7388C5.03187 16.9835 5.03027 15.9824 5.03027 14.5469V9.4532C5.03027 8.01778 5.03187 7.01667 5.13342 6.26132C5.23208 5.52754 5.41252 5.13897 5.68928 4.86221C5.96605 4.58544 6.35462 4.405 7.08839 4.30634C7.84375 4.20479 8.84486 4.2032 10.2803 4.2032H13.0811ZM13.2088 2.70316C14.1869 2.70274 14.8664 2.70244 15.4999 2.93762C16.1334 3.17279 16.648 3.61637 17.389 4.25493L17.4857 4.33826L18.1243 4.88818L18.2441 4.99128C19.1537 5.77369 19.7861 6.31768 20.1285 7.06439C20.4709 7.8111 20.4704 8.64527 20.4698 9.84506L20.4697 10.0031V14.5469V14.6018C20.4698 15.9694 20.4698 17.0717 20.3532 17.9387C20.2322 18.8388 19.9733 19.5967 19.3714 20.1986C18.7695 20.8005 18.0116 21.0594 17.1115 21.1804C16.2445 21.297 15.1422 21.297 13.7746 21.2969H13.7197H10.2803H10.2254C8.85781 21.297 7.75549 21.297 6.88852 21.1804C5.98841 21.0594 5.23054 20.8005 4.62862 20.1986C4.02671 19.5967 3.76781 18.8388 3.6468 17.9387C3.53024 17.0717 3.53025 15.9694 3.53027 14.6018L3.53027 14.5469V9.4532L3.53027 9.39832C3.53025 8.03073 3.53024 6.92841 3.6468 6.06145C3.76781 5.16134 4.02671 4.40346 4.62862 3.80155C5.23054 3.19963 5.98842 2.94074 6.88852 2.81972C7.75549 2.70316 8.85781 2.70318 10.2254 2.7032L10.2803 2.7032H13.0811L13.2088 2.70316ZM13.4403 12.4363C13.8128 12.1957 14.3043 12.2572 14.6061 12.5821C14.9751 12.9792 14.9194 13.6084 14.4865 13.9346L12.0001 15.808L9.51365 13.9346C9.0807 13.6084 9.02505 12.9792 9.39402 12.5821C9.69586 12.2572 10.1873 12.1957 10.5599 12.4363L11.5932 13.1037C11.8408 13.2636 12.1593 13.2636 12.407 13.1037L13.4403 12.4363ZM15.705 11.5611C14.908 10.7032 13.6102 10.5409 12.6265 11.1763L12.0001 11.5808L11.3737 11.1763C10.3899 10.5409 9.09213 10.7032 8.29508 11.5611C7.32078 12.6098 7.46773 14.2712 8.61099 15.1326L11.369 17.2106C11.7426 17.4922 12.2575 17.4922 12.6311 17.2106L15.3891 15.1326C16.5324 14.2712 16.6793 12.6098 15.705 11.5611Z"
                fill={color}
            />
        </svg>
    );
});

Prescription.defaultProps = {
    color: '#27BDA0'
};

export default Prescription;
