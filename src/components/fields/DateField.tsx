/* eslint-disable react-refresh/only-export-components */
import {
    ElementsType,
    FormElement,
    FormElementInstance,
    SubmitValueFunction,
} from '../FormElement';
import { BsFillCalendarDateFill } from 'react-icons/bs';
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
import { Button } from '../ui/button';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';

const type: ElementsType = 'DateField';

const extraAttr = {
    label: 'Date Input',
    helperText: 'Pilih tanggal',
    required: false,
};

const propertiesSchema = z.object({
    label: z.string().min(2).max(225),
    helperText: z.string().min(2).max(225),
    required: z.boolean().default(false),
});

type PropertiesSchemaType = z.infer<typeof propertiesSchema>;

export const DateFieldFormElement: FormElement = {
    type,

    construct: (id: string) => ({
        id,
        type,
        extraAttr,
    }),

    designerBtn: {
        icon: BsFillCalendarDateFill,
        label: 'Date Field',
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
            return currentValue.length > 0;
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

    return (
        <div className="flex flex-col gap-2 w-full items-start">
            <Label className="font-semibold">
                {label}
                {required && <span className="text-red-500"> *</span>}
            </Label>
            <Button
                variant={'outline'}
                className="w-full justify-start text-left font-normal"
            >
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>Pilih tanggal</span>
            </Button>
            {helperText && (
                <p className="text-muted-foreground text-sm">{helperText}</p>
            )}
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

    const [date, setDate] = useState<Date | undefined>(
        defaultValue ? new Date(defaultValue) : undefined
    );
    const [error, setError] = useState(false);

    useEffect(() => {
        setError(isInvalid === true);
    }, [isInvalid]);
    return (
        <div className="flex flex-col text-left gap-2 w-full items-start">
            <Label className={cn('font-semibold', error && 'text-red-500')}>
                {label}
                {required && <span className="text-red-500"> *</span>}
            </Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={'outline'}
                        className={cn(
                            'w-full justify-start text-left font-normal',
                            !date && 'text-muted-foreground',
                            error && 'border-red-500'
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? (
                            format(date, 'PPP')
                        ) : (
                            <span>Pilih tanggal</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => {
                            setDate(date);
                            if (!submitValue) return;
                            const value = date?.toUTCString() || '';
                            const valid = DateFieldFormElement.validate(
                                element,
                                value
                            );
                            setError(!valid);
                            submitValue(element.id, value);
                        }}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
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
    );
}
