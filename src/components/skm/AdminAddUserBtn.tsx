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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select"

const userAddSchema = z.object({
    email: z.string().email().min(1).max(225),
    password: z.string().min(1).max(225),
    name: z.string().min(1).max(225),
    role: z.string().min(1).max(225),
})

type userAddSchemaType = z.infer<typeof userAddSchema>

export default function AdminAddUserBtn() {
    const user = useForm<userAddSchemaType>({
        resolver: zodResolver(userAddSchema),
        defaultValues: {
            email: "",
            password: "",
            name: "",
            role: "USER",
        },
    })
    const [cookie] = useCookies(["auth"])
    const token = cookie.auth
    const navigate = useNavigate()

    const handleUserAdd = async (values: userAddSchemaType) => {
        try {
            const response = await fetch("/api/v1/users/admin/add", {
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
                    description: "User berhasil dibuat",
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
                <Button className="flex items-center justify-center h-full gap-2 rounded-lg bg-primary group hover:border-primary hover:cursor-pointer text-secondary">
                    <BsFileEarmarkPlus className="w-4 h-4 group-hover:text-muted-foreground" />
                    <p className="font-semibold">Tambah User</p>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className="text-left">
                    <DialogTitle className="text-2xl font-semibold">
                        Tambah user
                    </DialogTitle>
                    <DialogDescription>
                        Tambah user dengan berbagai role yang sesuai dengan
                        kebutuhan
                    </DialogDescription>
                </DialogHeader>
                <Form {...user}>
                    <form onSubmit={user.handleSubmit(handleUserAdd)}>
                        <FormField
                            control={user.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={user.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={user.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={user.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="USER">
                                                    User
                                                </SelectItem>
                                                <SelectItem value="ADMIN">
                                                    Admin
                                                </SelectItem>
                                                <SelectItem value="SUPER_ADMIN">
                                                    Super Admin
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
                <DialogFooter>
                    <Button
                        onClick={user.handleSubmit(handleUserAdd)}
                        disabled={user.formState.isSubmitting}
                        className="w-full bg-primary text-secondary"
                    >
                        Simpan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
