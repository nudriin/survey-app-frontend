/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { ElementsType, FormElement, FormElementInstance } from '../FormElement';
import { RiSeparator } from 'react-icons/ri';
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
import { Separator } from '../ui/separator';

const type: ElementsType = 'SeparatorField';

export const SeparatorFieldFormElement: FormElement = {
    type,

    construct: (id: string) => ({
        id,
        type,
    }),

    designerBtn: {
        icon: RiSeparator,
        label: 'Separator Field',
    },

    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,
    validate: () => true,
};

function DesignerComponent({
    elementInstance,
}: {
    elementInstance: FormElementInstance;
}) {
    return (
        <div className="flex flex-col gap-2 w-full items-start">
            <Label className="font-semibold text-muted-foreground">
                Separator
            </Label>
            <Separator />
        </div>
    );
}

function PropertiesComponent({
    elementInstance,
}: {
    elementInstance: FormElementInstance;
}) {
    return <p>No properties</p>;
}

function FormComponent({
    elementInstance,
}: {
    elementInstance: FormElementInstance;
}) {
    return <Separator />;
}
