import StatsCard from "@/components/skm/StatsCard"
import SkmDashboardLayout from "../../../components/layout/SkmDashboardLayout"
import { NrrStatusTable } from "@/components/skm/SkmResultTable"
import { ResponsesWithQuestionResponse } from "@/model/SkmModel"
import { useCallback, useEffect, useState } from "react"
export default function SkmDashboard() {
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
                    value={0}
                    helperText="Jumlah total jawaban yang diterima pada seluruh formulir"
                    className="text-left border-2 rounded-lg shadow-box dark:shadow-light border-darks2 dark:border-primary"
                />
                <StatsCard
                    title="IKM Unit Pelayanan"
                    value={unitIKM}
                    helperText="Jumlah total jawaban yang diterima pada seluruh formulir dalam bulan ini"
                    className="text-left border-2 rounded-lg shadow-box dark:shadow-light border-darks2 dark:border-primary"
                />
                <div className="md:col-span-2 ">
                    <NrrStatusTable responsesQuestion={responsesQuestion} />
                </div>
            </div>
        </SkmDashboardLayout>
    )
}
