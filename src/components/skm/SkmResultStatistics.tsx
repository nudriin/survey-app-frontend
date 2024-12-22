/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponsesWithQuestionResponse } from "@/model/SkmModel"
import { useCallback, useEffect, useRef, useState } from "react"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "../ui/chart"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"
import StatsCard from "./StatsCard"
import * as XLSX from "xlsx"
import { Button } from "../ui/button"
import * as htmlToImage from "html-to-image"
import { saveAs } from "file-saver"
import { LuDownload } from "react-icons/lu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select"

export default function SkmResultStatistics() {
    const [responsesQuestion, setResponsesQuestion] = useState<
        ResponsesWithQuestionResponse[]
    >([])
    const [responsesQuestionSixMonths, setResponsesQuestionSixMonths] =
        useState<ResponsesWithQuestionResponse[]>([])
    const [countResponden, setCountResponden] = useState<number>(0)
    const [selectedRange, setSelectedRange] = useState("six_months")

    const getAllResponsesQuestion = useCallback(async () => {
        try {
            const response = await fetch("/api/v1/skm/responses", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            const body = await response.json()

            if (!body.errors) {
                setResponsesQuestion(body.data)
            } else {
                throw new Error(body.errors)
            }
        } catch (error) {
            console.log(error)
        }
    }, [])

    const getAllResponsesQuestionThisSemester = useCallback(async () => {
        try {
            const response = await fetch("/api/v1/skm/responses/semester", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            const body = await response.json()

            if (!body.errors) {
                setResponsesQuestionSixMonths(body.data)
            } else {
                throw new Error(body.errors)
            }
        } catch (error) {
            console.log(error)
        }
    }, [])

    const getCountResponden = useCallback(async () => {
        try {
            const response = await fetch("/api/v1/skm/responden/count/total", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            const body = await response.json()

            if (!body.errors) {
                setCountResponden(body.data)
            } else {
                throw new Error(body.errors)
            }
        } catch (error) {
            console.log(error)
        }
    }, [])

    useEffect(() => {
        if (selectedRange === "six_months") {
            getAllResponsesQuestionThisSemester()
        } else if (selectedRange === "all_time") {
            getAllResponsesQuestion()
        }
        getCountResponden()
    }, [
        getAllResponsesQuestion,
        getCountResponden,
        getAllResponsesQuestionThisSemester,
        selectedRange,
    ])

    const handleRangeChange = (event: string) => {
        setSelectedRange(event)
        console.log(event)
    }

    let displayedData: ResponsesWithQuestionResponse[] = []
    if (selectedRange === "six_months") {
        displayedData = responsesQuestionSixMonths
    } else if (selectedRange === "all_time") {
        displayedData = responsesQuestion
    }

    const quisionerTotal = displayedData.length
    const unitIKM = Number(
        (
            displayedData.reduce((grandTotal, value) => {
                if (value.responses.length === 0) {
                    return grandTotal
                }
                const ikmValue =
                    (value.responses.reduce(
                        (total, opt) => total + (opt.select_option ?? 0),
                        0
                    ) /
                        value.responses.length) *
                    0.111

                return grandTotal + ikmValue
            }, 0) * 25
        ).toFixed(3)
    )

    const exportAllToExcel = (
        responsesQuestion: any[],
        quisionerTotal: any,
        countResponden: any,
        unitIKM: any
    ) => {
        // Responses Sheet
        const responsesSheet = XLSX.utils.json_to_sheet(
            responsesQuestion.map(
                (
                    question: { responses: any[]; acronim: any },
                    index: number
                ) => {
                    // Calculate NRR
                    const nrr = (
                        question.responses.reduce(
                            (total: any, opt: { select_option: any }) =>
                                total + (opt.select_option ?? 4),
                            0
                        ) / question.responses.length
                    ).toFixed(3)

                    // Determine the "Keterangan" based on NRR value
                    let keterangan
                    const floatNRR = parseFloat(nrr)
                    if (floatNRR >= 1.0 && floatNRR <= 2.5996) {
                        keterangan = "Tidak Baik"
                    } else if (floatNRR >= 2.6 && floatNRR <= 3.064) {
                        keterangan = "Kurang Baik"
                    } else if (floatNRR >= 3.0644 && floatNRR <= 3.532) {
                        keterangan = "Baik"
                    } else {
                        keterangan = "Sangat Baik"
                    }

                    // Return data for each row in the sheet
                    return {
                        No: index + 1,
                        "Unsur Pelayanan": question.acronim,
                        NRR: nrr,
                        Keterangan: keterangan,
                    }
                }
            )
        )

        // Summary Sheet
        const summarySheet = XLSX.utils.json_to_sheet([
            { Label: "Total Kuisioner", Value: quisionerTotal },
            { Label: "Total Jawaban", Value: countResponden },
            { Label: "IKM Unit Pelayanan", Value: unitIKM },
        ])

        // ResultTable Sheet
        const resultTableData = []

        // Header row
        const headerRow = ["No"]
        responsesQuestion.forEach((value: { acronim: string }) => {
            headerRow.push(value.acronim)
        })
        resultTableData.push(headerRow)

        // Populate each row of `select_option` values
        responsesQuestion[0]?.responses.forEach((_: any, index: number) => {
            const row = [index + 1]
            responsesQuestion.forEach(
                (question: {
                    responses: { [x: string]: { select_option: any } }
                }) => {
                    row.push(question.responses[index].select_option ?? 4)
                }
            )
            resultTableData.push(row)
        })

        // Total row
        const totalRow = ["Total"]
        responsesQuestion.forEach((value: { responses: any[] }) => {
            const total = value.responses.reduce(
                (sum: any, opt: { select_option: any }) =>
                    sum + (opt.select_option ?? 4),
                0
            )
            totalRow.push(total)
        })
        resultTableData.push(totalRow)

        // NRR/Unsur row
        const nrrUnsurRow = ["NRR/Unsur"]
        responsesQuestion.forEach((value: { responses: any[] }) => {
            const nrr = (
                value.responses.reduce(
                    (sum: any, opt: { select_option: any }) =>
                        sum + (opt.select_option ?? 4),
                    0
                ) / value.responses.length
            ).toFixed(3)
            nrrUnsurRow.push(nrr)
        })
        resultTableData.push(nrrUnsurRow)

        // NRR Tertimbang row
        const nrrTertimbangRow = ["NRR Tertimbang"]
        responsesQuestion.forEach((value: { responses: any[] }) => {
            const nrrTertimbang = (
                (value.responses.reduce(
                    (sum: any, opt: { select_option: any }) =>
                        sum + (opt.select_option ?? 4),
                    0
                ) /
                    value.responses.length) *
                0.111
            ).toFixed(3)
            nrrTertimbangRow.push(nrrTertimbang)
        })
        resultTableData.push(nrrTertimbangRow)

        // IKM Unit Pelayanan row
        const ikmUnitRow = ["IKM Unit Pelayanan"]
        const ikmUnitValue = (
            responsesQuestion.reduce(
                (grandTotal: number, value: { responses: any[] }) => {
                    const nrrTertimbang =
                        (value.responses.reduce(
                            (sum: any, opt: { select_option: any }) =>
                                sum + (opt.select_option ?? 4),
                            0
                        ) /
                            value.responses.length) *
                        0.111
                    return grandTotal + nrrTertimbang
                },
                0
            ) * 25
        ).toFixed(3)
        ikmUnitRow.push(ikmUnitValue)
        for (let i = 1; i < responsesQuestion.length; i++) {
            ikmUnitRow.push("")
        }
        resultTableData.push(ikmUnitRow)

        const resultTableSheet = XLSX.utils.aoa_to_sheet(resultTableData)

        // NrrBarChart Sheet
        const chartData = responsesQuestion.map(
            (item: { responses: any[] }, index: number) => {
                const averageValue = (
                    item.responses.reduce(
                        (total: any, opt: { select_option: any }) =>
                            total + (opt.select_option ?? 4),
                        0
                    ) / item.responses.length
                ).toFixed(3)

                return [`U${index + 1}`, averageValue]
            }
        )

        const barChartSheetData = [
            ["Label", "Rata-rata Penilaian"],
            ...chartData,
        ]
        const nrrBarChartSheet = XLSX.utils.aoa_to_sheet(barChartSheetData)

        // Create workbook and append all sheets
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, responsesSheet, "Responses")
        XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary")
        XLSX.utils.book_append_sheet(workbook, resultTableSheet, "ResultTable")
        XLSX.utils.book_append_sheet(workbook, nrrBarChartSheet, "NrrBarChart")

        // Export the workbook to an .xlsx file
        XLSX.writeFile(workbook, "SurveyResults.xlsx")
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-4"></div>
            <div className="flex justify-between">
                <div>
                    <Select
                        defaultValue={selectedRange}
                        onValueChange={handleRangeChange}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Rentang Hasil Survei" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="six_months">
                                6 Bulan Terakhir
                            </SelectItem>
                            <SelectItem value="all_time">Semua</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button
                    onClick={() =>
                        exportAllToExcel(
                            displayedData,
                            quisionerTotal,
                            countResponden,
                            unitIKM
                        )
                    }
                >
                    Export ke Excel
                </Button>
            </div>
            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 ">
                <StatsCard
                    title="Total Kuisioner"
                    value={quisionerTotal}
                    helperText="Jumlah total data kunjungan pada seluruh formulir"
                    className="text-left border-2 rounded-lg shadow-box dark:shadow-light border-darks2 md:col-span-2 lg:col-span-1 dark:border-primary"
                />
                <StatsCard
                    title="Total Jawaban"
                    value={countResponden}
                    helperText="Jumlah total jawaban yang diterima pada seluruh formulir dalam bulan ini"
                    className="text-left border-2 rounded-lg shadow-box dark:shadow-light border-darks2 dark:border-primary"
                />
                <StatsCard
                    title="IKM Unit Pelayanan"
                    value={unitIKM}
                    helperText="Jumlah total jawaban yang diterima pada seluruh formulir dalam bulan ini"
                    className="text-left border-2 rounded-lg shadow-box dark:shadow-light border-darks2 dark:border-primary"
                />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <NrrStatusTable responsesQuestion={displayedData} />
                <NrrBarChart responsesQuestion={displayedData} />
            </div>
            <ResultTable responsesQuestion={displayedData} />
        </div>
    )
}

export function ResultTable({
    responsesQuestion,
}: {
    responsesQuestion: ResponsesWithQuestionResponse[]
}) {
    return (
        <div className="p-4 overflow-hidden border-2 rounded-lg shadow-box dark:shadow-light border-darks2">
            <div className="flex justify-between mb-4">
                <h1 className="text-3xl font-semibold text-left">
                    Tabel Nilai Rata-Rata
                </h1>
            </div>
            <div className="overflow-x-auto text-center">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="p-1 text-white border-2 bg-purples border-primary">
                                No
                            </th>
                            {responsesQuestion.map((value) => (
                                <th
                                    key={value.id}
                                    className="p-1 text-white border-2 bg-purples border-primary"
                                >
                                    {value.acronim}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {responsesQuestion[0]?.responses.map((_, index) => (
                            <tr
                                key={index}
                                className="border-2 rounded-lg border-primary"
                            >
                                <td className="p-1 border-2 rounded-lg border-primary">
                                    {index + 1}
                                </td>
                                {responsesQuestion.map((question) => (
                                    <td
                                        key={question.id}
                                        className="p-1 border-2 rounded-lg border-primary"
                                    >
                                        {question?.responses[index]
                                            ?.select_option ?? 0}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        <tr>
                            <td className="p-1 font-semibold text-left border-2 rounded-lg border-primary">
                                Total
                            </td>
                            {responsesQuestion.map((value) => (
                                <td className="p-1 font-semibold border-2 rounded-lg border-primary">
                                    {value.responses.length > 0
                                        ? value.responses.reduce(
                                              (total, opt) =>
                                                  total + opt.select_option,
                                              0
                                          )
                                        : 0}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-1 font-semibold text-left border-2 rounded-lg border-primary">
                                NRR/Unsur
                            </td>
                            {responsesQuestion.map((value) => (
                                <td className="p-1 font-semibold border-2 rounded-lg border-primary">
                                    {value.responses.length > 0
                                        ? (
                                              value.responses.reduce(
                                                  (total, opt) =>
                                                      total + opt.select_option,
                                                  0
                                              ) / value.responses.length
                                          ).toFixed(3)
                                        : "0.000"}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-1 font-semibold text-left border-2 rounded-lg border-primary">
                                NRR Tertimbang
                            </td>
                            {responsesQuestion.map((value) => (
                                <td className="p-1 font-semibold border-2 rounded-lg border-primary">
                                    {
                                        value.responses.length > 0
                                            ? (
                                                  (value.responses.reduce(
                                                      (total, opt) =>
                                                          total +
                                                          opt.select_option,
                                                      0
                                                  ) /
                                                      value.responses.length) *
                                                  0.111
                                              ).toFixed(3)
                                            : "0.000" /* atau "-" */
                                    }
                                </td>
                            ))}
                        </tr>
                        <tr className="bg-muted-foreground text-secondary">
                            <td className="p-1 font-semibold text-left border-2 border-primary">
                                IKM Unit Pelayanan
                            </td>
                            <td
                                colSpan={responsesQuestion.length}
                                className="p-1 font-semibold border-2 border-primary"
                            >
                                {(
                                    responsesQuestion.reduce(
                                        (grandTotal, value) => {
                                            if (value.responses.length === 0) {
                                                return grandTotal
                                            }
                                            const ikmValue =
                                                (value.responses.reduce(
                                                    (total, opt) =>
                                                        total +
                                                        opt.select_option,
                                                    0
                                                ) /
                                                    value.responses.length) *
                                                0.111

                                            return grandTotal + ikmValue
                                        },
                                        0
                                    ) * 25
                                ).toFixed(3)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export function NrrStatusTable({
    responsesQuestion,
}: {
    responsesQuestion: ResponsesWithQuestionResponse[]
}) {
    return (
        <div className="p-4 overflow-hidden border-2 rounded-lg shadow-box dark:shadow-light border-darks2">
            <div className="flex justify-between mb-4">
                <h1 className="text-3xl font-semibold text-left">
                    Tabel Nilai Rata-Rata
                </h1>
            </div>
            <div className="overflow-x-auto text-left">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="p-1 text-white border-2 bg-purples border-primary">
                                No
                            </th>
                            <th className="p-1 text-white border-2 bg-purples border-primary">
                                Unsur Pelayanan
                            </th>
                            <th className="p-1 text-white border-2 bg-purples border-primary">
                                NRR
                            </th>
                            <th className="p-1 text-white border-2 bg-purples border-primary">
                                Keterangan
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {responsesQuestion.map((value, index) => (
                            <tr key={index}>
                                <td className="p-1 px-2 py-1 border-2 border-primary">
                                    U{index + 1}
                                </td>
                                <td
                                    key={value.id}
                                    className="p-1 px-2 py-1 border-2 border-primary"
                                >
                                    {value.acronim}
                                </td>
                                <td className="p-1 px-2 py-1 border-2 border-primary">
                                    {value.responses.length > 0
                                        ? (
                                              value.responses.reduce(
                                                  (total, opt) =>
                                                      total + opt.select_option,
                                                  0
                                              ) / value.responses.length
                                          ).toFixed(3)
                                        : "0.000"}
                                </td>
                                <td className="p-1 px-2 py-1 border-2 border-primary">
                                    {(() => {
                                        const a = (
                                            value.responses.reduce(
                                                (total, opt) =>
                                                    total + opt.select_option,
                                                0
                                            ) / value.responses.length
                                        ).toFixed(3)
                                        const floatA = parseFloat(a)
                                        if (floatA >= 1.0 && floatA <= 2.5996) {
                                            return "Tidak Baik"
                                        } else if (
                                            floatA >= 2.6 &&
                                            floatA <= 3.064
                                        ) {
                                            return "Kurang Baik"
                                        } else if (
                                            floatA >= 3.0644 &&
                                            floatA <= 3.532
                                        ) {
                                            return "Baik"
                                        } else {
                                            return "Sangat Baik"
                                        }
                                    })()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export function NrrBarChart({
    responsesQuestion,
}: {
    responsesQuestion: ResponsesWithQuestionResponse[]
}) {
    const color = "#DFA4F8"
    const chartRef = useRef(null)

    const chartData = responsesQuestion.map((item, index) => ({
        label: `U${index + 1}`, // Label sesuai index + 1
        value:
            item.responses.length > 0
                ? (
                      item.responses.reduce(
                          (total, opt) => total + opt.select_option,
                          0
                      ) / item.responses.length
                  ).toFixed(3)
                : "0.000",
    }))

    const chartConfig = {
        value: {
            label: "Rata-rata Penilaian",
            color: color,
        },
    } satisfies ChartConfig

    const downloadChartAsPng = async () => {
        if (chartRef.current) {
            const dataUrl = await htmlToImage.toPng(chartRef.current)
            saveAs(dataUrl, "grafik-rata-rata-penilaian.png")
        }
    }

    return (
        <div className="border-2 rounded-lg shadow-box dark:shadow-light border-primary">
            <div className="flex justify-start">
                <Button
                    onClick={downloadChartAsPng}
                    size={"icon"}
                    className="left-0 m-2"
                >
                    <LuDownload />
                </Button>
            </div>
            <Card ref={chartRef} className="border-0 shadow-none">
                <CardHeader>
                    <CardTitle>Bar Chart - Rata-rata Penilaian</CardTitle>
                    <CardDescription>Penilaian per Pertanyaan</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig}>
                        <BarChart
                            accessibilityLayer
                            data={chartData}
                            margin={{ top: 20 }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="label"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Bar
                                dataKey="value"
                                fill={color}
                                radius={3}
                                barSize={30}
                            >
                                <LabelList
                                    position="top"
                                    offset={12}
                                    className="fill-foreground"
                                    fontSize={12}
                                />
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    )
}
