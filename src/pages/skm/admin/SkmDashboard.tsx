import StatsCard from "@/components/skm/StatsCard"
import SkmDashboardLayout from "../../../components/layout/SkmDashboardLayout"
import { NrrStatusTable } from "@/components/skm/SkmResultStatistics"
import {
    RespondenCountResponseByGender,
    ResponsesWithQuestionResponse,
} from "@/model/SkmModel"
import { useCallback, useEffect, useRef, useState } from "react"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Pie, PieChart } from "recharts"
import * as htmlToImage from "html-to-image"
import { saveAs } from "file-saver"
import { LuDownload } from "react-icons/lu"
import { Button } from "@/components/ui/button"
export default function SkmDashboard() {
    const [responsesQuestion, setResponsesQuestion] = useState<
        ResponsesWithQuestionResponse[]
    >([])
    const [countResponden, setCountResponden] = useState<number>(0)

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
        getAllResponsesQuestion()
        getCountResponden()
    }, [getAllResponsesQuestion, getCountResponden])

    const quisionerTotal = responsesQuestion.length
    const unitIKM = Number(
        (
            responsesQuestion.reduce((grandTotal, value) => {
                const ikmValue =
                    (value.responses.reduce(
                        (total, opt) => total + opt.select_option,
                        0
                    ) /
                        value.responses.length) *
                    0.111

                return grandTotal + ikmValue
            }, 0) * 25
        ).toFixed(3)
    )
    return (
        <SkmDashboardLayout>
            <div className="grid w-full grid-cols-1 gap-4 pt-8 md:grid-cols-2 lg:grid-cols-3 ">
                <StatsCard
                    title="Total Kuisioner"
                    value={quisionerTotal}
                    helperText="Jumlah total data kunjungan pada seluruh formulir"
                    className="text-left border-2 rounded-lg shadow-box dark:shadow-light border-darks2 md:col-span-2 lg:col-span-1 dark:border-primary"
                />
                <StatsCard
                    title="Total Jawaban"
                    value={countResponden}
                    helperText="Jumlah total jawaban yang diterima pada seluruh formulir"
                    className="text-left border-2 rounded-lg shadow-box dark:shadow-light border-darks2 dark:border-primary"
                />
                <StatsCard
                    title="IKM Unit Pelayanan"
                    value={unitIKM}
                    helperText="Jumlah total jawaban yang diterima pada seluruh formulir dalam bulan ini"
                    className="text-left border-2 rounded-lg shadow-box dark:shadow-light border-darks2 dark:border-primary"
                />
                <div className="grid w-full grid-cols-2 gap-2 col-span-full">
                    <NrrStatusTable responsesQuestion={responsesQuestion} />
                    <RespondenByGenderChart />
                </div>
            </div>
        </SkmDashboardLayout>
    )
}

export function RespondenByGenderChart() {
    const [countResponden, setCountResponden] = useState<
        RespondenCountResponseByGender[]
    >([])
    const chartRef = useRef(null)

    const getCountRespondenGroupByGender = useCallback(async () => {
        try {
            const response = await fetch(
                "/api/v1/skm/responden/count/total/gender",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )

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
        getCountRespondenGroupByGender()
    }, [getCountRespondenGroupByGender])

    const colorPurples = "#5831ee"
    const colorLime = "#C7FE1E"
    const chartData = countResponden.map((val, index) => {
        return {
            total: val.total,
            gender: val.gender,
            fill: index % 2 == 0 ? colorPurples : colorLime,
        }
    })

    const chartConfig = {
        MALE: {
            label: "Laki - Laki",
            color: colorPurples,
        },
        FEMALE: {
            label: "Perempuan",
            color: colorLime,
        },
    } satisfies ChartConfig

    const downloadChartAsPng = async () => {
        if (chartRef.current) {
            const dataUrl = await htmlToImage.toPng(chartRef.current)
            saveAs(dataUrl, "grafik-Distribusi-jenis-kelamin.png")
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
            <Card
                ref={chartRef}
                className="flex flex-col items-center border-0 shadow-none"
            >
                <CardHeader className="items-center pb-0">
                    <CardTitle>Pie Chart - Distribusi responden</CardTitle>
                    <CardDescription>Berdasarkan jenis kelamin</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                    <ChartContainer
                        style={{ width: "300px", height: "300px" }}
                        config={chartConfig}
                        className="mx-auto aspect-square max-h-[300px]"
                    >
                        <PieChart>
                            <ChartTooltip
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Pie
                                data={chartData}
                                dataKey="total"
                                labelLine={true}
                                label={({ payload, ...props }) => {
                                    return (
                                        <text
                                            cx={props.cx}
                                            cy={props.cy}
                                            x={props.x}
                                            y={props.y}
                                            textAnchor={props.textAnchor}
                                            dominantBaseline={
                                                props.dominantBaseline
                                            }
                                            fill={colorPurples}
                                            fontSize={15}
                                            fontWeight={500}
                                        >
                                            {payload.total}
                                        </text>
                                    )
                                }}
                            />
                            <ChartLegend
                                content={
                                    <ChartLegendContent nameKey="gender" />
                                }
                                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                            />
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    )
}
