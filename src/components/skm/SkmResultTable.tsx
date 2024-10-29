import { ResponsesWithQuestionResponse } from "@/model/SkmModel"
import { useCallback, useEffect, useState } from "react"
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

export default function SkmResultTable() {
    const [responsesQuestion, setResponsesQuestion] = useState<
        ResponsesWithQuestionResponse[]
    >([])

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

    useEffect(() => {
        getAllResponsesQuestion()
    }, [getAllResponsesQuestion])

    return (
        <>
            <div className="grid grid-cols-2 mb-3 gap-2">
                <NrrStatusTable responsesQuestion={responsesQuestion} />
                <NrrBarChart responsesQuestion={responsesQuestion} />
            </div>
            <ResultTable responsesQuestion={responsesQuestion} />
        </>
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
                            <th className="p-1 border-2 bg-purples text-white border-primary">
                                No
                            </th>
                            {responsesQuestion.map((value) => (
                                <th
                                    key={value.id}
                                    className="p-1 border-2 bg-purples text-white border-primary"
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
                                        {
                                            question.responses[index]
                                                .select_option
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))}
                        <tr>
                            <td className="p-1 border-2 rounded-lg border-primary font-semibold text-left">
                                Total
                            </td>
                            {responsesQuestion.map((value) => (
                                <td className="p-1 border-2 rounded-lg border-primary font-semibold">
                                    {value.responses.reduce(
                                        (total, opt) =>
                                            total + opt.select_option,
                                        0
                                    )}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-1 border-2 rounded-lg border-primary font-semibold text-left">
                                NRR/Unsur
                            </td>
                            {responsesQuestion.map((value) => (
                                <td className="p-1 border-2 rounded-lg border-primary font-semibold">
                                    {(
                                        value.responses.reduce(
                                            (total, opt) =>
                                                total + opt.select_option,
                                            0
                                        ) / value.responses.length
                                    ).toFixed(3)}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-1 border-2 rounded-lg border-primary font-semibold text-left">
                                NRR Tertimbang
                            </td>
                            {responsesQuestion.map((value) => (
                                <td className="p-1 border-2 rounded-lg border-primary font-semibold">
                                    {(
                                        (value.responses.reduce(
                                            (total, opt) =>
                                                total + opt.select_option,
                                            0
                                        ) /
                                            value.responses.length) *
                                        0.111
                                    ).toFixed(3)}
                                </td>
                            ))}
                        </tr>
                        <tr className="bg-muted-foreground text-secondary">
                            <td className="p-1 border-2 border-primary border-r-secondary font-semibold text-left">
                                IKM Unit Pelayanan
                            </td>
                            <td
                                colSpan={responsesQuestion.length}
                                className="p-1 border-2 border-primary font-semibold"
                            >
                                {(
                                    responsesQuestion.reduce(
                                        (grandTotal, value) => {
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
                            <th className="p-1 border-2 bg-purples text-white border-primary">
                                No
                            </th>
                            <th className="p-1 border-2 bg-purples text-white border-primary">
                                Unsur Pelayanan
                            </th>
                            <th className="p-1 border-2 bg-purples text-white border-primary">
                                NRR
                            </th>
                            <th className="p-1 border-2 bg-purples text-white border-primary">
                                Keterangan
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {responsesQuestion.map((value, index) => (
                            <tr>
                                <td className="p-1 border-2 border-primary px-2 py-1">
                                    U{index + 1}
                                </td>
                                <td
                                    key={value.id}
                                    className="p-1 border-2 border-primary px-2 py-1"
                                >
                                    {value.acronim}
                                </td>
                                <td className="p-1 border-2 border-primary px-2 py-1">
                                    {(
                                        value.responses.reduce(
                                            (total, opt) =>
                                                total + opt.select_option,
                                            0
                                        ) / value.responses.length
                                    ).toFixed(3)}
                                </td>
                                <td className="p-1 border-2 border-primary px-2 py-1">
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
    const color = "#5831ee"
    const chartData = responsesQuestion.map((item, index) => ({
        label: `U${index + 1}`, // Label sesuai index + 1
        value: (
            item.responses.reduce(
                (total, opt) => total + opt.select_option,
                0
            ) / item.responses.length
        ).toFixed(3), // Nilai rata-rata
    }))

    const chartConfig = {
        value: {
            label: "Rata-rata Penilaian",
            color: color,
        },
    } satisfies ChartConfig

    return (
        <Card className="border-2 shadow-box dark:shadow-light border-primary">
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
    )
}
