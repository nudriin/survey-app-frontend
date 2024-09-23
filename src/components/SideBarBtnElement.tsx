import { useDraggable } from '@dnd-kit/core';
import { FormElement } from './FormElement';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
export default function SideBarBtnElement({
    formElement,
}: {
    formElement: FormElement;
}) {
    const { label, icon: Icon } = formElement.designerBtn;
    const draggable = useDraggable({
        id: `drag-btn-${formElement.type}`,
        data: {
            type: formElement.type,
            isDesignerBtnElement: true,
        },
    });
    return (
        <Button
            ref={draggable.setNodeRef}
            variant={'outline'}
            className={cn(
                'flex flex-col gap-2 h-[60px] w-[60px] cursor-grab',
                draggable.isDragging && 'ring-2 ring-primary'
            )}
            {...draggable.listeners}
            {...draggable.attributes}
        >
            <Icon className="h-8 w-8" />
            <p className="text-xs">{label}</p>
        </Button>
    );
}

export function SideBarBtnElementDragOverlay({
    formElement,
}: {
    formElement: FormElement;
}) {
    const { label, icon: Icon } = formElement.designerBtn;
    return (
        <Button className="flex flex-col gap-2 h-[60px] w-[60px] cursor-grab bg-primary">
            <Icon className="h-8 w-8" />
            <p className="text-xs">{label}</p>
        </Button>
    );
}
