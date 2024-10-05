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
} from "./ui/alert-dialog"
import { Button } from "./ui/button"
import { MdOutlinePublish } from "react-icons/md"
import { FaIcons } from "react-icons/fa"
import { useState } from "react"
import { useCookies } from "react-cookie"
import { toast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import useDesigner from "@/hooks/useDesigner"

export default function PublishFormBtn({ id }: { id: number | undefined }) {
    const [loading, setLoading] = useState<boolean>(false)
    const [cookie] = useCookies(["auth"])
    const token = cookie.auth
    const navigate = useNavigate()
    const { elements } = useDesigner()

    const publishForm = async () => {
        try {
            setLoading(true)
            const response = await fetch("/api/v1/forms", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id: id,
                    content: JSON.stringify(elements),
                    published: true,
                }),
            })

            const body = await response.json()
            if (!body.errors) {
                toast({
                    title: "Sukses",
                    description: "Form berhasil di publikasikan",
                })
                setLoading(false)
                navigate(`/forms/${id}`)
            } else {
                toast({
                    title: "Error",
                    description: "Gagal mempublikasikan form",
                    variant: "destructive",
                })
                setLoading(false)
                throw new Error(body.errors)
            }
        } catch (error) {
            navigate(0)
            setLoading(false)
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
                <Button className="gap-2 bg-purples">
                    Publish <MdOutlinePublish />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Kamu yakin ingin mempublikasikan formulir ini?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        <span>
                            Dengan mempublikasikan formulir ini, formulir akan
                            dapat di akses secara publik
                        </span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={loading}
                        className="bg-purples"
                        onClick={publishForm}
                    >
                        Proses {loading && <FaIcons className="animate-spin" />}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
