import useDesigner from '@/hooks/useDesigner';
import FormElementSidebar from './FormElementSidebar';
import PropertiesFormSidebar from './PropertiesFormSidebar';

export default function DesignerSidebar() {
    const { selectedElement } = useDesigner();
    return (
        <aside className="bg-background border-l-2 border-r-2 border-darks2 w-[400px] flex flex-col p-4">
            {!selectedElement && <FormElementSidebar />}
            {selectedElement && <PropertiesFormSidebar />}
        </aside>
    );
}
