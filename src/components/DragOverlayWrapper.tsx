import { Active, DragOverlay, useDndMonitor } from '@dnd-kit/core';
import { useState } from 'react';
import { SideBarBtnElementDragOverlay } from './SideBarBtnElement';
import { ElementsType, FormElements } from './FormElement';
import useDesigner from '@/hooks/useDesigner';

export default function DragOverlayWrapper() {
    const { elements } = useDesigner();
    const [dragged, setDragged] = useState<Active | null>(null);
    useDndMonitor({
        onDragStart: (ev) => {
            setDragged(ev.active);
        },
        onDragCancel: () => {
            setDragged(null);
        },
        onDragEnd: () => {
            setDragged(null);
        },
    });

    if (!dragged) return null;
    let node = <div>No drag overlay</div>;

    const isSidebarBtnElemen = dragged?.data?.current?.isDesignerBtnElement;

    if (isSidebarBtnElemen) {
        const type = dragged?.data?.current?.type as ElementsType;
        node = (
            <SideBarBtnElementDragOverlay formElement={FormElements[type]} />
        );
    }

    const isDesignerElemen = dragged?.data?.current?.isDesignerElement;
    if (isDesignerElemen) {
        const id = dragged?.data?.current?.elementId;
        const element = elements.find((el) => el.id === id);
        if (!element) {
            node = <div>Element not found</div>;
        } else {
            const DesignerElementComponent =
                FormElements[element.type].designerComponent;

            node = (
                <div className="flex bg-accent border rounded-lg min-h-[75px] w-full py-4 px-4 opacity-80 pointer-events-none">
                    <DesignerElementComponent elementInstance={element} />
                </div>
            );
        }
    }
    return <DragOverlay>{node}</DragOverlay>;
}
