import { FormElements } from "./FormElement"
import SideBarBtnElement from "./SideBarBtnElement"
import { Separator } from "./ui/separator"

export default function FormElementSidebar() {
    return (
        <div>
            <p className="text-sm text-foreground/70">Element</p>
            <Separator className="my-2" />
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 place-items-center">
                <p className="col-span-1 my-2 text-sm text-muted-foreground md:col-span-2 place-self-start">
                    Layout Element
                </p>
                <SideBarBtnElement formElement={FormElements.TitleField} />
                <SideBarBtnElement formElement={FormElements.SubTitleField} />
                <SideBarBtnElement formElement={FormElements.ParagraphField} />
                <SideBarBtnElement formElement={FormElements.SeparatorField} />
                <SideBarBtnElement formElement={FormElements.SpacerField} />
                <p className="col-span-1 my-2 text-sm text-muted-foreground md:col-span-2 place-self-start">
                    Form Element
                </p>
                <SideBarBtnElement formElement={FormElements.TextField} />
                <SideBarBtnElement formElement={FormElements.NumberField} />
                <SideBarBtnElement formElement={FormElements.TextAreaField} />
                <SideBarBtnElement formElement={FormElements.DateField} />
                <SideBarBtnElement formElement={FormElements.SelectField} />
                <SideBarBtnElement formElement={FormElements.CheckboxField} />
            </div>
        </div>
    )
}
