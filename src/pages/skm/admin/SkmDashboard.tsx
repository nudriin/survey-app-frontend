import StatsCard from "@/components/skm/StatsCard"
import SkmDashboardLayout from "../../../components/layout/SkmDashboardLayout"
import NrrPerElementTable from "@/components/skm/NrrPerElementTable"
export default function SkmDashboard() {
    return (
        <SkmDashboardLayout>
            <div className="grid w-full grid-cols-1 gap-4 pt-8 md:grid-cols-2 lg:grid-cols-3 ">
                <StatsCard
                    title="Total Pertanyaan"
                    value={0}
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
                    value={0}
                    helperText="Jumlah total jawaban yang diterima pada seluruh formulir dalam bulan ini"
                    className="text-left border-2 rounded-lg shadow-box dark:shadow-light border-darks2 dark:border-primary"
                />
                <div className="md:col-span-2 ">
                    <NrrPerElementTable />
                </div>
            </div>
        </SkmDashboardLayout>
    )
}
