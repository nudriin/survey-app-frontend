import useDesigner from '@/hooks/useDesigner';
import { Button } from './ui/button';
import { HiSaveAs } from 'react-icons/hi';
import { useCookies } from 'react-cookie';
import { toast } from '@/hooks/use-toast';

export default function SaveFormBtn({ id }: { id: number | undefined }) {
    const { elements } = useDesigner();
    const [cookie] = useCookies(['auth']);
    const token = cookie.auth;

    const updateFormContent = async () => {
        try {
            const response = await fetch('/api/v1/forms', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id: id,
                    content: JSON.stringify(elements), // must string json to store
                }),
            });

            const body = await response.json();
            if (!body.errors) {
                toast({
                    title: 'Sukses',
                    description: 'Form berhasil disimpan',
                });
            } else {
                toast({
                    title: 'Error',
                    description: 'Gagal menyimpan form',
                    variant: 'destructive',
                });
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
    return (
        <Button
            variant={'outline'}
            className="gap-2"
            onClick={updateFormContent}
        >
            Simpan <HiSaveAs />
        </Button>
    );
}
