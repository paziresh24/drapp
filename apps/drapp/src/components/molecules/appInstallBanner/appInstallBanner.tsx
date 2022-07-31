import { Button } from '@mui/material';
import { CloseIcon } from '@paziresh24/shared/icon';
import Modal from '@paziresh24/shared/ui/modal';
import { MouseEvent, useState } from 'react';
import { getMobileOS } from '@paziresh24/shared/utils/getMobileOS';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';
import { installPwaSteps } from './installPwaSteps';

export const AppInstallBanner = () => {
    const [shouldShowBanner, setShouldShowBanner] = useState(
        !decodeURIComponent(location.href).includes('source=pwa')
    );
    const [shouldShowAppsModal, setShouldShowAppsModal] = useState(false);
    const [shouldShowPwaModal, setShouldShowPwaModal] = useState(false);

    const appMarkets = [
        {
            name: 'کافه بازار',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26">
                    <defs>
                        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="a">
                            <stop stopColor="#98D700" offset="0%" />
                            <stop stopColor="#009A53" offset="100%" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M13.05 0c1.158 0 2.256.57 3.094 1.606.754.933 1.19 1.984 1.605 3.007l.04.1c.113.279.22.542.331.802.21.487.409.95.6 1.403l.132.011c.946.084 1.763.186 2.47.3.56.09 1.05.188 1.479.29 1.431.337 2.177.713 2.562.988l.002.002a.46.46 0 0 1 .186.434l-.181 1.37c-.323 2.403-.717 5.427-1.735 8.17-.144.385-.299.764-.468 1.134a11.225 11.225 0 0 1-7.561 6.088 11.236 11.236 0 0 1-5.127 0 11.234 11.234 0 0 1-7.474-5.933 16.786 16.786 0 0 1-.59-1.43c-.45-1.237-.774-2.529-1.024-3.793C1.059 12.876.859 11.253.67 9.87l-.124-.924a.463.463 0 0 1 .186-.436l.006-.004c.384-.275 1.13-.651 2.561-.989.428-.101.916-.199 1.475-.288a34.652 34.652 0 0 1 2.474-.3c.043-.005.087-.008.131-.012.192-.453.39-.916.6-1.403.112-.26.219-.523.332-.802l.04-.102c.414-1.023.852-2.073 1.605-3.005C10.794.57 11.892 0 13.05 0zm0 2.23c-.636 0-1.125.487-1.36.778a5.36 5.36 0 0 0-.488.726c-.314.552-.564 1.172-.824 1.816-.113.277-.23.565-.352.848l-.158.368a80.72 80.72 0 0 1 3.182-.06c1.163 0 2.22.022 3.181.06l-.157-.368a40.528 40.528 0 0 1-.352-.848c-.26-.644-.511-1.263-.824-1.815a5.29 5.29 0 0 0-.488-.727c-.236-.29-.725-.778-1.36-.778z"
                        fill="url(#a)"
                        fillRule="nonzero"
                    />
                </svg>
            ),
            operatingSystem: ['Android'],
            onClick: () => {
                window.open('https://cafebazaar.ir/app/com.paziresh24.dr/');
                getSplunkInstance().sendEvent({
                    group: 'pwa',
                    type: 'bazaar',
                    event: {
                        event_action: 'click'
                    }
                });
            }
        },
        {
            name: 'سیب ایرانی',
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="26"
                    viewBox="0 0 26 26"
                    fill="none"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13.5096 4.49475C14.0254 3.92224 14.5385 3.34976 15.0563 2.77191L15.0565 2.77168C15.8666 1.86778 16.6884 0.95076 17.551 0C17.6907 0.23923 17.8254 0.471129 17.9606 0.703753C18.1941 1.10564 18.4289 1.50969 18.6924 1.95745C16.9522 2.9361 15.2667 3.87849 13.563 4.82101C13.5096 4.83915 13.4182 4.80288 13.3634 4.76661C13.3538 4.75626 13.3611 4.72225 13.3692 4.68484C13.3742 4.66166 13.3794 4.63716 13.3811 4.61619C13.3746 4.55526 13.3623 4.49437 13.3502 4.43489C13.3267 4.31924 13.3044 4.20894 13.3283 4.11408C13.5883 3.25732 13.8576 2.40055 14.1415 1.49713C14.272 1.08194 14.4056 0.656892 14.5428 0.217463C14.7637 0.379019 14.9725 0.528605 15.1751 0.673707C15.4044 0.837926 15.6256 0.996402 15.8473 1.15999C15.032 2.3017 14.2701 3.38916 13.5096 4.49475ZM21.338 14.2454C21.629 11.6899 23.4957 11.0375 25.8152 10.8924C25.6695 10.6016 25.5394 10.3218 25.4141 10.0522L25.4141 10.0521C25.1802 9.54905 24.9629 9.08167 24.692 8.6451C22.8969 5.72713 17.9671 4.42221 14.9954 6.03526C13.944 6.61526 12.766 6.79645 11.7876 6.16206C9.95737 4.96594 8.0906 5.27407 6.20554 5.69086C3.23275 6.32526 1.34784 8.13764 0.804255 11.1461C0.0249317 15.4778 0.985451 19.4288 3.61342 22.9448C4.84622 24.6122 6.54994 25.6453 8.59805 25.9353C9.32199 26.0441 10.1921 25.9353 10.8261 25.5909C12.5115 24.6666 14.0353 24.6666 15.7025 25.609C16.2816 25.9353 17.097 26.0621 17.7675 25.9716C19.5443 25.7541 21.0849 24.9385 22.336 23.6336C23.8036 22.0931 24.6737 20.2444 25.2711 18.3414C24.9814 18.2101 24.6882 18.0904 24.3978 17.9718L24.3978 17.9717L24.3977 17.9717C23.7259 17.6973 23.0683 17.4287 22.4991 17.0365C21.5924 16.4021 21.2115 15.3509 21.338 14.2454ZM15.829 8.19204C17.7675 7.24951 20.5775 7.68458 22.2264 9.26136C17.8406 11.8349 18.0036 17.3265 22.2081 19.7551C21.2297 21.658 19.9787 23.2529 17.6775 23.6154C17.2966 23.688 16.8257 23.6154 16.4813 23.4341C14.3066 22.2924 12.1685 22.2924 9.99252 23.4161C9.64812 23.5973 9.17721 23.6698 8.79626 23.6154C7.29215 23.4341 6.13245 22.6368 5.28059 21.4405C3.14223 18.432 2.4353 15.0609 3.08783 11.4361C3.41409 9.69628 4.51954 8.53629 6.24068 8.0651C7.79961 7.64831 9.28685 7.37645 10.8626 8.26443C12.4581 9.15256 14.1984 8.98949 15.829 8.19204Z"
                        fill="#00c760"
                    />
                </svg>
            ),
            badge: 'رایگان',
            operatingSystem: ['iOS'],
            onClick: () => {
                window.open('https://sibirani.com/apps/dr-paziresh24-com/');
                getSplunkInstance().sendEvent({
                    group: 'pwa',
                    type: 'sibirani',
                    event: {
                        event_action: 'click'
                    }
                });
            }
        },
        {
            name: 'وب اپلیکیشن',
            icon: (
                <svg viewBox="0 0 24 24" width="26" height="36">
                    <path
                        d="M12.005 1.5h.13a10.44 10.44 0 0 1 4.3.982 10.554 10.554 0 0 1 4.972 4.852 10.469 10.469 0 0 1 .991 6.133c-.15 1.07-.465 2.11-.934 3.084a10.552 10.552 0 0 1-5.496 5.171 10.495 10.495 0 0 1-3.948.778h-.04a10.495 10.495 0 0 1-10.377-9.033 10.55 10.55 0 0 1 .085-3.453c.187-.972.511-1.912.963-2.793a10.544 10.544 0 0 1 4.913-4.74 10.44 10.44 0 0 1 4.3-.98l.132-.001h.008Zm-.706 19.462v-4.763H8.293c.098.387.21.77.34 1.147.103.294.216.585.342.87a8.9 8.9 0 0 0 .346.699 6.4 6.4 0 0 0 .548.852c.125.165.26.322.403.471.292.299.638.569 1.03.724H11.3Zm4.409-4.763H12.7v4.763c.39-.155.737-.425 1.029-.724a5.23 5.23 0 0 0 .403-.471c.22-.293.416-.602.588-.925a10.841 10.841 0 0 0 .68-1.589c.117-.346.219-.698.307-1.053h.001Zm4.366 0h-2.927a14.816 14.816 0 0 1-.565 1.908c-.122.323-.255.642-.404.954-.113.237-.235.47-.366.698a8.4 8.4 0 0 1-.45.698l.075-.03a9.147 9.147 0 0 0 4.637-4.227Zm-13.221 0H3.926a9.147 9.147 0 0 0 4.636 4.227c.025.012.05.021.075.031a8.4 8.4 0 0 1-.45-.698 10.05 10.05 0 0 1-.365-.698c-.148-.312-.282-.63-.403-.954-.231-.622-.42-1.26-.566-1.907ZM3.347 9.18a9.125 9.125 0 0 0 0 5.641.513.513 0 0 1 .03-.008c.06-.01.075-.01.136-.012 1.027 0 2.053-.01 3.08-.023-.26-1.85-.26-3.727.003-5.577H3.513c-.062-.003-.076-.001-.136-.013a.555.555 0 0 1-.03-.008Zm17.307 0a.587.587 0 0 1-.03.008c-.06.012-.075.01-.136.013h-3.083c.258 1.824.263 3.675.014 5.5 1.045.02 2.091.052 3.137.104.045.005.065.007.098.015a9.07 9.07 0 0 0 .358-1.547 9.171 9.171 0 0 0-.358-4.093ZM11.3 14.707V9.199H8.011a18.49 18.49 0 0 0-.006 5.558c1.098-.016 2.196-.036 3.295-.05Zm4.688-5.508H12.7v5.49c1.102-.01 2.205-.014 3.307-.006l.014-.1a18.538 18.538 0 0 0-.033-5.383ZM8.637 3.543A9.132 9.132 0 0 0 3.927 7.8c.977-.002 1.955-.012 2.932-.025l.017-.073c.188-.818.448-1.619.777-2.391.107-.247.222-.49.347-.728.189-.36.402-.708.638-1.04h-.001Zm6.726 0c.236.332.449.68.637 1.04.125.238.24.481.347.728.332.768.585 1.57.775 2.385.982.016 1.961.043 2.941.085a9.15 9.15 0 0 0-4.7-4.237ZM11.3 3.038c-.433.17-.808.48-1.12.82a5.35 5.35 0 0 0-.443.554 7.91 7.91 0 0 0-.574.973c-.121.24-.231.486-.331.735a12.68 12.68 0 0 0-.528 1.633c.999-.015 1.998-.032 2.996-.046v-4.67.001Zm1.4 0V7.69c.993-.01 1.985-.015 2.977-.01a12.672 12.672 0 0 0-.509-1.56c-.1-.249-.21-.494-.33-.735a7.731 7.731 0 0 0-.574-.973 5.881 5.881 0 0 0-.444-.555c-.313-.339-.688-.649-1.12-.819Z"
                        fillRule="evenodd"
                    ></path>
                </svg>
            ),
            operatingSystem: ['Android', 'iOS'],
            onClick: () => {
                setShouldShowAppsModal(false);
                setShouldShowPwaModal(true);
                getSplunkInstance().sendEvent({
                    group: 'pwa',
                    type: 'webapp',
                    event: {
                        event_action: 'click'
                    }
                });
            }
        }
    ];

    const hideBanner = (e: MouseEvent<SVGSVGElement>) => {
        e.stopPropagation();
        setShouldShowBanner(false);
    };

    return (
        <>
            {shouldShowBanner && (
                <div
                    className="fixed bottom-0 bg-white shadow-inner  w-full h-16 flex items-center justify-between px-4 z-50"
                    onClick={() => setShouldShowAppsModal(true)}
                >
                    <div className="flex items-center space-s-3">
                        <img width="35" height="35" src="icons-192.png" alt="" />
                        <span className="text-sm font-semibold">اپلیکیشن مدیریت مطب</span>
                        <button className="bg-black px-4 rounded-full">
                            <span className="text-white text-sm font-medium">نصب</span>
                        </button>
                    </div>
                    <CloseIcon color="#000" onClick={hideBanner} />
                </div>
            )}

            <Modal
                title="نصب اپلیکیشن"
                onClose={setShouldShowAppsModal}
                isOpen={shouldShowAppsModal}
            >
                <div className="flex flex-col items-center space-y-2">
                    {appMarkets.map(
                        (appMarket, index) =>
                            appMarket.operatingSystem.includes(getMobileOS()) && (
                                <div
                                    key={index}
                                    className="flex items-center space-s-3 h-14 px-4 w-full border border-solid border-gray-200 rounded-lg"
                                    onClick={appMarket.onClick}
                                >
                                    {appMarket.icon}
                                    <span className="font-medium">{appMarket.name}</span>
                                    {appMarket.badge && (
                                        <span className="bg-red-500 px-2 rounded-full text-white text-sm font-medium">
                                            {appMarket.badge}
                                        </span>
                                    )}
                                </div>
                            )
                    )}
                </div>
            </Modal>

            <Modal
                title="وب اپلیکیشن"
                onClose={setShouldShowPwaModal}
                isOpen={shouldShowPwaModal}
                noHeader
            >
                <div className="flex flex-col items-center space-y-2 border-b border-solid border-b-gray-300 pb-4">
                    <img width="50" height="50" src="icons-192.png" alt="" />
                    <span className="font-semibold">نصب نسخه وب اپلیکیشن</span>
                </div>
                <ul className="flex flex-col space-y-5 mb-4">
                    {installPwaSteps[getMobileOS()].map((step, index) => (
                        <li key={index} className="flex items-center space-s-2">
                            {step.icon && <img src={step.icon} alt="" />}
                            <span className="font-medium">{step.description}</span>
                        </li>
                    ))}
                </ul>
                <Button variant="contained" onClick={() => setShouldShowPwaModal(false)}>
                    متوجه شدم
                </Button>
            </Modal>
        </>
    );
};

export default AppInstallBanner;
