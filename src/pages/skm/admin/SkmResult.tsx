import SkmDashboardLayout from "@/components/layout/SkmDashboardLayout"
import SkmResultStatistics from "@/components/skm/SkmResultStatistics"

export default function SkmResult() {
    return (
        <SkmDashboardLayout>
            <div className="flex justify-between mb-4">
                <h1 className="text-3xl font-semibold text-left">
                    Hasil Survei
                </h1>
            </div>
            <SkmResultStatistics />
        </SkmDashboardLayout>
    )
}
