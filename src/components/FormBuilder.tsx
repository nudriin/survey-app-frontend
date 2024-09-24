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
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import Confetti from 'react-confetti';
import DashboardLayout from './layout/DashboardLayout';
import { GoHome } from 'react-icons/go';

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

    const shareUrl = `${window.location.origin}/form/${form?.shareURL}`;

    if (form?.published) {
        return (
            <>
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    recycle={false}
                    numberOfPieces={1000}
                />
                <div className="flex flex-col items-center justify-center min-h-screen w-full">
                    <div className="max-w-md border-2 border-darks2 shadow-box p-6 rounded-lg text-left">
                        <h1 className="text-4xl font-semibold text-purples border-b pb-2 mb-10">
                            Formulir telah di publikasikan!
                        </h1>
                        <h2 className="text-2xl">Bagikan formulir ini</h2>
                        <h3 className="text-sm text-muted-foreground border-b pb-10">
                            Siapapun yang memiliki link, dapat melihat dan
                            mengisi formulir
                        </h3>
                        <div className="my-4 flex flex-col gap-2 items-center w-full border-b pb-4">
                            <Input
                                className="w-full"
                                readOnly
                                value={shareUrl}
                            />
                            <Button
                                className="mt-2 w-full bg-purples"
                                onClick={() => {
                                    navigator.clipboard.writeText(shareUrl);
                                    toast({
                                        title: 'Success',
                                        description: 'Link berhasil disalin',
                                    });
                                }}
                            >
                                Salin link
                            </Button>
                        </div>
                        <div className="flex justify-between">
                            <Button variant={'link'} asChild>
                                <Link to="/" className="gap-2">
                                    <BsArrowLeft />
                                    Kembali ke dashboard
                                </Link>
                            </Button>
                            <Button variant={'link'} asChild>
                                <Link
                                    to={`/forms/${form.id}`}
                                    className="gap-2"
                                >
                                    Detail formulir
                                    <BsArrowRight />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <DndContext sensors={sensors}>
            <DashboardLayout>
                <main className="flex flex-col w-full">
                    <nav className="flex justify-between border-b-2 p-4 gap-4 items-center">
                        <h2 className="truncate font-semibold">
                            <span className="text-muted-foreground">
                                Formulir:{' '}
                            </span>
                            {form?.name}
                        </h2>
                        <div className="flex gap-2 items-center">
                            <Button
                                variant={'outline'}
                                className="gap-2"
                                asChild
                            >
                                <Link to="/" className="items-center">
                                    Dashboard <GoHome />
                                </Link>
                            </Button>
                            <PreviewDialogBtn />
                            {!form?.published && (
                                <>
                                    <SaveFormBtn id={form?.id} />
                                    <PublishFormBtn id={form?.id} />
                                </>
                            )}
                        </div>
                    </nav>
                    <div className="flex w-full flex-grow items-center justify-center relative overflow-auto min-h-screen bg-accent bg-[url(/paper.svg)]">
                        <Designer />
                    </div>
                </main>
                <DragOverlayWrapper />
            </DashboardLayout>
        </DndContext>
    );
}
