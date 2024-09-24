import { FormElements } from './FormElement';
import SideBarBtnElement from './SideBarBtnElement';

export default function FormElementSidebar() {
    return (
        <div>
            Element
            <SideBarBtnElement formElement={FormElements.TextField} />
        </div>
    );
}
