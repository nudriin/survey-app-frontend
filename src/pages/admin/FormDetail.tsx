import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { FormResponse } from '@/model/FormModel';
import { Separator } from '@/components/ui/separator';
import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function FormDetail() {
    return (
        <div>
            <DashboardLayout>
                <FormSubmissions />
            </DashboardLayout>
        </div>
    );
}

function StatsCards({ forms }: { forms: FormResponse | undefined }) {
    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
            <StatsCard
                title="Total Kunjungan"
                value={forms?.visit.toString() ?? '0'}
                helperText="Jumlah total data kunjungan pada formulir"
                className="shadow-box border-2 border-darks2 rounded-lg text-left"
            />
            <StatsCard
                title="Total Jawaban"
                value={forms?.submissions.toString() ?? '0'}
                helperText="Jumlah total jawaban yang diterima pada formulir"
                className="shadow-box border-2 border-darks2 rounded-lg text-left"
            />
            <StatsCard
                title="Kunjungan Bulan Ini"
                value="0"
                helperText="Jumlah total kunjungan pada formulir dalam bulan ini"
                className="shadow-box border-2 border-darks2 rounded-lg text-left"
            />
            <StatsCard
                title="Jawaban Bulan ini"
                value="0"
                helperText="Jumlah total jawaban yang diterima pada formulir dalam bulan ini"
                className="shadow-box border-2 border-darks2 rounded-lg text-left"
            />
        </div>
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
                <h1 className="text-4xl font-bold my-2 text-purples">
                    {value}
                </h1>
                <p className="text-sm text-muted-foreground">{helperText}</p>
            </CardContent>
        </Card>
    );
}

function FormSubmissions() {
    const [forms, setForms] = useState<FormResponse>();
    const { formId } = useParams();

    const getFormById = useCallback(async () => {
        try {
            const response = await fetch(`/api/v1/forms/${formId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
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
            toast({
                title: 'Error',
                description: `${error}`,
                variant: 'destructive',
            });
        }
    }, [formId]);

    useEffect(() => {
        getFormById();
    }, [getFormById]);

    const shareUrl = `${window.location.origin}/form/${forms?.shareURL}`;

    return (
        <div className="mt-4">
            <div className="relative flex justify-between gap-2 items-center w-full border-2 border-darks2 p-4 rounded-lg shadow-box">
                <h1 className="text-4xl font-semibold text-left">
                    {forms?.name}
                </h1>
                <Button
                    className="absolute right-0 top-0 h-full rounded-l-none w-52 bg-purples"
                    asChild
                >
                    <Link to={shareUrl}>Lihat</Link>
                </Button>
            </div>
            <div className="my-4 flex justify-between gap-2 items-center w-full border-2 border-darks2 rounded-lg shadow-box">
                <Input className="w-full border-0" readOnly value={shareUrl} />
                <Button
                    className="w-64 rounded-l-none bg-purples"
                    onClick={() => {
                        navigator.clipboard.writeText(shareUrl);
                        toast({
                            title: 'Success',
                            description: 'Link berhasil disalin',
                        });
                    }}
                >
                    Bagikan link
                </Button>
            </div>
            <StatsCards forms={forms} />
            <Separator className="my-6 bg-darks2" />
            <SubmissionTable id={forms?.id} />
        </div>
    );

    function SubmissionTable({ id }: { id: number | undefined }) {
        return (
            <>
                <h1 className="text-2xl font-semibold col-span-2 text-left">
                    Jawaban
                </h1>
            </>
        );
    }
}
