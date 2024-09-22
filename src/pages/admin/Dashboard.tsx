import CreateFormBtn from '@/components/CreateFormBtn';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FormResponse } from '@/model/FormModel';
import { formatDistance } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { BsEyeFill } from 'react-icons/bs';
import { FaEdit, FaWpforms } from 'react-icons/fa';
import { BiRightArrowAlt } from 'react-icons/bi';
import { Link } from 'react-router-dom';

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
            <div className="w-full pt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
                <StatsCard
                    title="Total Visit"
                    value="0"
                    helperText="Total visits"
                    className="shadow-box border-2 border-darks2 rounded-lg text-left text-white bg-purples"
                />
                <StatsCard
                    title="Total Response"
                    value="0"
                    helperText="Total visits"
                    className="shadow-box border-2 border-darks2 rounded-lg text-left text-white bg-oranges"
                />
                <StatsCard
                    title="Response Rate"
                    value="0"
                    helperText="Total visits"
                    className="shadow-box border-2 border-darks2 rounded-lg text-left text-white bg-greens"
                />
                <StatsCard
                    title="Bounce Rate"
                    value="0"
                    helperText="Total visits"
                    className="shadow-box border-2 border-darks2 rounded-lg text-left text-white bg-teals"
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
    const [forms, setForms] = useState<FormResponse[]>([]);
    const [cookie] = useCookies(['auth']);
    const token = cookie.auth;

    const getAllForms = useCallback(async () => {
        try {
            const response = await fetch('/api/v1/forms', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            const body = await response.json();
            if (!body.errors) {
                setForms(body.data);
            } else {
                throw new Error(body.errors);
            }
        } catch (error) {
            console.log(error);
        }
    }, [token]);

    useEffect(() => {
        getAllForms();
    }, [getAllForms]);
    return (
        <>
            {forms.map((value, index) => (
                <FormsCard key={index} form={value} />
            ))}
        </>
    );
}

function FormsCard({ form }: { form: FormResponse }) {
    return (
        <Card className="group border-primary/20 h-full rounded-lg hover:cursor-pointer gap-4 shadow-box border-2 border-darks2 text-left">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{form.name}</span>
                    {form.published && <Badge>Publish</Badge>}
                    {!form.published && (
                        <Badge variant="destructive">Draft</Badge>
                    )}
                </CardTitle>
                <CardDescription className="flex items-center justify-between text-muted-foreground text-sm">
                    {formatDistance(form.createdAt, new Date(), {
                        addSuffix: true,
                    })}
                    {form.published && (
                        <span className="flex items-center gap-2">
                            <BsEyeFill className="text-muted-foreground" />
                            <span>{form.visit}</span>
                            <FaWpforms className="text-muted-foreground" />
                            <span>{form.submissions}</span>
                        </span>
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent className="truncate">
                {form.description || 'Tidak ada deskripsi'}
            </CardContent>
            <CardFooter>
                {form.published && (
                    <Button asChild className="gap-2 bg-purples w-full">
                        <Link to={`/forms/${form.id}`}>
                            Lihat Jawaban <BiRightArrowAlt />
                        </Link>
                    </Button>
                )}
                {!form.published && (
                    <Button asChild className="gap-2 bg-oranges w-full">
                        <Link to={`/build/${form.id}`}>
                            Edit Formulir <FaEdit />
                        </Link>
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
