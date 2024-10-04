import { FormResponse } from "@/model/FormModel"
import PreviewDialogBtn from "./PreviewDialogBtn"
import SaveFormBtn from "./SaveFormBtn"
import PublishFormBtn from "./PublishFormBtn"
import Designer from "./Designer"
import {
    DndContext,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core"
import DragOverlayWrapper from "./DragOverlayWrapper"
import useDesigner from "@/hooks/useDesigner"
import { useEffect, useState } from "react"
import { ImSpinner2 } from "react-icons/im"
import { BsArrowLeft, BsArrowRight } from "react-icons/bs"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { toast } from "@/hooks/use-toast"
import { Link } from "react-router-dom"
import Confetti from "react-confetti"
import DashboardLayout from "./layout/DashboardLayout"

export default function FormBuilder({
    form,
}: {
    form: FormResponse | undefined
}) {
    const { setElements, setSelectedElement } = useDesigner()
    const [isReady, setIsReady] = useState<boolean>(false)

    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 10,
        },
    })
    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: {
            delay: 300,
            tolerance: 5,
        },
    })

    const sensors = useSensors(mouseSensor, touchSensor)

    const formcontent = form?.content !== undefined ? form.content : "[]"
    useEffect(() => {
        if (isReady) return
        const elements = JSON.parse(formcontent)
        setElements(elements)
        setSelectedElement(null)
        const readyTimeout = setTimeout(() => setIsReady(true), 500)
        return () => clearTimeout(readyTimeout)
    }, [formcontent, setElements, isReady, setSelectedElement])

    if (!isReady) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-full">
                <ImSpinner2 className="w-12 h-12 animate-spin" />
            </div>
        )
    }

    const shareUrl = `${window.location.origin}/form/${form?.shareURL}`

    if (form?.published) {
        return (
            <>
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    recycle={false}
                    numberOfPieces={1000}
                />
                <div className="flex flex-col items-center justify-center w-full min-h-screen">
                    <div className="max-w-md p-6 text-left border-2 rounded-lg border-darks2 shadow-box">
                        <h1 className="pb-2 mb-10 text-4xl font-semibold border-b text-purples">
                            Formulir telah di publikasikan!
                        </h1>
                        <h2 className="text-2xl">Bagikan formulir ini</h2>
                        <h3 className="pb-10 text-sm border-b text-muted-foreground">
                            Siapapun yang memiliki link, dapat melihat dan
                            mengisi formulir
                        </h3>
                        <div className="flex flex-col items-center w-full gap-2 pb-4 my-4 border-b">
                            <Input
                                className="w-full"
                                readOnly
                                value={shareUrl}
                            />
                            <Button
                                className="w-full mt-2 bg-purples"
                                onClick={() => {
                                    navigator.clipboard.writeText(shareUrl)
                                    toast({
                                        title: "Success",
                                        description: "Link berhasil disalin",
                                    })
                                }}
                            >
                                Salin link
                            </Button>
                        </div>
                        <div className="flex justify-between">
                            <Button variant={"link"} asChild>
                                <Link to="/" className="gap-2">
                                    <BsArrowLeft />
                                    Kembali ke dashboard
                                </Link>
                            </Button>
                            <Button variant={"link"} asChild>
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
        )
    }

    return (
        <DndContext sensors={sensors}>
            <DashboardLayout>
                <main className="flex flex-col w-full">
                    <nav className="flex items-center justify-between gap-4 p-4 border-b-2">
                        <h2 className="font-semibold truncate">
                            <span className="text-muted-foreground">
                                Formulir:{" "}
                            </span>
                            {form?.name}
                        </h2>
                        <div className="flex items-center gap-2">
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
    )
}
