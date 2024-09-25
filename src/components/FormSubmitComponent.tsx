import { FormElementInstance, FormElements } from './FormElement';
import { Button } from './ui/button';
import { HiCursorClick } from 'react-icons/hi';
import tutWuriImg from '../assets/images/web/tut_wuri.png';
import { FormResponse } from '@/model/FormModel';
import { useRef, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import Confetti from 'react-confetti';

export default function FormSubmitComponent({
    form,
    content,
}: {
    form: FormResponse | undefined;
    content: FormElementInstance[];
}) {
    const formValues = useRef<{ [key: string]: string }>({});
    const formErrors = useRef<{ [key: string]: boolean }>({});
    const [renderKey, setRenderKey] = useState(new Date().getTime());
    const [submitted, setSubmitted] = useState(false);

    const validateForm = (): boolean => {
        for (const field of content) {
            const actualValue = formValues.current[field.id] || '';
            const valid = FormElements[field.type].validate(field, actualValue);

            if (!valid) {
                formErrors.current[field.id] = true;
            }
        }

        if (Object.keys(formErrors.current).length > 0) {
            return false;
        }
        return true;
    };

    const submitValue = (key: string, value: string) => {
        formValues.current[key] = value;
    };

    const handleSubmit = async () => {
        formErrors.current = {};
        const validForm = validateForm();
        if (!validForm) {
            setRenderKey(new Date().getTime());
            toast({
                title: 'Error',
                description: 'Mohon periksa kembali inputan anda',
                variant: 'destructive',
            });
            return;
        }

        console.log(formValues.current);

        try {
            const data = JSON.stringify(formValues.current);
            const response = await fetch(`/api/v1/forms/url/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    shareURL: form?.shareURL,
                    content: data,
                }),
            });
            const body = await response.json();
            if (!body.errors) {
                setSubmitted(true);
            } else {
                throw new Error(body.errors);
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: `${error}`,
                variant: 'destructive',
            });
        }
    };

    if (submitted) {
        return (
            <>
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    recycle={false}
                    numberOfPieces={1000}
                />
                <div className="flex flex-col items-center justify-center min-h-screen w-full">
                    <div className="max-w-md border-2 border-darks2 shadow-box p-6 rounded-lg text-left">
                        <h1 className="text-4xl font-semibold text-purples border-b pb-2 mb-10">
                            Formulir berhasil di kirim
                        </h1>
                        <h3 className="text-sm text-muted-foreground border-b pb-10">
                            Terimakasih telah mengisi formulir ini, kamu boleh
                            keluar dari halaman ini.
                        </h3>
                    </div>
                </div>
            </>
        );
    }

    return (
        <div className="lg:max-w-[650px] p-8 mx-auto">
            <header className="bg-gradient-to-b md:bg-gradient-to-r from-purples to-cyan-500 rounded-xl text-white p-6 shadow-box border-2 border-darks2 dark:shadow-light dark:border-primary">
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
            <div className="mt-6 border-2 border-darks2 shadow-box rounded-lg p-6 text-left dark:shadow-light dark:border-primary">
                <h1 className="font-semibold text-xl">{form?.name}</h1>
                <p className="text-sm text-muted-foreground">
                    {form?.description}
                </p>
            </div>
            <div className="flex justify-center w-full h-full items-center mt-6">
                <div
                    key={renderKey}
                    className="flex flex-col gap-4 flex-grow bg-background border-2 border-darks2 shadow-box h-full w-full rounded-lg p-6 overflow-y-auto dark:shadow-light dark:border-primary"
                >
                    {content.map((element) => {
                        const FormComponent =
                            FormElements[element.type].formComponent;
                        return (
                            <FormComponent
                                key={element.id}
                                elementInstance={element}
                                submitValue={submitValue}
                                isInvalid={formErrors.current[element.id]}
                                defaultValue={formValues.current[element.id]}
                            />
                        );
                    })}
                    <Button className="gap-2 bg-purples" onClick={handleSubmit}>
                        <HiCursorClick /> Kirim
                    </Button>
                </div>
            </div>
        </div>
    );
}
