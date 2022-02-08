import { useState, useEffect } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import isEmpty from 'lodash/isEmpty';

const Bar = ({ data }) => {
    return (
        <>
            {isEmpty(data) && (
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
            {!isEmpty(data) && (
                <ResponsiveBar
                    data={data.slice().reverse().slice(0, 15).reverse()}
                    keys={['total']}
                    indexBy="starts_at"
                    margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
                    padding={0.2}
                    // colors={{ scheme: 'set3' }}
                    defs={[
                        {
                            id: 'dots',
                            type: 'patternDots',
                            background: '#3f3f79',
                            color: '#3f3f79',
                            size: 3,
                            padding: 7,
                            stagger: true
                        }
                    ]}
                    fill={[
                        {
                            match: {
                                id: 'total'
                            },
                            id: 'dots'
                        }
                    ]}
                    borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                    axisTop={null}
                    axisRight={null}
                    borderRadius={8}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'تاریخ',
                        legendPosition: 'middle',
                        legendOffset: 32
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'نسخه',
                        legendPosition: 'middle',
                        legendOffset: -40
                    }}
                    labelSkipWidth={12}
                    tooltip={function (e) {
                        return (
                            <div
                                style={{
                                    background: '#3b3b3e80',
                                    color: '#fff',
                                    width: '15rem',
                                    fontSize: '1.2rem',
                                    textAlign: 'justify',
                                    padding: '1rem',
                                    borderRadius: '0.6rem',
                                    fontWeight: '500'
                                }}
                            >
                                در تاریخ {e.data.starts_at_with_year} تعداد {e.data.total} نسخه ثبت
                                شده است.
                            </div>
                        );
                    }}
                    labelSkipHeight={12}
                    labelTextColor={{ from: 'color', modifiers: [['brighter', 1.6]] }}
                    barAriaLabel={function (e) {
                        return e.id + ': ' + e.formattedValue + ' in country: ' + e.indexValue;
                    }}
                />
            )}
        </>
    );
};

export default Bar;
