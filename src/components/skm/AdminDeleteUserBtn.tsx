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
import { TbTrashXFilled } from "react-icons/tb"
import { FaIcons } from "react-icons/fa"
import { Button } from "../ui/button"
import { useState } from "react"
import { useCookies } from "react-cookie"
import { useNavigate } from "react-router-dom"
import { toast } from "../../hooks/use-toast"
export default function AdminDeleteUserBtn({ id }: { id: number }) {
    const [loading, setLoading] = useState<boolean>(false)
    const [cookie] = useCookies(["auth"])
    const token = cookie.auth
    const navigate = useNavigate()
    const handleDelete = async () => {
        try {
            setLoading(true)
            const response = await fetch(`/api/v1/users/admin/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
            const body = await response.json()

            if (!body.errors) {
                setLoading(false)
                toast({
                    title: "Sukses",
                    description: "User berhasil dihapus",
                })
                navigate(0)
            } else {
                setLoading(false)
                throw new Error(body.errors)
            }
        } catch (error) {
            setLoading(false)
            console.log(error)
            toast({
                title: "Error",
                description: `${error}`,
                variant: "destructive",
            })
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className="bg-red-500">
                    <TbTrashXFilled />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Kamu yakin ingin menghapus user ini?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        <span className="text-red-500">
                            Dengan menghapus user ini, kamu tidak akan bisa
                            mengembalikannya lagi
                        </span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={loading}
                        className="bg-red-500"
                        onClick={handleDelete}
                    >
                        Hapus {loading && <FaIcons className="animate-spin" />}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
