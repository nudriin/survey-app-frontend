'use client';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTrigger,
} from './ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Textarea } from './ui/textarea';
import { DialogTitle } from '@radix-ui/react-dialog';
import { toast } from '@/hooks/use-toast';
import { BsFileEarmarkPlus } from 'react-icons/bs';
import { FormResponse } from '@/model/FormModel';
import { useCookies } from 'react-cookie';
const formSchema = z.object({
    name: z.string().min(2, {
        message: 'Nama minimal 2 karakter',
    }),
    description: z.string().optional(),
});

type formSchemaType = z.infer<typeof formSchema>;
export default function CreateFormBtn() {
    const form = useForm<formSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
        },
    });
    const [cookie] = useCookies(['auth']);
    const token = cookie.auth;

    const handleFormSubmit = async (values: formSchemaType) => {
        try {
            await saveForm(values, token);
            toast({
                title: 'Sukses',
                description: 'Form berhasil dibuat',
            });
        } catch (error) {
            console.log(error);
            toast({
                title: 'Error',
                description: 'Ada sesuatu yang salah, silahkan coba lagi',
                variant: 'destructive',
            });
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-purples group border-primary/20 h-full min-h-[140px] items-center rounded-lg justify-center flex flex-col hover:border-primary hover:cursor-pointer gap-4 shadow-box border-2 border-darks2">
                    <BsFileEarmarkPlus className="h-8 w-8 group-hover:text-muted-foreground" />
                    <p className="font-semibold">Buat formulir baru</p>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className="text-left">
                    <DialogTitle className="text-2xl font-semibold">
                        Buat formulir
                    </DialogTitle>
                    <DialogDescription>
                        Buat formulir baru dan kumpulkan jawaban dari pengunjung
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleFormSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Deskripsi</FormLabel>
                                    <FormControl>
                                        <Textarea rows={5} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
                <DialogFooter>
                    <Button
                        onClick={form.handleSubmit(handleFormSubmit)}
                        disabled={form.formState.isSubmitting}
                        className="bg-purples w-full"
                    >
                        Simpan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

async function saveForm(
    request: formSchemaType,
    token: string
): Promise<FormResponse> {
    const response = await fetch('/api/v1/forms', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(request),
    });

    const body = await response.json();
    if (body.errors) {
        throw new Error(body.errors);
    }

    return body.data;
}
