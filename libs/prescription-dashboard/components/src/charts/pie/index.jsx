import { ResponsivePie } from '@nivo/pie';

const Pie = ({ data, fill, defs, colors }) => {
    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {data[0]?.value === 0 && data[1]?.value === 0 && (
                <div
                    style={{
                        position: 'absolute',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        inset: 0
                    }}
                >
                    <svg
                        width="80"
                        height="80"
                        viewBox="0 0 98 99"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M85.75 49.5C85.75 29.2035 69.2965 12.75 49 12.75V49.5H85.75Z"
                            fill="#EBF3F6"
                        />
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M49 10.5C47.7574 10.5 46.75 11.5074 46.75 12.75V49.5C46.75 50.7426 47.7574 51.75 49 51.75H85.75C86.9926 51.75 88 50.7426 88 49.5C88 27.9609 70.5391 10.5 49 10.5ZM51.25 47.25V15.0722C68.5113 16.1834 82.3166 29.9887 83.4278 47.25H51.25ZM37.6321 16.9161C38.8054 16.5068 39.4247 15.2239 39.0154 14.0506C38.6061 12.8773 37.3232 12.2579 36.1499 12.6672C34.6085 13.2049 33.1114 13.8365 31.6653 14.5552C18.8292 20.9342 10 34.1839 10 49.5C10 71.0391 27.4609 88.5 49 88.5C65.9844 88.5 80.4275 77.6443 85.7802 62.4998C86.1944 61.3282 85.5803 60.0427 84.4087 59.6286C83.237 59.2145 81.9516 59.8286 81.5375 61.0002C76.8003 74.403 64.018 84 49 84C29.9462 84 14.5 68.5538 14.5 49.5C14.5 35.9574 22.3027 24.233 33.668 18.585C34.9465 17.9496 36.2699 17.3913 37.6321 16.9161Z"
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
            {(data[0]?.value > 0 || data[1]?.value > 0) && (
                <ResponsivePie
                    data={data}
                    margin={{ top: 20, right: 0, bottom: 20, left: 0 }}
                    innerRadius={0.6}
                    padAngle={5}
                    cornerRadius={10}
                    activeOuterRadiusOffset={8}
                    borderWidth={1}
                    borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                    arcLinkLabelsSkipAngle={10}
                    arcLinkLabelsTextColor="#333333"
                    arcLinkLabelsThickness={2}
                    arcLinkLabelsColor={{ from: 'color' }}
                    arcLabelsSkipAngle={10}
                    arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                    defs={defs}
                    fill={fill}
                    colors={colors}
                    // legends={[
                    //     {
                    //         anchor: 'bottom',
                    //         direction: 'row',
                    //         justify: false,
                    //         translateX: 0,
                    //         translateY: 56,
                    //         itemsSpacing: 0,
                    //         itemWidth: 100,
                    //         itemHeight: 18,
                    //         itemTextColor: '#999',
                    //         itemDirection: 'left-to-right',
                    //         itemOpacity: 1,
                    //         symbolSize: 18,
                    //         symbolShape: 'circle',
                    //         effects: [
                    //             {
                    //                 on: 'hover',
                    //                 style: {
                    //                     itemTextColor: '#000'
                    //                 }
                    //             }
                    //         ]
                    //     }
                    // ]}
                />
            )}
        </div>
    );
};

export default Pie;
