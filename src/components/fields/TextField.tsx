import { ElementsType, FormElement } from '../FormElement';
import { MdTextFields } from 'react-icons/md';
const type: ElementsType = 'TextField';

export const TextFieldFormElement: FormElement = {
    type,

    construct: (id: string) => ({
        id,
        type,
        extraAttr: {
            label: 'Text field',
            helperText: 'Helper text',
            required: false,
            placeholder: 'Input here ...',
        },
    }),

    designerBtn: {
        icon: MdTextFields,
        label: 'Text Field',
    },

    designerComponent: () => <div>Designer Component</div>,
    formComponent: () => <div>Form Component</div>,
    propertiesComponent: () => <div>Properties Component</div>,
};
