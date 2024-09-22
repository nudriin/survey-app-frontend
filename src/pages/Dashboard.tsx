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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <CreateFormBtn />
                <FormsCards />
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
                    className="shadow-box border-2 border-darks2 rounded-lg text-left text-purples"
                />
                <StatsCard
                    title="Total Response"
                    value="0"
                    helperText="Total visits"
                    className="shadow-box border-2 border-darks2 rounded-lg text-left text-oranges"
                />
                <StatsCard
                    title="Response Rate"
                    value="0"
                    helperText="Total visits"
                    className="shadow-box border-2 border-darks2 rounded-lg text-left text-greens"
                />
                <StatsCard
                    title="Bounce Rate"
                    value="0"
                    helperText="Total visits"
                    className="shadow-box border-2 border-darks2 rounded-lg text-left text-teals"
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
            <CardHeader className="space-y-0 pb-2">
                <CardTitle className="">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <h1 className="text-3xl font-bold m-0">{value}</h1>
                <p>{helperText}</p>
            </CardContent>
        </Card>
    );
}

function FormsCards() {
    const forms = [
        {
            name: 'Form1',
        },
        {
            name: 'Form2',
        },
        {
            name: 'Form3',
        },
    ];

    return (
        <>
            {forms.map((value, index) => (
                <FormsCard key={index} name={value.name} />
            ))}
        </>
    );
}

function FormsCard({ name }: { name: string }) {
    return (
        <Card className="group border-primary/20 h-[140px] items-center justify-center flex flex-col hover:border-primary rounded-lg hover:cursor-pointer gap-4 shadow-box border-2 border-darks2">
            <CardHeader>
                <CardTitle>{name}</CardTitle>
            </CardHeader>
        </Card>
    );
}
