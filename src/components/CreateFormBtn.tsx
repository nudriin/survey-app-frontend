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
    });

    const handleFormSubmit = (values: formSchemaType) => {
        try {
            console.log(values);
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
                <Button className="bg-purples">Buat formulir baru</Button>
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
