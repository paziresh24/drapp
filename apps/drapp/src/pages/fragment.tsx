import { PlasmicCanvasHost, registerComponent } from '@plasmicapp/react-web/lib/host';
import { DatePicker } from '@paziresh24/apps/drapp/fragment/components/date-picker';
import { TimePicker } from '@paziresh24/apps/drapp/fragment/components/time-picker';

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
