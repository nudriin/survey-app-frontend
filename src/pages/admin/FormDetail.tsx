import DashboardLayout from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { FormResponse } from "@/model/FormModel"
import { Separator } from "@/components/ui/separator"
import { ReactNode, useCallback, useEffect, useRef, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ChevronRightIcon } from "@radix-ui/react-icons"
import { ElementsType, FormElementInstance } from "../../components/FormElement"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { FaEdit } from "react-icons/fa"
import * as XLSX from "xlsx"

export default function FormDetail() {
    return (
        <div>
            <DashboardLayout>
                <FormSubmissions />
            </DashboardLayout>
        </div>
    )
}

function StatsCards({ forms }: { forms: FormResponse | undefined }) {
    return (
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 ">
            <StatsCard
                title="Total Kunjungan"
                value={forms?.visit.toString() ?? "0"}
                helperText="Jumlah total data kunjungan pada formulir"
                className="text-left border-2 rounded-lg shadow-box dark:shadow-light border-darks2 dark:border-primary"
            />
            <StatsCard
                title="Total Jawaban"
                value={forms?.submissions.toString() ?? "0"}
                helperText="Jumlah total jawaban yang diterima pada formulir"
                className="text-left border-2 rounded-lg shadow-box dark:shadow-light border-darks2 dark:border-primary"
            />
        </div>
    )
}

function StatsCard({
    title,
    value,
    helperText,
    className,
}: {
    title: string
    value: string
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

function FormSubmissions() {
    const [forms, setForms] = useState<FormResponse>()
    const { formId } = useParams()

    const getFormById = useCallback(async () => {
        try {
            const response = await fetch(`/api/v1/forms/${formId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
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
            toast({
                title: "Error",
                description: `${error}`,
                variant: "destructive",
            })
        }
    }, [formId])

    useEffect(() => {
        getFormById()
    }, [getFormById])

    const shareUrl = `${window.location.origin}/form/${forms?.shareURL}`

    return (
        <div className="mt-4">
            <div className="flex flex-col items-start w-full gap-2 p-4 text-left border-2 rounded-lg border-primary">
                <div className="flex items-center justify-between w-full gap-2">
                    <h1 className="text-4xl font-semibold text-left">
                        {forms?.name}
                    </h1>
                    <Button variant="outline" asChild>
                        <Link to={shareUrl} target="_blank" className="gap-1">
                            Lihat
                            <ChevronRightIcon className="w-4 h-4" />
                        </Link>
                    </Button>
                </div>
                <h2 className="lg:w-1/2">{forms?.description}</h2>
            </div>
            <div className="flex items-center justify-between w-full gap-2 my-4 border-2 rounded-lg border-primary">
                <Input
                    className="w-full border-0 text-purples"
                    readOnly
                    value={shareUrl}
                />
                <Button
                    className="w-32 rounded-l-none"
                    onClick={() => {
                        navigator.clipboard.writeText(shareUrl)
                        toast({
                            title: "Success",
                            description: "Link berhasil disalin",
                        })
                    }}
                >
                    Salin link
                </Button>
            </div>
            <StatsCards forms={forms} />
            <Separator className="my-6 bg-primary" />
            <SubmissionTable />
        </div>
    )

    type Row = { [key: string]: string } & {
        submittedAt: Date
    }
    function SubmissionTable() {
        const [forms, setForms] = useState<FormResponse>()
        const { formId } = useParams()
        const tableRef = useRef<HTMLTableElement>(null)

        const getFormById = useCallback(async () => {
            try {
                const response = await fetch(`/api/v1/forms/${formId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
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
                toast({
                    title: "Error",
                    description: `${error}`,
                    variant: "destructive",
                })
            }
        }, [formId])

        useEffect(() => {
            getFormById()
        }, [getFormById])

        const formcontent = forms?.content !== undefined ? forms.content : "[]"
        const formElements = JSON.parse(formcontent) as FormElementInstance[]

        const columns: {
            id: string
            label: string
            required: boolean
            type: ElementsType
        }[] = []

        formElements.forEach((el) => {
            switch (el.type) {
                case "TextField":
                case "NumberField":
                case "TextAreaField":
                case "DateField":
                case "SelectField":
                case "CheckboxField":
                    columns.push({
                        id: el.id,
                        label: el.extraAttr?.label,
                        required: el.extraAttr?.required,
                        type: el.type,
                    })
                    break
                default:
                    break
            }
        })

        const rows: Row[] = []
        forms?.formDetails.forEach((details) => {
            const content = JSON.parse(details.content)
            rows.push({
                ...content,
                submittedAt: details.createdAt,
            })
        })

        const exportToExcel = () => {
            if (!tableRef.current) return
            const dates = new Date().toLocaleDateString()
            const table = tableRef.current
            const wb = XLSX.utils.table_to_book(table)
            XLSX.writeFile(wb, `Laporan ${forms?.name} ${dates} .xlsx`)
        }

        return (
            <>
                <div className="flex items-center justify-between col-span-2 mb-2">
                    <h1 className="text-2xl font-semibold text-left">
                        Jawaban
                    </h1>
                    <Button className="bg-primary" onClick={exportToExcel}>
                        Export (xlsx)
                    </Button>
                </div>
                <div className="text-left border rounded-lg">
                    <Table ref={tableRef}>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No.</TableHead>
                                {columns.map((col, index) => (
                                    <TableHead key={index}>
                                        {col.label}
                                    </TableHead>
                                ))}
                                <TableHead>Dikirm Pada</TableHead>
                                <TableHead>Edit</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rows.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    {columns.map((col) => (
                                        <RowCell
                                            key={col.id}
                                            type={col.type}
                                            value={row[col.id]}
                                        />
                                    ))}
                                    <TableCell className="text-left text-muted-foreground">
                                        {format(row.submittedAt, "PP")}
                                    </TableCell>
                                    <td>
                                        <Button
                                            size={"icon"}
                                            className="my-2"
                                            asChild
                                        >
                                            <Link
                                                to={`/form/edit/${forms?.shareURL}/${forms?.formDetails[index].id}`}
                                            >
                                                <FaEdit />
                                            </Link>
                                        </Button>
                                    </td>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </>
        )
    }

    function RowCell({ type, value }: { type: ElementsType; value: string }) {
        let node: ReactNode = value

        switch (type) {
            case "DateField": {
                if (!value) break
                const date = new Date(value)
                node = (
                    <Badge variant={"outline"}>
                        {format(date, "dd/MM/yyyy")}
                    </Badge>
                )
                break
            }
            case "CheckboxField": {
                const checked = value === "true"
                node = <Checkbox checked={checked} disabled />
                break
            }
        }

        return <TableCell>{node}</TableCell>
    }
}
