import * as React from 'react';
import { PlasmicCanvasHost, registerComponent } from '@plasmicapp/react-web/lib/host';
import { Calendar, DayValue } from '@hassanmojab/react-modern-calendar-datepicker';
import moment from 'jalali-moment';
import { Timeit } from 'react-timeit';
import axios from 'axios';

export default function PlasmicHost() {
    return <PlasmicCanvasHost />;
}

const DatePicker = ({ onChange, locale, holidays = [], value }: any) => {
    const dateToJson = (value: number) => {
        const date = moment(value * 1000).locale(locale);
        return {
            year: date.year(),
            month: date.month() + 1,
            day: date.date()
        };
    };
    return (
        <Calendar
            onChange={(value: any) => {
                return onChange(
                    moment(`${value?.year}/${value?.month}/${value?.day}`, 'jYYYY/jMM/jDD', locale)
                        .locale('en')
                        .unix()
                );
            }}
            locale={locale}
            customDaysClassName={holidays.map((d: any) => {
                return {
                    ...dateToJson(d),
                    className: 'holiday-style'
                };
            })}
            {...(value && {
                value: dateToJson(value)
            })}
        />
    );
};

const TimePicker = ({ onChange, value = '00:00' }: any) => {
    return (
        <Timeit
            onChange={time => {
                if (value !== time) onChange(time);
            }}
            defualtValue={value}
        />
    );
};

registerComponent(DatePicker, {
    name: 'DatePicker',
    importPath: '',
    props: {
        value: { type: 'number' },
        onChange: {
            type: 'eventHandler',
            argTypes: [
                {
                    name: 'date',
                    type: 'object'
                }
            ]
        },
        locale: {
            defaultValue: 'fa',
            type: 'choice',
            options: ['fa', 'en']
        },
        holidays: {
            defaultValue: [],
            type: 'array',
            helpText: 'Array of day timestamps, e.g., [1710534600, 1710707400].'
        }
    },
    states: {
        value: {
            type: 'writable',
            variableType: 'number',
            valueProp: 'value',
            onChangeProp: 'onChange'
        }
    }
});

registerComponent(TimePicker, {
    name: 'TimePicker',
    importPath: '',
    props: {
        value: { type: 'string', defaultValue: '00:00' },
        onChange: {
            type: 'eventHandler',
            argTypes: [
                {
                    name: 'time',
                    type: 'string'
                }
            ]
        }
    },
    states: {
        value: {
            type: 'writable',
            variableType: 'text',
            valueProp: 'value',
            onChangeProp: 'onChange'
        }
    }
});

const APIRequest = ({
    method,
    provider,
    endpoint,
    params,
    body,
    sendCookies,
    onResponse,
    onLoading
}: any) => {
    React.useEffect(() => {
        fetchRequest();
    }, []);

    const fetchRequest = async () => {
        onLoading(true);

        await axios[method.toLowerCase() as 'get' | 'post' | 'delete' | 'put' | 'patch'](
            `${provider}${endpoint}`,
            ...(method === 'GET'
                ? [
                      {
                          params,
                          withCredentials: sendCookies
                      }
                  ]
                : [
                      body,
                      {
                          params,
                          withCredentials: sendCookies
                      }
                  ])
        )
            .then((res: any) => {
                onResponse(res.data);
                console.log(res.data);
            })
            .catch((err: any) => {
                console.log(err);
            });
        onLoading(false);
    };
    return <></>;
};

registerComponent(APIRequest, {
    name: 'APIRequest',
    importPath: '',
    props: {
        method: {
            type: 'choice',
            options: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH']
        },
        provider: {
            type: 'choice',
            options: [
                'https://apigw.paziresh24.com',
                'https://api.pazires24.com',
                'https://paziresh24.com'
            ]
        },
        endpoint: {
            type: 'string',
            defaultValueHint: '/api/v1/users'
        },
        params: {
            type: 'object',
            helpText: 'Query params'
        },
        body: {
            type: 'object',
            hidden: (props: any) => !props.method || props.method === 'GET'
        },
        sendCookies: {
            type: 'boolean',
            defaultValue: true
        },
        onResponse: {
            type: 'eventHandler',
            argTypes: [
                {
                    name: 'response',
                    type: 'object'
                }
            ]
        },
        onLoading: {
            type: 'eventHandler',
            argTypes: [
                {
                    name: 'loading',
                    type: 'boolean'
                }
            ]
        }
    },
    states: {
        response: {
            type: 'readonly',
            variableType: 'object',
            onChangeProp: 'onResponse'
        },
        loading: {
            type: 'readonly',
            variableType: 'boolean',
            onChangeProp: 'onLoading'
        }
    }
});
