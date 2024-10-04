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
import { BiRightArrowAlt } from "react-icons/bi"
import { Link } from "react-router-dom"
import DistributionCharts from "@/components/DistributionCharts"
import MonthlySubmissionCharts from "@/components/MonthlySubmissionCharts"

export default function Dashboard() {
    return (
        <div>
            <StatsCards />
            <Separator className="my-6 bg-primary" />
            <h1 className="text-2xl font-semibold col-span-2 text-left">
                Formulir Survei
            </h1>
            <Separator className="my-6 bg-primary" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <div className="w-full pt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
                <StatsCard
                    title="Total Kunjungan"
                    value={statistics?.totalVisit}
                    helperText="Jumlah total data kunjungan pada seluruh formulir"
                    className="shadow-box dark:shadow-light border-2 border-darks2 md:col-span-2 lg:col-span-1 dark:border-primary rounded-lg text-left"
                />
                <StatsCard
                    title="Total Jawaban"
                    value={statistics?.totalSubmission}
                    helperText="Jumlah total jawaban yang diterima pada seluruh formulir"
                    className="shadow-box dark:shadow-light border-2 border-darks2 dark:border-primary rounded-lg text-left"
                />
                <StatsCard
                    title="Jawaban Bulan ini"
                    value={statistics?.totalSubmissionThisMonth}
                    helperText="Jumlah total jawaban yang diterima pada seluruh formulir dalam bulan ini"
                    className="shadow-box dark:shadow-light border-2 border-darks2 dark:border-primary rounded-lg text-left"
                />
            </div>
            <div className="w-full pt-8 grid grid-cols-1 md:grid-cols-2 gap-4 ">
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
            <CardHeader className="space-y-0 pb-2">
                <CardTitle className="">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <h1 className="text-4xl font-bold my-2 text-purples">
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
    return (
        <Card className="group border-primary/20 h-full rounded-lg hover:cursor-pointer gap-4 shadow-box dark:shadow-light border-2 border-darks2 dark:border-primary text-left">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{form.name}</span>
                    {form.published && <Badge>Publish</Badge>}
                    {!form.published && (
                        <Badge variant="destructive">Draft</Badge>
                    )}
                </CardTitle>
                <CardDescription className="flex items-center justify-between text-muted-foreground text-sm">
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
            <CardFooter>
                {form.published && (
                    <Button
                        asChild
                        className="gap-2 text-white bg-purples w-full"
                    >
                        <Link to={`/forms/${form.id}`}>
                            Lihat Jawaban <BiRightArrowAlt />
                        </Link>
                    </Button>
                )}
                {!form.published && (
                    <Button
                        asChild
                        className="gap-2 bg-muted-foreground text-white w-full"
                    >
                        <Link to={`/build/${form.id}`}>
                            Edit Formulir <FaEdit />
                        </Link>
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}
