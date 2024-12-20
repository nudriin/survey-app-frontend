import { BiSolidTrash } from "react-icons/bi"
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
} from "../ui/alert-dialog"
import { Button } from "../ui/button"
import { useCookies } from "react-cookie"
import { useNavigate } from "react-router-dom"
import { toast } from "@/hooks/use-toast"

export default function RespondenDeleteBtn({ id }: { id: number }) {
    const [cookie] = useCookies(["auth"])
    const token = cookie.auth
    const navigate = useNavigate()

    const deleteResponden = async () => {
        try {
            const response = await fetch(`/api/v1/skm/responden/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })

            const body = await response.json()
            if (!body.errors) {
                toast({
                    title: "Sukses",
                    description: "Responden berhasil dihapus",
                })
                navigate(0)
            } else {
                throw new Error(body.errors)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className="bg-destructive" size={"icon"}>
                    <BiSolidTrash />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Peringatan !!!</AlertDialogTitle>
                    <AlertDialogDescription>
                        <span>
                            Dengan menghapus responden ini, kamu akan kehilangan
                            seluruh data jawaban yang tersimpan di untuk
                            responden ini
                        </span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={deleteResponden}>
                        Hapus
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
