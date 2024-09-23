import { FormResponse } from '@/model/FormModel';
import PreviewDialogBtn from './PreviewDialogBtn';
import SaveFormBtn from './SaveFormBtn';
import PublishFormBtn from './PublishFormBtn';
import Designer from './Designer';
import { DndContext } from '@dnd-kit/core';
import DragOverlayWrapper from './DragOverlayWrapper';

export default function FormBuilder({
    form,
}: {
    form: FormResponse | undefined;
}) {
    return (
        <DndContext>
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
                                <SaveFormBtn />
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
