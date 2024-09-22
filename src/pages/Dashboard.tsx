import CreateFormBtn from '@/components/CreateFormBtn';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function Dashboard() {
    return (
        <div>
            <StatsCards />
            <Separator className="my-6 bg-darks2" />
            <h1 className="text-2xl font-semibold col-span-2 text-left">
                Formulir Survei
            </h1>
            <Separator className="my-6 bg-darks2" />
            <div className="flex justify-start">
                <CreateFormBtn />
            </div>
        </div>
    );
}

function StatsCards() {
    return (
        <DashboardLayout>
            <div className="w-full pt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Total Visit"
                    value="0"
                    helperText="Total visits"
                    className="shadow-box border-2 border-darks2 rounded-lg"
                />
                <StatsCard
                    title="Total Response"
                    value="0"
                    helperText="Total visits"
                    className="shadow-box border-2 border-darks2 rounded-lg"
                />
                <StatsCard
                    title="Response Rate"
                    value="0"
                    helperText="Total visits"
                    className="shadow-box border-2 border-darks2 rounded-lg"
                />
                <StatsCard
                    title="Bounce Rate"
                    value="0"
                    helperText="Total visits"
                    className="shadow-box border-2 border-darks2 rounded-lg"
                />
            </div>
        </DashboardLayout>
    );
}

function StatsCard({
    title,
    value,
    helperText,
    className,
}: {
    title: string;
    value: string;
    helperText: string;
    className: string;
}) {
    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <h1 className="text-2xl font-medium ">{value}</h1>
                <p>{helperText}</p>
            </CardContent>
        </Card>
    );
}
