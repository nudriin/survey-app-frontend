/* eslint-disable react-refresh/only-export-components */
import { ElementsType, FormElement, FormElementInstance } from '../FormElement';
import { LuHeading2 } from 'react-icons/lu';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
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

const type: ElementsType = 'SubTitleField';

const extraAttr = {
    subTitle: 'Subtitle',
};

const propertiesSchema = z.object({
    subTitle: z.string().min(2).max(225),
});

type PropertiesSchemaType = z.infer<typeof propertiesSchema>;

export const SubTitleFieldFormElement: FormElement = {
    type,

    construct: (id: string) => ({
        id,
        type,
        extraAttr,
    }),

    designerBtn: {
        icon: LuHeading2,
        label: 'Subtitle Field',
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
    const { subTitle } = element.extraAttr;

    return (
        <div className="flex flex-col gap-2 w-full items-start">
            <Label className="font-semibold text-muted-foreground">
                Subtitle
            </Label>
            <p className="text-lg font-semibold">{subTitle}</p>
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
    const { subTitle } = element.extraAttr;
    const form = useForm<PropertiesSchemaType>({
        resolver: zodResolver(propertiesSchema),
        mode: 'onBlur',
        defaultValues: {
            subTitle,
        },
    });

    useEffect(() => {
        form.reset(element.extraAttr);
    }, [form, element]);

    const applyChanges = (values: PropertiesSchemaType) => {
        const { subTitle } = values;
        updateElement(element.id, {
            ...element,
            extraAttr: {
                subTitle,
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
                    name="subTitle"
                    render={({ field }) => (
                        <FormItem className="text-left">
                            <FormLabel className="font-semibold">
                                Subtitle
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
    const { subTitle } = element.extraAttr;

    return <p className="text-lg font-semibold">{subTitle}</p>;
}
