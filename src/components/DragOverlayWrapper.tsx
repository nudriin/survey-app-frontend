import { Active, DragOverlay, useDndMonitor } from '@dnd-kit/core';
import { useState } from 'react';
import { SideBarBtnElementDragOverlay } from './SideBarBtnElement';
import { ElementsType, FormElements } from './FormElement';

export default function DragOverlayWrapper() {
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
    return <DragOverlay>{node}</DragOverlay>;
}
