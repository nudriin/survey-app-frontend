import CreateFormBtn from "@/components/CreateFormBtn"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FormResponse, FormTotalStatistics } from "@/model/FormModel"
import { formatDistance } from "date-fns"
import { useCallback, useEffect, useState } from "react"
import { useCookies } from "react-cookie"
import { BsEyeFill } from "react-icons/bs"
import { FaEdit, FaWpforms } from "react-icons/fa"
import { BiRightArrowAlt, BiSolidTrash } from "react-icons/bi"
import { Link, useNavigate } from "react-router-dom"
import DistributionCharts from "@/components/DistributionCharts"
import MonthlySubmissionCharts from "@/components/MonthlySubmissionCharts"
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
} from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"

export default function Dashboard() {
    return (
        <div>
            <StatsCards />
            <Separator className="my-6 bg-primary" />
            <h1 className="col-span-2 text-2xl font-semibold text-left">
                Formulir Survei
            </h1>
            <Separator className="my-6 bg-primary" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <CreateFormBtn />
                <FormsCards />
            </div>
        </div>
    )
}

function StatsCards() {
    const [statistics, setStatistics] = useState<FormTotalStatistics>()
    const [cookie] = useCookies(["auth"])
    const token = cookie.auth

    const getAllStatistics = useCallback(async () => {
        try {
            const response = await fetch("/api/v1/forms/all/statistics", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
            const body = await response.json()
            if (!body.errors) {
                setStatistics(body.data)
            } else {
                throw new Error(body.errors)
            }
        } catch (error) {
            console.log(error)
        }
    }, [token])

    useEffect(() => {
        getAllStatistics()
    }, [getAllStatistics])

    return (
        <DashboardLayout>
            <div className="grid w-full grid-cols-1 gap-4 pt-8 md:grid-cols-2 lg:grid-cols-3 ">
                <StatsCard
                    title="Total Kunjungan"
                    value={statistics?.totalVisit}
                    helperText="Jumlah total data kunjungan pada seluruh formulir"
                    className="text-left border-2 rounded-lg shadow-box dark:shadow-light border-darks2 md:col-span-2 lg:col-span-1 dark:border-primary"
                />
                <StatsCard
                    title="Total Jawaban"
                    value={statistics?.totalSubmission}
                    helperText="Jumlah total jawaban yang diterima pada seluruh formulir"
                    className="text-left border-2 rounded-lg shadow-box dark:shadow-light border-darks2 dark:border-primary"
                />
                <StatsCard
                    title="Jawaban Bulan ini"
                    value={statistics?.totalSubmissionThisMonth}
                    helperText="Jumlah total jawaban yang diterima pada seluruh formulir dalam bulan ini"
                    className="text-left border-2 rounded-lg shadow-box dark:shadow-light border-darks2 dark:border-primary"
                />
            </div>
            <div className="grid w-full grid-cols-1 gap-4 pt-8 md:grid-cols-2 ">
                <DistributionCharts />
                <MonthlySubmissionCharts />
            </div>
        </DashboardLayout>
    )
}

function StatsCard({
    title,
    value,
    helperText,
    className,
}: {
    title: string
    value: number | undefined
    helperText: string
    className: string
}) {
    return (
        <Card className={className}>
            <CardHeader className="pb-2 space-y-0">
                <CardTitle className="">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <h1 className="my-2 text-4xl font-bold text-purples">
                    {value}
                </h1>
                <p className="text-sm text-muted-foreground">{helperText}</p>
            </CardContent>
        </Card>
    )
}

function FormsCards() {
    const [forms, setForms] = useState<FormResponse[]>([])
    const [cookie] = useCookies(["auth"])
    const token = cookie.auth

    const getAllForms = useCallback(async () => {
        try {
            const response = await fetch("/api/v1/forms", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
            const body = await response.json()
            if (!body.errors) {
                setForms(body.data)
            } else {
                throw new Error(body.errors)
            }
        } catch (error) {
            console.log(error)
        }
    }, [token])

    useEffect(() => {
        getAllForms()
    }, [getAllForms])
    return (
        <>
            {forms.map((value, index) => (
                <FormsCard key={index} form={value} />
            ))}
        </>
    )
}

function FormsCard({ form }: { form: FormResponse }) {
    const navigate = useNavigate()
    return (
        <Card className="h-full gap-4 text-left border-2 rounded-lg group border-primary/20 hover:cursor-pointer shadow-box dark:shadow-light border-darks2 dark:border-primary">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{form.name}</span>
                    {form.published && <Badge>Publish</Badge>}
                    {!form.published && (
                        <Badge variant="destructive">Draft</Badge>
                    )}
                </CardTitle>
                <CardDescription className="flex items-center justify-between text-sm text-muted-foreground">
                    {formatDistance(form.createdAt, new Date(), {
                        addSuffix: true,
                    })}
                    {form.published && (
                        <span className="flex items-center gap-2">
                            <BsEyeFill className="text-muted-foreground" />
                            <span>{form.visit}</span>
                            <FaWpforms className="text-muted-foreground" />
                            <span>{form.submissions}</span>
                        </span>
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent className="truncate">
                {form.description || "Tidak ada deskripsi"}
            </CardContent>
            <CardFooter className="flex gap-2">
                {form.published && (
                    <Button
                        asChild
                        className="w-full gap-2 text-white bg-purples"
                    >
                        <Link to={`/forms/${form.id}`}>
                            Lihat <BiRightArrowAlt />
                        </Link>
                    </Button>
                )}
                {form.published ? (
                    <DialogButton
                        isDelete={false}
                        dialogTitle="Peringatan !!!"
                        dialogDescription="Dengan mengedit formulir ini, kamu mungkin akan kehilangan beberapa data jawaban yang sebelumnya telah tersimpan di formulir"
                        id={form.id}
                        dialogActionText="Edit"
                        className="w-full gap-2 text-secondary bg-primary"
                        dialogActionClass="text-secondary bg-primary"
                    />
                ) : (
                    <Button
                        className="w-full gap-2 text-secondary bg-primary"
                        onClick={() => navigate(`/build/${form.id}`)}
                    >
                        Edit
                        <FaEdit />
                    </Button>
                )}
                <DialogButton
                    isDelete={true}
                    dialogTitle="Peringatan !!!"
                    dialogDescription="Dengan menghapus formulir ini, kamu akan kehilangan seluruh data jawaban yang tersimpan di formulir"
                    id={form.id}
                    dialogActionText="Hapus"
                    className="w-full gap-2 text-white bg-destructive"
                    dialogActionClass="text-white bg-destructive"
                />
            </CardFooter>
        </Card>
    )
}

function DialogButton({
    isDelete,
    dialogTitle,
    dialogDescription,
    dialogActionText,
    dialogActionClass,
    id,
    className,
}: {
    isDelete: boolean
    dialogTitle: string
    dialogDescription: string
    dialogActionText: string
    dialogActionClass: string
    id: number
    className: string
}) {
    const navigate = useNavigate()
    const [cookie] = useCookies(["auth"])
    const token = cookie.auth

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/v1/forms/${id}`, {
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
                    description: "Form berhasil dihapus",
                })
                navigate(0)
            } else {
                throw new Error(body.errors)
            }
        } catch (error) {
            console.log(error)
            toast({
                title: "Error",
                description: "Ada sesuatu yang salah, silahkan coba lagi",
                variant: "destructive",
            })
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className={className} size={"icon"}>
                    {isDelete ? <BiSolidTrash /> : <FaEdit />}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
                    <AlertDialogDescription>
                        <span>{dialogDescription}</span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                        className={dialogActionClass}
                        onClick={() =>
                            isDelete ? handleDelete() : navigate(`/build/${id}`)
                        }
                    >
                        {dialogActionText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
