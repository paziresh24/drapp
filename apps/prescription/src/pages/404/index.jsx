import styles from 'assets/styles/pages/notFound/index.module.scss';
import Error from 'components/core/error';

const NotFoundPage = () => {
    return (
        <Error code={404} error="Page Not Found" message="صفحه پیدا نشد." />
        // <div className={styles['wrapper']}>
        //     <svg
        //         width="380px"
        //         height="500px"
        //         viewBox="0 0 837 1100"
        //         version="1.1"
        //         xmlns="http://www.w3.org/2000/svg"
        //         xmlnsXlink="http://www.w3.org/1999/xlink"
        //         xmlnssketch="http://www.bohemiancoding.com/sketch/ns"
        //     >
        //         <g
        //             id={styles['page-1']}
        //             stroke="none"
        //             strokeWidth="1"
        //             fill="none"
        //             fillRule="evenodd"
        //             sketchtype="MSPage"
        //         >
        //             <path
        //                 d="M353,9 L626.664028,170 L626.664028,487 L353,642 L79.3359724,487 L79.3359724,170 L353,9 Z"
        //                 id={styles['Polygon-1']}
        //                 stroke="#007FB2"
        //                 strokeWidth="6"
        //                 sketchtype="MSShapeGroup"
        //             />
        //             <path
        //                 d="M78.5,529 L147,569.186414 L147,648.311216 L78.5,687 L10,648.311216 L10,569.186414 L78.5,529 Z"
        //                 id={styles['Polygon-2']}
        //                 stroke="#EF4A5B"
        //                 strokeWidth="6"
        //                 sketchtype="MSShapeGroup"
        //             />
        //             <path
        //                 d="M773,186 L827,217.538705 L827,279.636651 L773,310 L719,279.636651 L719,217.538705 L773,186 Z"
        //                 id={styles['Polygon-3']}
        //                 stroke="#795D9C"
        //                 strokeWidth="6"
        //                 sketchtype="MSShapeGroup"
        //             />
        //             <path
        //                 d="M639,529 L773,607.846761 L773,763.091627 L639,839 L505,763.091627 L505,607.846761 L639,529 Z"
        //                 id={styles['Polygon-4']}
        //                 stroke="#F2773F"
        //                 strokeWidth="6"
        //                 sketchtype="MSShapeGroup"
        //             />
        //             <path
        //                 d="M281,801 L383,861.025276 L383,979.21169 L281,1037 L179,979.21169 L179,861.025276 L281,801 Z"
        //                 id={styles['Polygon-5']}
        //                 stroke="#36B455"
        //                 strokeWidth="6"
        //                 sketchtype="MSShapeGroup"
        //             />
        //         </g>
        //     </svg>
        //     <div className={styles['message-box']}>
        //         <h1>404</h1>
        //         <p>صفحه پیدا نشد.</p>
        //     </div>
        // </div>
    );
};

export default NotFoundPage;
