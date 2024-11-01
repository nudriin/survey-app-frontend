import { FormElementInstance, FormElements } from "./FormElement"
import { Button } from "./ui/button"
import { HiCursorClick } from "react-icons/hi"
import pky from "../assets/images/web/pky.png"
import { FormResponse } from "@/model/FormModel"
import { useRef, useState } from "react"
import { toast } from "@/hooks/use-toast"
import Confetti from "react-confetti"

export default function FormSubmitComponent({
    form,
    content,
}: {
    form: FormResponse | undefined
    content: FormElementInstance[]
}) {
    const formValues = useRef<{ [key: string]: string }>({})
    const formErrors = useRef<{ [key: string]: boolean }>({})
    const [renderKey, setRenderKey] = useState(new Date().getTime())
    const [submitted, setSubmitted] = useState(false)

    const validateForm = (): boolean => {
        for (const field of content) {
            const actualValue = formValues.current[field.id] || ""
            const valid = FormElements[field.type].validate(field, actualValue)

            if (!valid) {
                formErrors.current[field.id] = true
            }
        }

        if (Object.keys(formErrors.current).length > 0) {
            return false
        }
        return true
    }

    const submitValue = (key: string, value: string) => {
        formValues.current[key] = value
    }

    const handleSubmit = async () => {
        formErrors.current = {}
        const validForm = validateForm()
        if (!validForm) {
            setRenderKey(new Date().getTime())
            toast({
                title: "Error",
                description: "Mohon periksa kembali inputan anda",
                variant: "destructive",
            })
            return
        }

        console.log(formValues.current)

        try {
            const data = JSON.stringify(formValues.current)
            const response = await fetch(`/api/v1/forms/url`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    shareURL: form?.shareURL,
                    content: data,
                }),
            })
            const body = await response.json()
            if (!body.errors) {
                setSubmitted(true)
            } else {
                throw new Error(body.errors)
            }
        } catch (error) {
            toast({
                title: "Error",
                description: `${error}`,
                variant: "destructive",
            })
        }
    }

    if (submitted) {
        return (
            <>
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    recycle={false}
                    numberOfPieces={1000}
                />
                <div className="flex flex-col items-center justify-center w-full min-h-screen">
                    <div className="max-w-md p-6 text-left border-2 rounded-lg border-darks2 shadow-box">
                        <h1 className="pb-2 mb-10 text-4xl font-semibold border-b text-purples">
                            Formulir berhasil di kirim
                        </h1>
                        <h3 className="pb-10 text-sm border-b text-muted-foreground">
                            Terimakasih telah mengisi formulir ini, kamu boleh
                            keluar dari halaman ini.
                        </h3>
                    </div>
                </div>
            </>
        )
    }

    return (
        <div className="w-full lg:max-w-[650px] mx-auto">
            <header className="p-6 text-white border-2 bg-gradient-to-b md:bg-gradient-to-r from-purples to-cyan-500 rounded-xl shadow-box border-darks2 dark:shadow-light dark:border-primary">
                <div className="items-center justify-center col-span-4 gap-3 sm:flex md:text-left ">
                    <div>
                        <p></p>
                        <h1 className="my-3 text-2xl font-bold md:text-2xl">
                            Selamat Datang di Dinas Pendidikan Kota Palangka
                            Raya
                        </h1>
                        <p className="md:text-xl lg:text-lg">
                            Semoga harimu menyenangkan!
                        </p>
                    </div>
                    <img
                        className="order-2 mx-auto h-28 md:h-36 lg:h-28 md:order-1"
                        src={pky}
                        alt=""
                    />
                </div>
            </header>
            <div className="p-6 mt-6 text-left border-2 rounded-lg border-darks2 shadow-box dark:shadow-light dark:border-primary bg-background">
                <h1 className="text-xl font-semibold">{form?.name}</h1>
                <p className="text-sm text-muted-foreground">
                    {form?.description}
                </p>
            </div>
            <div className="flex items-center justify-center w-full h-full mt-6">
                <div
                    key={renderKey}
                    className="flex flex-col flex-grow w-full h-full gap-4 p-6 overflow-y-auto border-2 rounded-lg bg-background border-darks2 shadow-box dark:shadow-light dark:border-primary"
                >
                    {content.map((element) => {
                        const FormComponent =
                            FormElements[element.type].formComponent
                        return (
                            <FormComponent
                                key={element.id}
                                elementInstance={element}
                                submitValue={submitValue}
                                isInvalid={formErrors.current[element.id]}
                                defaultValue={formValues.current[element.id]}
                            />
                        )
                    })}
                    <Button className="gap-2 bg-purples" onClick={handleSubmit}>
                        <HiCursorClick /> Kirim
                    </Button>
                </div>
            </div>
        </div>
    )
}
