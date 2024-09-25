/* eslint-disable react-refresh/only-export-components */
import { ElementsType, FormElement, FormElementInstance } from '../FormElement';
import { BsTextParagraph } from 'react-icons/bs';
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
import { Textarea } from '../ui/textarea';

const type: ElementsType = 'ParagraphField';

const extraAttr = {
    text: 'Text',
};

const propertiesSchema = z.object({
    text: z.string().min(2),
});

type PropertiesSchemaType = z.infer<typeof propertiesSchema>;

export const ParagraphFieldFormElement: FormElement = {
    type,

    construct: (id: string) => ({
        id,
        type,
        extraAttr,
    }),

    designerBtn: {
        icon: BsTextParagraph,
        label: 'Text Field',
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
    const { text } = element.extraAttr;

    return (
        <div className="flex flex-col gap-2 w-full items-start">
            <Label className="font-semibold text-muted-foreground">
                Paragraph
            </Label>
            <p className="text-justify">{text}</p>
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
    const { text } = element.extraAttr;
    const form = useForm<PropertiesSchemaType>({
        resolver: zodResolver(propertiesSchema),
        mode: 'onBlur',
        defaultValues: {
            text,
        },
    });

    useEffect(() => {
        form.reset(element.extraAttr);
    }, [form, element]);

    const applyChanges = (values: PropertiesSchemaType) => {
        const { text } = values;
        updateElement(element.id, {
            ...element,
            extraAttr: {
                text,
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
                    name="text"
                    render={({ field }) => (
                        <FormItem className="text-left">
                            <FormLabel className="font-semibold">
                                Text
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    rows={5}
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
    const { text } = element.extraAttr;

    return <p className="text-justify">{text}</p>;
}
