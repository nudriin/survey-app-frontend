import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { UserResponse } from "@/model/UserModel"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useCookies } from "react-cookie"
import { useNavigate } from "react-router-dom"
import ReCAPTCHA from "react-google-recaptcha"
import { useRef } from "react"

const formSchema = z.object({
    email: z.string().email({ message: "Email tidak valid" }).min(1).max(225),
    password: z
        .string()
        .min(4, {
            message: "Password minimal 4 karakter",
        })
        .max(225),
})

type formSchemaType = z.infer<typeof formSchema>

export default function Login() {
    const form = useForm<formSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const [, setCookie] = useCookies(["auth"])
    const { toast } = useToast()
    const navigate = useNavigate()
    const captchaRef = useRef<ReCAPTCHA | null>(null)

    const handleFormSubmit = async (value: formSchemaType) => {
        console.log(value)
        try {
            const captchaToken = captchaRef?.current?.getValue()
            const captchaReponse = await fetch(`/api/v1/users/verify/captcha`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: captchaToken }),
            })

            const captchaBody = await captchaReponse.json()

            if (!captchaBody.errors && captchaBody.data.success) {
                console.log("Human 👨 👩")
            } else {
                console.log("Robot 🤖")
                throw new Error("gagal verifikasikan reCaptcha")
            }
            captchaRef?.current?.reset()

            const response = await fetchLogin(value)
            setCookie("auth", response.token)
            toast({
                title: "Sukses",
                description: "Login berhasil",
            })
            navigate("/skm/dashboard")
        } catch (error) {
            toast({
                title: "Error",
                description: `${error}`,
                variant: "destructive",
            })
        }
    }
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full h-full text-left border-2 border-primary shadow-box dark:shadow-light md:w-1/2 lg:w-1/3">
                <CardHeader>
                    <CardTitle className="mt-4 text-4xl">Login</CardTitle>
                    <CardDescription>
                        Mohon masukan data anda dengan benar
                    </CardDescription>
                </CardHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleFormSubmit)}
                        className="space-y-4"
                    >
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="contoh@email.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Mohon masukan email anda!
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="rahasia***"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Mohon masukan password anda!
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter className="flex-col gap-4 felx">
                            <ReCAPTCHA
                                sitekey={import.meta.env.VITE_APP_SITE_KEY}
                                ref={captchaRef}
                            />
                            <Button
                                onClick={form.handleSubmit(handleFormSubmit)}
                                disabled={form.formState.isSubmitting}
                                className="w-full mb-4 font-semibold text-white bg-purples hover:text-background"
                            >
                                Login
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    )
}

async function fetchLogin(request: formSchemaType): Promise<UserResponse> {
    const response = await fetch("/api/v1/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    })

    const body = await response.json()
    if (body.errors) {
        throw new Error(body.errors)
    }

    return body.data
}
