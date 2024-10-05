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
import { toZonedTime } from "date-fns-tz"
import { format } from "date-fns"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { IoTrendingUp } from "react-icons/io5"
import { MonthlySubmissionCount } from "@/model/FormModel"
import { useCookies } from "react-cookie"
import { TbMoodEmpty } from "react-icons/tb"

export default function MonthlySubmissionCharts() {
    const [data, setData] = useState<MonthlySubmissionCount[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [cookie] = useCookies(["auth"])
    const token = cookie.auth
    const color = "#5831ee"
    const timeZone = "Asia/Jakarta"
    const today = format(toZonedTime(new Date(), timeZone), "LLLL")

    const getAllDailyStats = useCallback(async () => {
        try {
            setLoading(true)
            const response = await fetch(
                "/api/v1/forms/all/monthly-submission-count",
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
                setData(body.data)
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

    if (!loading && data.length === 0) {
        return (
            <Card className="border-2 shadow-box dark:shadow-light border-primary">
                <CardHeader>
                    <CardTitle>Grafik Jawaban per Bulan</CardTitle>
                    <CardDescription>{today}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center flex-1 gap-2 text-purples">
                    <h1 className="text-xl font-semibold">
                        Data tidak tersedia
                    </h1>
                    <TbMoodEmpty size={30} />
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                    <div className="flex gap-2 font-medium leading-none">
                        Trending jawaban per bulan{" "}
                        <IoTrendingUp className="w-4 h-4" />
                    </div>
                </CardFooter>
            </Card>
        )
    }

    let chartData
    if (!loading) {
        chartData = data?.map((val) => {
            return {
                date: format(toZonedTime(val.date, timeZone), "PP"),
                count: val.count,
            }
        })
    }

    const chartConfig = {
        jawaban: {
            label: "Jawaban",
            color: color,
        },
    } satisfies ChartConfig

    return (
        <Card className="border-2 shadow-box dark:shadow-light border-primary">
            <CardHeader>
                <CardTitle>Grafik Jawaban per Bulan</CardTitle>
                <CardDescription>{today}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer className="max-h-[200px]" config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar
                            dataKey="count"
                            fill={color}
                            radius={3}
                            barSize={30}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    Trending jawaban per bulan{" "}
                    <IoTrendingUp className="w-4 h-4" />
                </div>
            </CardFooter>
        </Card>
    )
}
