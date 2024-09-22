import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { UserResponse } from '@/model/UserModel';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const formSchema = z.object({
    email: z.string().email({ message: 'Email tidak valid' }).min(1).max(225),
    password: z
        .string()
        .min(4, {
            message: 'Password minimal 4 karakter',
        })
        .max(225),
});

type formSchemaType = z.infer<typeof formSchema>;

export default function Login() {
    const form = useForm<formSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const [, setCookie] = useCookies(['auth']);
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleFormSubmit = async (value: formSchemaType) => {
        console.log(value);
        try {
            const response = await fetchLogin(value);
            setCookie('auth', response.token);
            toast({
                title: 'Sukses',
                description: 'Login berhasil',
            });
            navigate('/');
        } catch (error) {
            toast({
                title: 'Error',
                description: `${error}`,
                variant: 'destructive',
            });
        }
    };
    return (
        <div className="min-h-screen flex justify-center items-center">
            <Card className="border-2 border-darks2 shadow-box text-left w-full md:w-1/2 lg:w-1/3 h-full">
                <CardHeader>
                    <CardTitle className="text-4xl mt-4">Login</CardTitle>
                    <CardDescription>
                        Mohon masukan data anda dengan benar
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleFormSubmit)}
                            className="space-y-4"
                        >
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
                        </form>
                    </Form>
                </CardContent>
                <CardFooter>
                    <Button
                        onClick={form.handleSubmit(handleFormSubmit)}
                        disabled={form.formState.isSubmitting}
                        className="bg-purples w-full font-semibold mb-4"
                    >
                        Login
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

async function fetchLogin(request: formSchemaType): Promise<UserResponse> {
    const response = await fetch('/api/v1/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    const body = await response.json();
    if (body.errors) {
        throw new Error(body.errors);
    }

    return body.data;
}
