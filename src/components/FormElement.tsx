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
    designerComponent: React.FC;
    formComponent: React.FC;
    propertiesComponent: React.FC;
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
