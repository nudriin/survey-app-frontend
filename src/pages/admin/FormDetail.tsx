/* eslint-disable prefer-const */
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { FormResponse } from '@/model/FormModel';
import { Separator } from '@/components/ui/separator';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import {
    ElementsType,
    FormElementInstance,
} from '../../components/FormElement';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { format, formatDistance } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

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
                className="shadow-box dark:shadow-light border-2 border-darks2 dark:border-primary rounded-lg text-left"
            />
            <StatsCard
                title="Total Jawaban"
                value={forms?.submissions.toString() ?? '0'}
                helperText="Jumlah total jawaban yang diterima pada formulir"
                className="shadow-box dark:shadow-light border-2 border-darks2 dark:border-primary rounded-lg text-left"
            />
            <StatsCard
                title="Kunjungan Bulan Ini"
                value="0"
                helperText="Jumlah total kunjungan pada formulir dalam bulan ini"
                className="shadow-box dark:shadow-light border-2 border-darks2 dark:border-primary rounded-lg text-left"
            />
            <StatsCard
                title="Jawaban Bulan ini"
                value="0"
                helperText="Jumlah total jawaban yang diterima pada formulir dalam bulan ini"
                className="shadow-box dark:shadow-light border-2 border-darks2 dark:border-primary rounded-lg text-left"
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
            <div className="flex flex-col text-left items-start gap-2 w-full border-2 border-primary p-4 rounded-lg">
                <div className="w-full flex justify-between gap-2 items-center">
                    <h1 className="text-4xl font-semibold text-left">
                        {forms?.name}
                    </h1>
                    <Button variant="outline" asChild>
                        <Link to={shareUrl} target="_blank" className="gap-1">
                            Lihat
                            <ChevronRightIcon className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
                <h2 className="lg:w-1/2">{forms?.description}</h2>
            </div>
            <div className="my-4 flex justify-between gap-2 items-center w-full border-2 border-primary rounded-lg">
                <Input
                    className="w-full border-0 text-purples"
                    readOnly
                    value={shareUrl}
                />
                <Button
                    className="w-32 rounded-l-none"
                    onClick={() => {
                        navigator.clipboard.writeText(shareUrl);
                        toast({
                            title: 'Success',
                            description: 'Link berhasil disalin',
                        });
                    }}
                >
                    Salin link
                </Button>
            </div>
            <StatsCards forms={forms} />
            <Separator className="my-6 bg-primary" />
            <SubmissionTable />
        </div>
    );

    type Row = { [key: string]: string } & {
        submittedAt: Date;
    };
    function SubmissionTable() {
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

        const formcontent = forms?.content !== undefined ? forms.content : '[]';
        const formElements = JSON.parse(formcontent) as FormElementInstance[];

        const columns: {
            id: string;
            label: string;
            required: boolean;
            type: ElementsType;
        }[] = [];

        formElements.forEach((el) => {
            switch (el.type) {
                case 'TextField':
                case 'NumberField':
                case 'TextAreaField':
                case 'DateField':
                case 'SelectField':
                case 'CheckboxField':
                    columns.push({
                        id: el.id,
                        label: el.extraAttr?.label,
                        required: el.extraAttr?.required,
                        type: el.type,
                    });
                    break;
                default:
                    break;
            }
        });

        const rows: Row[] = [];
        forms?.formDetails.forEach((details) => {
            const content = JSON.parse(details.content);
            rows.push({
                ...content,
                submittedAt: details.createdAt,
            });
        });

        return (
            <>
                <h1 className="text-2xl font-semibold col-span-2 text-left">
                    Jawaban
                </h1>
                <div className="rounded-lg border text-left">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No.</TableHead>
                                {columns.map((col, index) => (
                                    <TableHead key={index}>
                                        {col.label}
                                    </TableHead>
                                ))}
                                <TableHead>Dikirm Pada</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rows.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    {columns.map((col) => (
                                        <RowCell
                                            key={col.id}
                                            type={col.type}
                                            value={row[col.id]}
                                        />
                                    ))}
                                    <TableCell className="text-muted-foreground text-left">
                                        {formatDistance(
                                            row.submittedAt,
                                            new Date(),
                                            { addSuffix: true }
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </>
        );
    }

    function RowCell({ type, value }: { type: ElementsType; value: string }) {
        let node: ReactNode = value;

        switch (type) {
            case 'DateField': {
                if (!value) break;
                const date = new Date(value);
                node = (
                    <Badge variant={'outline'}>
                        {format(date, 'dd/MM/yyyy')}
                    </Badge>
                );
                break;
            }
            case 'CheckboxField': {
                const checked = value === 'true';
                node = <Checkbox checked={checked} disabled />;
                break;
            }
        }

        return <TableCell>{node}</TableCell>;
    }
}
