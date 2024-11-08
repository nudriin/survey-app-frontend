/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { ElementsType, FormElement } from "../FormElement"
import { RiSeparator } from "react-icons/ri"
import { Label } from "../ui/label"
import { Separator } from "../ui/separator"

const type: ElementsType = "SeparatorField"

export const SeparatorFieldFormElement: FormElement = {
    type,

    construct: (id: string) => ({
        id,
        type,
    }),

    designerBtn: {
        icon: RiSeparator,
        label: "Separator Field",
    },

    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,
    validate: () => true,
}

function DesignerComponent() {
    return (
        <div className="flex flex-col items-start w-full gap-2">
            <Label className="font-semibold text-muted-foreground">
                Separator
            </Label>
            <Separator />
        </div>
    )
}

function PropertiesComponent() {
    return <p>No properties</p>
}

function FormComponent() {
    return <Separator />
}
