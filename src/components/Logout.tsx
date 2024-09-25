import { useCookies } from 'react-cookie';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from './ui/alert-dialog';
import { Button } from './ui/button';

export default function Logout() {
    const [, , removeCookie] = useCookies(['auth']);

    const logout = () => {
        removeCookie('auth');
    };
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant={'destructive'}>Logout</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Kamu yakin ingin keluar dari halaman ini?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        <span>
                            Dengan menekan tombol logout, kamu akan otomatis
                            keluar dari halaman ini. Kamu dapat masuk kembali
                            melalui halaman login
                        </span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-destructive text-white hover:text-background"
                        onClick={logout}
                    >
                        Logout
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
