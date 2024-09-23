import { FormElements } from './FormElement';
import SideBarBtnElement from './SideBarBtnElement';

export default function DesignerSidebar() {
    return (
        <aside className="bg-background border-l-2 border-darks2 w-[400px] flex flex-col p-4">
            Element
            <SideBarBtnElement formElement={FormElements.TextField} />
        </aside>
    );
}
