import { cn } from '@/lib/utils';
import DesignerSidebar from './DesignerSidebar';
import {
    DragEndEvent,
    useDndMonitor,
    useDraggable,
    useDroppable,
} from '@dnd-kit/core';
import useDesigner from '@/hooks/useDesigner';
import { ElementsType, FormElementInstance, FormElements } from './FormElement';
import { idGenerator } from '@/lib/idGenerator';
import { useState } from 'react';
import { Button } from './ui/button';
import { BiSolidTrash } from 'react-icons/bi';

export default function Designer() {
    const { elements, addElement } = useDesigner();
    const droppable = useDroppable({
        id: 'drop-area',
        data: {
            isDropArea: true,
        },
    });

    useDndMonitor({
        onDragEnd: (ev: DragEndEvent) => {
            const { active, over } = ev;
            if (!active || !over) return;
            const isDesignerBtnElement =
                active?.data?.current?.isDesignerBtnElement;

            if (isDesignerBtnElement) {
                const type = active?.data?.current?.type;
                const newElement = FormElements[type as ElementsType].construct(
                    idGenerator()
                );

                addElement(0, newElement);
            }
        },
    });
    return (
        <div className="flex w-full h-full">
            <div className="p-4 w-full">
                <div
                    ref={droppable.setNodeRef}
                    className={cn(
                        'bg-white border-2 border-darks2 h-full min-h-screen m-auto rounded-lg flex flex-col flex-grow items-center justify-center overflow-y-auto shadow-box p-6',
                        droppable.isOver &&
                            'ring-4 ring-purples border-0 justify-start',
                        elements.length > 0 && 'justify-start'
                    )}
                >
                    {!droppable.isOver && elements.length === 0 && (
                        <p className="text-3xl font-semibold">Drop kesini</p>
                    )}
                    {droppable.isOver && elements.length === 0 && (
                        <div className="p-4 w-full">
                            <div className="h-[75px] rounded-lg bg-primary/20"></div>
                        </div>
                    )}
                    {elements.length > 0 && (
                        <div className="flex flex-col w-full gap-2 p-4">
                            {elements.map((element) => (
                                <DesignerElementWrapper
                                    key={element.id}
                                    element={element}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <DesignerSidebar />
        </div>
    );
}

function DesignerElementWrapper({ element }: { element: FormElementInstance }) {
    const { removeElement } = useDesigner();
    const [isMouseOver, setIsMouseOver] = useState<boolean>(false);
    const topHalf = useDroppable({
        id: element.id + '-top',
        data: {
            type: element.type,
            elementId: element.id,
            isTopHalfElement: true,
        },
    });
    const bottomHalf = useDroppable({
        id: element.id + '-bottom',
        data: {
            type: element.type,
            elementId: element.id,
            isBottomHalfElement: true,
        },
    });

    const draggable = useDraggable({
        id: element.id + '-drag-handler',
        data: {
            type: element.type,
            elementId: element.id,
            isDesignerElement: true,
        },
    });

    if (draggable.isDragging) return null;

    const DesignerElement = FormElements[element.type].designerComponent;

    return (
        <div
            ref={draggable.setNodeRef}
            {...draggable.listeners}
            {...draggable.attributes}
            className="relative min-h-[75px] flex flex-col text-foreground hover: cursor-pointer rounded-lg ring-1 ring-accent ring-inset"
            onMouseEnter={() => {
                setIsMouseOver(true);
            }}
            onMouseLeave={() => {
                setIsMouseOver(false);
            }}
        >
            <div
                ref={topHalf.setNodeRef}
                className="absolute w-full h-1/2 rounded-t-lg"
            />
            <div
                ref={bottomHalf.setNodeRef}
                className="absolute bottom-0 w-full h-1/2 rounded-b-lg"
            />
            {isMouseOver && (
                <div className="absolute w-full h-full bg-darks2/50 rounded-lg">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse cursor-pointer">
                        <p className="text-white text-sm">
                            Klik untuk mengubah properti
                        </p>
                    </div>
                    <div className="absolute right-0 h-full">
                        <Button
                            onClick={() => {
                                removeElement(element.id);
                            }}
                            className="flex justify-center h-full border rounded-lg rounded-l-none bg-red-500"
                        >
                            <BiSolidTrash />
                        </Button>
                    </div>
                </div>
            )}
            {topHalf.isOver && (
                <div className="absolute top-0 w-full rounded-t-lg h-[8px] bg-purples" />
            )}
            <div
                className={cn(
                    'flex w-full min-h-[75px] items-center rounded-lg border-2 border-darks2 p-4'
                )}
            >
                <DesignerElement elementInstance={element} />
            </div>
            {bottomHalf.isOver && (
                <div className="absolute bottom-0 w-full rounded-b-lg h-[8px] bg-purples" />
            )}
        </div>
    );
}
