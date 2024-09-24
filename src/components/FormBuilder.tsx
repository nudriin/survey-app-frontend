import { FormResponse } from '@/model/FormModel';
import PreviewDialogBtn from './PreviewDialogBtn';
import SaveFormBtn from './SaveFormBtn';
import PublishFormBtn from './PublishFormBtn';
import Designer from './Designer';
import {
    DndContext,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import DragOverlayWrapper from './DragOverlayWrapper';
import useDesigner from '@/hooks/useDesigner';
import { useEffect, useState } from 'react';
import { ImSpinner2 } from 'react-icons/im';

export default function FormBuilder({
    form,
}: {
    form: FormResponse | undefined;
}) {
    const { setElements } = useDesigner();
    const [isReady, setIsReady] = useState<boolean>(false);

    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 10,
        },
    });
    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: {
            delay: 300,
            tolerance: 5,
        },
    });

    const sensors = useSensors(mouseSensor, touchSensor);

    const formcontent = form?.content !== undefined ? form.content : '[]';
    useEffect(() => {
        if (isReady) return;
        const elements = JSON.parse(formcontent);
        setElements(elements);
        const readyTimeout = setTimeout(() => setIsReady(true), 500);
        return () => clearTimeout(readyTimeout);
    }, [formcontent, setElements, isReady]);

    if (!isReady) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-full">
                <ImSpinner2 className="animate-spin h-12 w-12" />
            </div>
        );
    }

    return (
        <DndContext sensors={sensors}>
            <main className="flex flex-col w-full">
                <nav className="flex justify-between border-b-2 p-4 gap-4 items-center">
                    <h2 className="truncate font-semibold">
                        <span className="text-muted-foreground">
                            Formulir:{' '}
                        </span>
                        {form?.name}
                    </h2>
                    <div className="flex gap-2 items-center">
                        <PreviewDialogBtn />
                        {!form?.published && (
                            <>
                                <SaveFormBtn id={form?.id} />
                                <PublishFormBtn />
                            </>
                        )}
                    </div>
                </nav>
                <div className="flex w-full flex-grow items-center justify-center relative overflow-auto min-h-screen bg-accent bg-[url(/paper.svg)]">
                    <Designer />
                </div>
            </main>
            <DragOverlayWrapper />
        </DndContext>
    );
}
