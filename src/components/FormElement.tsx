import React from 'react';
import { TextFieldFormElement } from './fields/TextField';

export type ElementsType = 'TextField';

export type FormElement = {
    type: ElementsType;

    construct: (id: string) => FormElementInstance;

    designerBtn: {
        icon: React.ElementType;
        label: string;
    };
    designerComponent: React.FC<{
        elementInstance: FormElementInstance;
    }>;
    formComponent: React.FC<{
        elementInstance: FormElementInstance;
    }>;
    propertiesComponent: React.FC<{
        elementInstance: FormElementInstance;
    }>;
};

export type FormElementInstance = {
    id: string;
    type: ElementsType;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    extraAttr?: Record<string, any>;
};

type FormElementsType = {
    [key in ElementsType]: FormElement;
};

export const FormElements: FormElementsType = {
    TextField: TextFieldFormElement,
};
