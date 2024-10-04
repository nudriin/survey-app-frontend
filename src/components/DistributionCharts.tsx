import { useCallback, useEffect, useState } from "react"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "./ui/chart"
import { Pie, PieChart } from "recharts"
import { SubmissionDistributionByForm } from "@/model/FormModel"
import { useCookies } from "react-cookie"
import { IoTrendingUp } from "react-icons/io5"

export default function DistributionCharts() {
    const [chartData, setChartata] = useState<SubmissionDistributionByForm[]>(
        []
    )
    const [loading, setLoading] = useState<boolean>(false)
    const [cookie] = useCookies(["auth"])
    const token = cookie.auth
    const color = "#5831ee"

    const getAllDailyStats = useCallback(async () => {
        try {
            setLoading(true)
            const response = await fetch(
                "/api/v1/forms/all/submission-distribution-form",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const body = await response.json()
            if (!body.errors) {
                setLoading(false)
                setChartata(body.data)
            } else {
                setLoading(false)
                throw new Error(body.errors)
            }
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }, [token])

    useEffect(() => {
        getAllDailyStats()
    }, [getAllDailyStats])
    let data
    if (!loading) {
        data = chartData.map((value, index) => {
            const fill = index % 2 == 0 ? color : "#C7FE1E"
            return {
                form: value.form,
                count: value.count,
                fill: fill,
            }
        })
    }

    const chartConfig = {
        jawaban: {
            label: "Jawaban",
            color: color,
        },
        count: {
            label: "Jumlah",
        },
    } satisfies ChartConfig
    return (
        <Card className="flex flex-col shadow-box dark:shadow-light border-2 border-primary">
            <CardHeader className="items-center pb-0">
                <CardTitle>Distribusi Jawaban Pada setiap Formulir</CardTitle>
                <CardDescription>All Time</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[200px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
                >
                    <PieChart>
                        <ChartTooltip
                            content={
                                <ChartTooltipContent nameKey="form" hideLabel />
                            }
                        />
                        <Pie data={data} dataKey="count" label nameKey="form" />
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Distribusi seluruh jawaban yang ada pada formulir{" "}
                    <IoTrendingUp className="w-4 h-4" />
                </div>
            </CardFooter>
        </Card>
    )
}
