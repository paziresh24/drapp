import {
    PlasmicCanvasHost,
    registerComponent,
    registerFunction,
    registerGlobalContext
} from '@plasmicapp/react-web/lib/host';
import { DatePicker } from '@paziresh24/apps/drapp/fragment/components/date-picker';
import { TimePicker } from '@paziresh24/apps/drapp/fragment/components/time-picker';
import { Fragment } from '@paziresh24/apps/drapp/fragment/designSystemGlobalContext';
import plasmicSplunkEvent from '@paziresh24/apps/drapp/fragment/plasmicSplunkEvent';

export default function PlasmicHost() {
    return <PlasmicCanvasHost />;
}

registerComponent(DatePicker, {
    name: 'DatePicker',
    importPath: '@paziresh24/apps/drapp/fragment/components/date-picker',
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
    importPath: '@paziresh24/apps/drapp/fragment/components/time-picker',
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

registerGlobalContext(Fragment, {
    name: 'Fragment',
    props: {},
    providesData: true,
    globalActions: {
        showToast: {
            displayName: 'Show Toast',
            parameters: [
                {
                    name: 'type',
                    type: {
                        type: 'choice',
                        options: ['success', 'error'],
                        defaultValueHint: 'success'
                    }
                },
                {
                    name: 'message',
                    type: {
                        type: 'string',
                        defaultValueHint: 'A message for you!',
                        required: true
                    }
                },
                {
                    name: 'placement',
                    type: {
                        type: 'choice',
                        options: [
                            'top-left',
                            'top-center',
                            'top-right',
                            'bottom-left',
                            'bottom-center',
                            'bottom-right'
                        ],
                        defaultValueHint: 'top-right'
                    }
                },
                {
                    name: 'duration',
                    type: {
                        type: 'number',
                        defaultValueHint: 3000
                    }
                }
            ]
        }
    },
    importPath: '@paziresh24/apps/drapp/fragment/designSystemGlobalContext'
});

registerFunction(plasmicSplunkEvent, {
    name: 'splunkEvent',
    isDefaultExport: true,
    importPath: '@paziresh24/apps/drapp/fragment/plasmicSplunkEvent',
    description: 'splunk event',
    typescriptDeclaration: `({
    token,
    group,
    type,
    data,
  }: {
    token: string;
    group: string;
    type: string;
    data: Record<string, any>;
  }):void`
});
