import { createContext, ReactNode, useState } from 'react';
import { FormElementInstance } from '../FormElement';

type DesignerContextType = {
    elements: FormElementInstance[];
    addElement: (index: number, element: FormElementInstance) => void;
    removeElement: (id: string) => void;
};

export const DesignerContext = createContext<DesignerContextType | null>(null);

export default function DesignerContextProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [elements, setElements] = useState<FormElementInstance[]>([]);
    const addElement = (index: number, element: FormElementInstance) => {
        setElements((prev) => {
            const newElement = [...prev];
            newElement.splice(index, 0, element);
            return newElement;
        });
    };

    const removeElement = (id: string) => {
        setElements((prev) => prev.filter((el) => el.id !== id));
    };

    return (
        <DesignerContext.Provider
            value={{ elements, addElement, removeElement }}
        >
            {children}
        </DesignerContext.Provider>
    );
}
