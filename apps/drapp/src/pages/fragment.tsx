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
import Popover from '../fragment/components/popover';

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

registerComponent(Popover, {
    name: 'Popover',
    displayName: 'Fragment/Popover',
    isDefaultExport: true,
    importPath: '@paziresh24/apps/drapp/fragment/components/popover',
    figmaMappings: [{ figmaComponentName: 'Popover' }],
    props: {
        trigger: 'slot',
        content: 'slot',
        open: {
            type: 'boolean',
            defaultValue: false
        },
        onOpenChange: {
            type: 'eventHandler',
            argTypes: [
                {
                    name: 'open',
                    type: 'boolean'
                }
            ]
        }
    },
    refActions: {
        open: {
            argTypes: [],
            displayName: 'Open'
        },
        close: {
            argTypes: [],
            displayName: 'Close'
        }
    },
    states: {
        open: {
            type: 'writable',
            variableType: 'boolean',
            valueProp: 'open',
            onChangeProp: 'onOpenChange'
        }
    }
});

registerGlobalContext(Fragment, {
    name: 'Fragment',
    props: {
        apiConfig: {
            displayName: 'API Config',
            type: 'object',
            description: `e.g. { withCredentials: true }`,
            helpText:
                'Read about request configuration options at https://axios-http.com/docs/req_config'
        },
        previewApiConfig: {
            displayName: 'Preview API Config',
            type: 'object',
            description: `e.g. { headers: { 'Authorization': 'XXX' } }`,
            editOnly: true,
            helpText:
                'Read about request configuration options at https://axios-http.com/docs/req_config'
        }
    },
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
        },
        apiRequest: {
            displayName: 'API Request',
            parameters: [
                {
                    name: 'method',
                    type: {
                        type: 'choice',
                        options: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
                        defaultValueHint: 'GET',
                        defaultValue: 'GET'
                    }
                },
                {
                    name: 'url',
                    displayName: 'URL',
                    type: {
                        type: 'string',
                        defaultValueHint: '/api/v1/users',
                        required: true
                    }
                },
                {
                    displayName: 'Query Params',
                    name: 'params',
                    type: {
                        type: 'object',
                        description: `e.g. { id: 20 }`,
                        helpText: 'It will append this to the end of the URL as ?key=value.'
                    }
                },
                {
                    displayName: 'Body',
                    name: 'body',
                    type: {
                        type: 'object',
                        helpText: 'It is not applicable for the GET method.',
                        description: `e.g. { id: 20 }`
                    }
                },
                {
                    name: 'config',
                    displayName: 'Request Config',
                    type: {
                        type: 'object',
                        description: `e.g. { headers: { 'Authorization': 'XXX' } }`,
                        helpText:
                            'Read about request configuration options at https://axios-http.com/docs/req_config'
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
