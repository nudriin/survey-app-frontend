import useDesigner from '@/hooks/useDesigner';
import { Button } from './ui/button';
import { MdPreview } from 'react-icons/md';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { FormElements } from './FormElement';

export default function PreviewDialogBtn() {
    const { elements } = useDesigner();
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={'outline'} className="gap-2">
                    Preview <MdPreview />
                </Button>
            </DialogTrigger>
            <DialogContent className="w-screen h-screen max-h-screen max-w-full flex flex-col flex-grow p-0 gap-0">
                <div className="px-4 py-2 border-b">
                    <p className="text-lg font-bold text-purples">
                        Form preview
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Ini adalah preview dari formulir yang nantinya akan
                        dilihat oleh pengguna
                    </p>
                </div>
                <div className="bg-accent flex flex-col flex-grow items-center justify-center p-4 overflow-y-auto bg-[url(/paper.svg)]">
                    <div className="max-w-[650px] flex flex-col gap-4 flex-grow bg-background h-full w-full rounded-lg p-6 overflow-y-auto">
                        {elements.map((element) => {
                            const FormComponent =
                                FormElements[element.type].formComponent;
                            return (
                                <FormComponent
                                    key={element.id}
                                    elementInstance={element}
                                />
                            );
                        })}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
