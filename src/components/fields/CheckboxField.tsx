/* eslint-disable react-refresh/only-export-components */
import {
    ElementsType,
    FormElement,
    FormElementInstance,
    SubmitValueFunction,
} from '../FormElement';
import { IoMdCheckbox } from 'react-icons/io';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import useDesigner from '@/hooks/useDesigner';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';
import { Switch } from '../ui/switch';
import { cn } from '@/lib/utils';
import { Checkbox } from '../ui/checkbox';

const type: ElementsType = 'CheckboxField';

const extraAttr = {
    label: 'Checkbox Input',
    helperText: 'Deskripsi, ringkasan, dan lain-lain',
    required: false,
};

const propertiesSchema = z.object({
    label: z.string().min(2).max(225),
    helperText: z.string().min(2).max(225),
    required: z.boolean().default(false),
});

type PropertiesSchemaType = z.infer<typeof propertiesSchema>;

export const CheckboxFieldFormElement: FormElement = {
    type,

    construct: (id: string) => ({
        id,
        type,
        extraAttr,
    }),

    designerBtn: {
        icon: IoMdCheckbox,
        label: 'Checkbox Field',
    },

    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,
    validate: (
        formElement: FormElementInstance,
        currentValue: string
    ): boolean => {
        const element = formElement as CustomInstance;
        if (element.extraAttr.required) {
            return currentValue === 'true';
        }

        return true;
    },
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
    const { label, helperText, required } = element.extraAttr;
    const id = `checkbox-${element.id}`;

    return (
        <div className="flex items-top space-x-2">
            <Checkbox id={id} />
            <div className="grid gap-1.5 leading-none">
                <Label htmlFor={id} className="font-semibold text-left">
                    {label}
                    {required && <span className="text-red-500"> *</span>}
                </Label>
                {helperText && (
                    <p className="text-muted-foreground text-sm text-left">
                        {helperText}
                    </p>
                )}
            </div>
        </div>
    );
}

function PropertiesComponent({
    elementInstance,
}: {
    elementInstance: FormElementInstance;
}) {
    const element = elementInstance as CustomInstance;
    const { updateElement } = useDesigner();
    const { label, helperText, required } = element.extraAttr;
    const form = useForm<PropertiesSchemaType>({
        resolver: zodResolver(propertiesSchema),
        mode: 'onBlur',
        defaultValues: {
            label: label,
            helperText: helperText,
            required: required,
        },
    });

    useEffect(() => {
        form.reset(element.extraAttr);
    }, [form, element]);

    const applyChanges = (values: PropertiesSchemaType) => {
        const { label, helperText, required } = values;
        updateElement(element.id, {
            ...element,
            extraAttr: {
                label,
                helperText,
                required,
            },
        });
    };
    return (
        <Form {...form}>
            <form
                onBlur={form.handleSubmit(applyChanges)}
                className="space-y-3"
                onSubmit={(e) => {
                    e.preventDefault();
                }}
            >
                <FormField
                    control={form.control}
                    name="label"
                    render={({ field }) => (
                        <FormItem className="text-left">
                            <FormLabel className="font-semibold">
                                Label
                            </FormLabel>
                            <FormControl>
                                <Input
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter')
                                            e.currentTarget.blur();
                                    }}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Label dari field.
                                <br /> akan ditampilkan diatas field
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="helperText"
                    render={({ field }) => (
                        <FormItem className="text-left">
                            <FormLabel className="font-semibold">
                                Helper Text
                            </FormLabel>
                            <FormControl>
                                <Input
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter')
                                            e.currentTarget.blur();
                                    }}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Helper Text berisi text deskripsi, ringkasan
                                atau petunjuk.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="required"
                    render={({ field }) => (
                        <FormItem className="text-left flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel className="font-semibold">
                                    Required
                                </FormLabel>
                                <FormDescription>
                                    Required digunakan untuk menentukan sebuah
                                    field bersifat wajib.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
}

function FormComponent({
    elementInstance,
    submitValue,
    isInvalid,
    defaultValue,
}: {
    elementInstance: FormElementInstance;
    submitValue?: SubmitValueFunction;
    isInvalid?: boolean;
    defaultValue?: string;
}) {
    const element = elementInstance as CustomInstance;
    const { label, helperText, required } = element.extraAttr;

    const [value, setValue] = useState<boolean>(
        defaultValue === 'true' ? true : false
    );
    const [error, setError] = useState(false);

    useEffect(() => {
        setError(isInvalid === true);
    }, [isInvalid]);
    const id = `checkbox-${element.id}`;

    return (
        <div className="flex items-top space-x-2">
            <Checkbox
                id={id}
                checked={value}
                className={cn(error && 'border-red-500')}
                onCheckedChange={(checked) => {
                    let val = false;
                    if (checked === true) val = true;

                    setValue(val);
                    if (!submitValue) return;

                    const stringValue = val ? 'true' : 'false';
                    const valid = CheckboxFieldFormElement.validate(
                        element,
                        stringValue
                    );
                    setError(!valid);
                    submitValue(element.id, stringValue);
                }}
            />
            <div className="grid gap-1.5 leading-none">
                <Label htmlFor={id} className="font-semibold text-left">
                    {label}
                    {required && <span className="text-red-500"> *</span>}
                </Label>
                {helperText && (
                    <p
                        className={cn(
                            'text-muted-foreground text-sm',
                            error && 'text-red-500'
                        )}
                    >
                        {helperText}
                    </p>
                )}
            </div>
        </div>
    );
}
