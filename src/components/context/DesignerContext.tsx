import { createContext, Dispatch, ReactNode, useState } from 'react';
import { FormElementInstance } from '../FormElement';

type DesignerContextType = {
    elements: FormElementInstance[];
    addElement: (index: number, element: FormElementInstance) => void;
    removeElement: (id: string) => void;
    setElements: Dispatch<React.SetStateAction<FormElementInstance[]>>;

    selectedElement: FormElementInstance | null;
    setSelectedElement: Dispatch<
        React.SetStateAction<FormElementInstance | null>
    >;

    updateElement: (id: string, element: FormElementInstance) => void;
};

export const DesignerContext = createContext<DesignerContextType | null>(null);

export default function DesignerContextProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [elements, setElements] = useState<FormElementInstance[]>([]);
    const [selectedElement, setSelectedElement] =
        useState<FormElementInstance | null>(null);
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

    const updateElement = (id: string, element: FormElementInstance) => {
        setElements((prev) => {
            const newElement = [...prev];
            const index = newElement.findIndex((el) => el.id === id);
            newElement[index] = element;
            return newElement;
        });
    };

    return (
        <DesignerContext.Provider
            value={{
                elements,
                addElement,
                removeElement,
                selectedElement,
                setSelectedElement,
                updateElement,
                setElements,
            }}
        >
            {children}
        </DesignerContext.Provider>
    );
}
