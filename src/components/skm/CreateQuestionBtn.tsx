import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCookies } from "react-cookie"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form"
import { Button } from "../ui/button"
import { BsFileEarmarkPlus } from "react-icons/bs"
import { Input } from "../ui/input"
import { toast } from "../../hooks/use-toast"
import { useNavigate } from "react-router-dom"

const questionSchema = z.object({
    question: z.string().min(1).max(225),
    acronim: z.string().min(1).max(225),
    option_1: z.string().min(1).max(225),
    option_2: z.string().min(1).max(225),
    option_3: z.string().min(1).max(225),
    option_4: z.string().min(1).max(225),
})

type questionSchemaType = z.infer<typeof questionSchema>

export default function CreateQuestionBtn() {
    const question = useForm<questionSchemaType>({
        resolver: zodResolver(questionSchema),
        defaultValues: {
            question: "",
            acronim: "",
            option_1: "",
            option_2: "",
            option_3: "",
            option_4: "",
        },
    })
    const [cookie] = useCookies(["auth"])
    const token = cookie.auth
    const navigate = useNavigate()

    const handleQuestionSubmit = async (values: questionSchemaType) => {
        try {
            const response = await fetch("/api/v1/skm/question", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(values),
            })

            const body = await response.json()
            if (!body.errors) {
                toast({
                    title: "Sukses",
                    description: "Pertanyaan berhasil dibuat",
                })
                navigate(0)
            } else {
                throw new Error(body.errors)
            }
        } catch (error) {
            console.log(error)
            toast({
                title: "Error",
                description: `${error}`,
                variant: "destructive",
            })
        }
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="flex items-center justify-between h-full gap-4 bg-primary group hover:border-primary hover:cursor-pointer text-secondary">
                    <BsFileEarmarkPlus className="w-4 h-4 group-hover:text-muted-foreground" />
                    <p className="font-semibold">Tambah</p>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className="text-left">
                    <DialogTitle className="text-2xl font-semibold">
                        Buat Pertanyaan
                    </DialogTitle>
                    <DialogDescription>
                        Buat Pertanyaan baru dan mulailah mengumpulkan jawaban
                    </DialogDescription>
                </DialogHeader>
                <Form {...question}>
                    <form
                        onSubmit={question.handleSubmit(handleQuestionSubmit)}
                    >
                        <FormField
                            control={question.control}
                            name="question"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pertanyaan</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={question.control}
                            name="acronim"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Akronim</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={question.control}
                            name="option_1"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Opsi 1</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={question.control}
                            name="option_2"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Opsi 2</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={question.control}
                            name="option_3"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Opsi 3</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={question.control}
                            name="option_4"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Opsi 4</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
                <DialogFooter>
                    <Button
                        onClick={question.handleSubmit(handleQuestionSubmit)}
                        disabled={question.formState.isSubmitting}
                        className="w-full bg-primary text-secondary"
                    >
                        Simpan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
