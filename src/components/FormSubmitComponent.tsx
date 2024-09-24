import { FormElementInstance, FormElements } from './FormElement';
import DashboardLayout from './layout/DashboardLayout';
import { Button } from './ui/button';
import { HiCursorClick } from 'react-icons/hi';

export default function FormSubmitComponent({
    formURL,
    content,
}: {
    formURL: string;
    content: FormElementInstance[];
}) {
    return (
        <div className="max-w-[650px] p-8 mx-auto">
            <DashboardLayout>
                <div className="flex justify-center w-full h-full items-center mt-8">
                    <div className="flex flex-col gap-4 flex-grow bg-background border-2 border-darks2 shadow-box h-full w-full rounded-lg p-6 overflow-y-auto">
                        {content.map((element) => {
                            const FormComponent =
                                FormElements[element.type].formComponent;
                            return (
                                <FormComponent
                                    key={element.id}
                                    elementInstance={element}
                                />
                            );
                        })}
                        <Button className="gap-2 bg-purples">
                            <HiCursorClick /> Kirim
                        </Button>
                    </div>
                </div>
            </DashboardLayout>
        </div>
    );
}
