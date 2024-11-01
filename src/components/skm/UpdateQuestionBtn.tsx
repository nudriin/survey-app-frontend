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
import { Input } from "../ui/input"
import { toast } from "../../hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { FaEdit } from "react-icons/fa"
import { useState } from "react"
import { QuestionResponse } from "@/model/SkmModel"

const questionSchema = z.object({
    id: z.number().min(1),
    question: z.string().min(1).max(225).optional(),
    acronim: z.string().min(1).max(225).optional(),
    option_1: z.string().min(1).max(225).optional(),
    option_2: z.string().min(1).max(225).optional(),
    option_3: z.string().min(1).max(225).optional(),
    option_4: z.string().min(1).max(225).optional(),
    status: z.boolean().optional(),
})

type questionSchemaType = z.infer<typeof questionSchema>

export default function UpdateQuestionBtn({ id }: { id: number }) {
    const [cookie] = useCookies(["auth"])
    const token = cookie.auth
    const navigate = useNavigate()
    const [questionData, setQuestionData] = useState<QuestionResponse>()
    const question = useForm<questionSchemaType>({
        resolver: zodResolver(questionSchema),
        defaultValues: {
            id: id,
            question: questionData?.question,
            acronim: questionData?.acronim,
            option_1: questionData?.option_1,
            option_2: questionData?.option_2,
            option_3: questionData?.option_3,
            option_4: questionData?.option_4,
        },
    })

    const { reset } = question

    const getQuestionById = async () => {
        try {
            const response = await fetch(`/api/v1/skm/question/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            const body = await response.json()
            if (!body.errors) {
                setQuestionData(body.data)
                reset({
                    id: body.data.id,
                    question: body.data.question,
                    acronim: body.data.acronim,
                    option_1: body.data.option_1,
                    option_2: body.data.option_2,
                    option_3: body.data.option_3,
                    option_4: body.data.option_4,
                })
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

    const handleQuestionSubmit = async (values: questionSchemaType) => {
        try {
            const response = await fetch("/api/v1/skm/question", {
                method: "PATCH",
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
                    description: "Pertanyaan berhasil diubah",
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
                <Button size={"icon"} onClick={getQuestionById}>
                    <FaEdit />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className="text-left">
                    <DialogTitle className="text-2xl font-semibold">
                        Ubah Pertanyaan
                    </DialogTitle>
                    <DialogDescription>
                        Ubah Pertanyaan menjadi lebih baru
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
                                        <Input
                                            defaultValue={
                                                questionData?.question
                                            }
                                            placeholder={questionData?.question}
                                            {...field}
                                        />
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
