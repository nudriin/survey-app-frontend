import { cn } from "@/lib/utils"
import DesignerSidebar from "./DesignerSidebar"
import {
    DragEndEvent,
    useDndMonitor,
    useDraggable,
    useDroppable,
} from "@dnd-kit/core"
import useDesigner from "@/hooks/useDesigner"
import { ElementsType, FormElementInstance, FormElements } from "./FormElement"
import { idGenerator } from "@/lib/idGenerator"
import { useState } from "react"
import { Button } from "./ui/button"
import { BiSolidTrash } from "react-icons/bi"
import PropertiesSidebar from "./PropertiesSidebar"

export default function Designer() {
    const {
        elements,
        addElement,
        selectedElement,
        setSelectedElement,
        removeElement,
    } = useDesigner()
    const droppable = useDroppable({
        id: "drop-area",
        data: {
            isDropArea: true,
        },
    })

    useDndMonitor({
        onDragEnd: (ev: DragEndEvent) => {
            const { active, over } = ev
            if (!active || !over) return
            const isDesignerBtnElement =
                active?.data?.current?.isDesignerBtnElement

            const isDropOverDesignerDropArea = over?.data?.current?.isDropArea

            // First Scenario
            const dropSidebarBtnOverDesignerDropArea =
                isDesignerBtnElement && isDropOverDesignerDropArea

            if (dropSidebarBtnOverDesignerDropArea) {
                const type = active?.data?.current?.type
                const newElement = FormElements[type as ElementsType].construct(
                    idGenerator()
                )

                addElement(elements.length, newElement)

                return
            }

            const isDropOverDesignerElementTopHalf =
                over?.data?.current?.isTopHalfElement
            const isDropOverDesignerElementBottomHalf =
                over?.data?.current?.isBottomHalfElement

            const isDropOverDesignerElement =
                isDropOverDesignerElementTopHalf ||
                isDropOverDesignerElementBottomHalf

            const dropSidebarBtnOverDesignerElement =
                isDesignerBtnElement && isDropOverDesignerElement

            // Second Scenario
            if (dropSidebarBtnOverDesignerElement) {
                const type = active?.data?.current?.type
                const newElement = FormElements[type as ElementsType].construct(
                    idGenerator()
                )

                const overId = over?.data?.current?.elementId
                const overElementIndex = elements.findIndex(
                    (el) => el.id == overId
                )

                if (overElementIndex === -1) {
                    throw new Error("element not found")
                }

                let indexNewElement = overElementIndex

                if (isDropOverDesignerElementBottomHalf) {
                    indexNewElement = overElementIndex + 1
                }
                addElement(indexNewElement, newElement)

                return
            }

            // Third Scenario
            const isDraggingDesignerElement =
                active.data?.current?.isDesignerElement
            const draggingDesignerElementOverAnotherDesignerElement =
                isDropOverDesignerElement && isDraggingDesignerElement

            if (draggingDesignerElementOverAnotherDesignerElement) {
                const activeId = active.data?.current?.elementId
                const overId = over.data?.current?.elementId

                const activeElementIndex = elements.findIndex(
                    (el) => el.id === activeId
                )
                const overElementIndex = elements.findIndex(
                    (el) => el.id === overId
                )

                if (activeElementIndex === -1 || overElementIndex === -1) {
                    throw new Error("element not found")
                }

                const activeElement = { ...elements[activeElementIndex] }
                removeElement(activeId)

                let indexNewElement = overElementIndex

                if (isDropOverDesignerElementBottomHalf) {
                    indexNewElement = overElementIndex + 1
                }
                addElement(indexNewElement, activeElement)
            }
        },
    })
    return (
        <div className="flex w-full h-full">
            <DesignerSidebar />
            <div
                className="w-full p-4"
                onClick={() => {
                    if (selectedElement) setSelectedElement(null)
                }}
            >
                <div
                    ref={droppable.setNodeRef}
                    className={cn(
                        "bg-background border-2 border-darks2 dark:border-primary dark:shadow-light h-full min-h-screen max-h-[800px] m-auto rounded-lg flex flex-col flex-grow items-center justify-center overflow-y-auto shadow-box p-6",
                        droppable.isOver &&
                            "ring-4 ring-purples border-0 justify-start",
                        elements.length > 0 && "justify-start"
                    )}
                >
                    {!droppable.isOver && elements.length === 0 && (
                        <p className="text-3xl font-semibold">Drop kesini</p>
                    )}
                    {droppable.isOver && elements.length === 0 && (
                        <div className="w-full p-4">
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
            {selectedElement && <PropertiesSidebar />}
        </div>
    )
}

function DesignerElementWrapper({ element }: { element: FormElementInstance }) {
    const { removeElement, setSelectedElement } = useDesigner()
    const [isMouseOver, setIsMouseOver] = useState<boolean>(false)
    const topHalf = useDroppable({
        id: element.id + "-top",
        data: {
            type: element.type,
            elementId: element.id,
            isTopHalfElement: true,
        },
    })
    const bottomHalf = useDroppable({
        id: element.id + "-bottom",
        data: {
            type: element.type,
            elementId: element.id,
            isBottomHalfElement: true,
        },
    })

    const draggable = useDraggable({
        id: element.id + "-drag-handler",
        data: {
            type: element.type,
            elementId: element.id,
            isDesignerElement: true,
        },
    })

    if (draggable.isDragging) return null

    const DesignerElement = FormElements[element.type].designerComponent

    return (
        <div
            ref={draggable.setNodeRef}
            {...draggable.listeners}
            {...draggable.attributes}
            className="relative min-h-[75px] flex flex-col text-foreground hover: cursor-pointer rounded-lg ring-1 ring-accent ring-inset"
            onMouseEnter={() => {
                setIsMouseOver(true)
            }}
            onMouseLeave={() => {
                setIsMouseOver(false)
            }}
            onClick={(e) => {
                e.stopPropagation()
                setSelectedElement(element)
            }}
        >
            <div
                ref={topHalf.setNodeRef}
                className="absolute w-full rounded-t-lg h-1/2"
            />
            <div
                ref={bottomHalf.setNodeRef}
                className="absolute bottom-0 w-full rounded-b-lg h-1/2"
            />
            {isMouseOver && (
                <div className="absolute w-full h-full rounded-lg bg-darks2/50">
                    <div className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer top-1/2 left-1/2 animate-pulse">
                        <p className="text-sm text-white">
                            Klik untuk mengubah properti
                        </p>
                    </div>
                    <div className="absolute right-0 h-full">
                        <Button
                            onClick={(e) => {
                                e.stopPropagation()
                                removeElement(element.id)
                            }}
                            className="flex justify-center h-full bg-red-500 border rounded-lg rounded-l-none"
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
                    "flex w-full min-h-[75px] items-center rounded-lg border-2 border-primary p-4"
                )}
            >
                <DesignerElement elementInstance={element} />
            </div>
            {bottomHalf.isOver && (
                <div className="absolute bottom-0 w-full rounded-b-lg h-[8px] bg-purples" />
            )}
        </div>
    )
}
