/* eslint-disable react-refresh/only-export-components */
import { ElementsType, FormElement, FormElementInstance } from '../FormElement';
import { LuSeparatorHorizontal } from 'react-icons/lu';
import { Label } from '../ui/label';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import useDesigner from '@/hooks/useDesigner';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';
import { Slider } from '../ui/slider';

const type: ElementsType = 'SpacerField';

const extraAttr = {
    height: 20,
};

const propertiesSchema = z.object({
    height: z.number().min(2).max(225),
});

type PropertiesSchemaType = z.infer<typeof propertiesSchema>;

export const SpacerFieldFormElement: FormElement = {
    type,

    construct: (id: string) => ({
        id,
        type,
        extraAttr,
    }),

    designerBtn: {
        icon: LuSeparatorHorizontal,
        label: 'Spacer Field',
    },

    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,
    validate: () => true,
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
    const { height } = element.extraAttr;

    return (
        <div className="flex flex-col gap-2 w-full items-center">
            <Label className="font-semibold text-muted-foreground">
                Spacer: {height}px
            </Label>
            <LuSeparatorHorizontal className="h-8 w-8" />
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
    const { height } = element.extraAttr;
    const form = useForm<PropertiesSchemaType>({
        resolver: zodResolver(propertiesSchema),
        mode: 'onBlur',
        defaultValues: {
            height,
        },
    });

    useEffect(() => {
        form.reset(element.extraAttr);
    }, [form, element]);

    const applyChanges = (values: PropertiesSchemaType) => {
        const { height } = values;
        updateElement(element.id, {
            ...element,
            extraAttr: {
                height,
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
                    name="height"
                    render={({ field }) => (
                        <FormItem className="text-left">
                            <FormLabel className="font-semibold">
                                Height (px): {form.watch('height')}
                            </FormLabel>
                            <FormControl className="p-2">
                                <Slider
                                    defaultValue={[field.value]}
                                    min={5}
                                    max={225}
                                    step={1}
                                    onValueChange={(val) => {
                                        field.onChange(val[0]);
                                    }}
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
}: {
    elementInstance: FormElementInstance;
}) {
    const element = elementInstance as CustomInstance;
    const { height } = element.extraAttr;

    return <div style={{ height, width: '100%' }}></div>;
}
