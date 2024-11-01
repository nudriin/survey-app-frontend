import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

export default function StatsCard({
    title,
    value,
    helperText,
    className,
}: {
    title: string
    value: number | undefined
    helperText: string
    className: string
}) {
    return (
        <Card className={className}>
            <CardHeader className="pb-2 space-y-0">
                <CardTitle className="">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <h1 className="my-2 text-4xl font-bold text-purples">
                    {value}
                </h1>
                <p className="text-sm text-muted-foreground">{helperText}</p>
            </CardContent>
        </Card>
    )
}
