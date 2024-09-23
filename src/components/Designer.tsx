import { cn } from '@/lib/utils';
import DesignerSidebar from './DesignerSidebar';
import { useDroppable } from '@dnd-kit/core';

export default function Designer() {
    const droppable = useDroppable({
        id: 'drop-area',
        data: {
            isDropArea: true,
        },
    });
    return (
        <div className="flex w-full h-full">
            <div className="p-4 w-full">
                <div
                    ref={droppable.setNodeRef}
                    className={cn(
                        'bg-white border-2 border-darks2 h-full min-h-screen m-auto rounded-lg flex flex-col flex-grow items-center justify-center overflow-y-auto shadow-box',
                        droppable.isOver && 'ring-4 ring-purples border-0'
                    )}
                >
                    <p className="text-3xl font-semibold">Drop kesini</p>
                </div>
            </div>
            <DesignerSidebar />
        </div>
    );
}
