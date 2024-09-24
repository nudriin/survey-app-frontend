import { FormElementInstance, FormElements } from './FormElement';
import { Button } from './ui/button';
import { HiCursorClick } from 'react-icons/hi';
import tutWuriImg from '../assets/images/web/tut_wuri.png';
import { FormResponse } from '@/model/FormModel';

export default function FormSubmitComponent({
    form,
    content,
}: {
    form: FormResponse | undefined;
    content: FormElementInstance[];
}) {
    return (
        <div className="lg:max-w-[650px] p-8 mx-auto">
            <header className="bg-gradient-to-b md:bg-gradient-to-r from-purples to-cyan-500 rounded-xl text-white p-6 shadow-box border-2 border-darks2">
                <div className="sm:flex items-center justify-center md:text-left gap-3 col-span-4 ">
                    <div>
                        <p></p>
                        <h1 className="text-2xl md:text-2xl font-bold my-3">
                            Selamat Datang di Dinas Pendidikan Kota Palangka
                            Raya
                        </h1>
                        <p className="md:text-xl lg:text-lg">
                            Semoga harimu menyenangkan!
                        </p>
                    </div>
                    <img
                        className="h-28 md:h-36 lg:h-28 order-2 md:order-1 mx-auto"
                        src={tutWuriImg}
                        alt=""
                    />
                </div>
            </header>
            <div className="mt-6 border-2 border-darks2 shadow-box rounded-lg p-6 text-left">
                <h1 className="font-semibold text-xl">{form?.name}</h1>
                <p className="text-sm text-muted-foreground">
                    {form?.description}
                </p>
            </div>
            <div className="flex justify-center w-full h-full items-center mt-6">
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
        </div>
    );
}
