import { ElementsType, FormElement, FormElementInstance } from '../FormElement';
import { MdTextFields } from 'react-icons/md';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
const type: ElementsType = 'TextField';

const extraAttr = {
    label: 'Nama',
    helperText: 'Deskripsi, ringkasan, dan lain-lain',
    required: false,
    placeholder: 'Masukan data...',
};

export const TextFieldFormElement: FormElement = {
    type,

    construct: (id: string) => ({
        id,
        type,
        extraAttr,
    }),

    designerBtn: {
        icon: MdTextFields,
        label: 'Text Field',
    },

    designerComponent: DesignerComponent,
    formComponent: () => <div>Form Component</div>,
    propertiesComponent: () => <div>Properties Component</div>,
};

type CustomInstance = FormElementInstance & {
    extraAttr: typeof extraAttr;
};
function DesignerComponent({
    elementInstance,
}: {
    elementInstance: FormElementInstance;
}) {
    const element = elementInstance as CustomInstance;
    const { label, helperText, required, placeholder } = element.extraAttr;

    return (
        <div className="flex flex-col gap-2 w-full items-start">
            <Label className="font-semibold">
                {label}
                {required && '*'}
            </Label>
            <Input
                className="border border-darks2"
                readOnly
                disabled
                placeholder={placeholder}
            />
            {helperText && (
                <p className="text-muted-foreground text-sm">{helperText}</p>
            )}
        </div>
    );
}
