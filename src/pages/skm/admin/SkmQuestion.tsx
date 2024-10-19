import SkmDashboardLayout from "@/components/layout/SkmDashboardLayout"
import { QuestionResponse } from "@/model/SkmModel"
import { useCallback, useEffect, useState } from "react"
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    createColumnHelper,
} from "@tanstack/react-table"

const columnHelper = createColumnHelper<QuestionResponse>()

export default function SkmQuestion() {
    return (
        <SkmDashboardLayout>
            <QuestionTable />
        </SkmDashboardLayout>
    )
}

function QuestionTable() {
    const [questions, setQuestions] = useState<QuestionResponse[]>([])

    const getAllQuestion = useCallback(async () => {
        try {
            const response = await fetch("/api/v1/skm/question", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            const body = await response.json()

            if (!body.errors) {
                setQuestions(body.data)
            } else {
                throw new Error(body.errors)
            }
        } catch (error) {
            console.log(error)
        }
    }, [])

    useEffect(() => {
        getAllQuestion()
    }, [getAllQuestion])

    const columns = [
        columnHelper.accessor("question", {
            cell: (info) => <span className="">{info.getValue()}</span>,
            header: () => <span>Pertanyaan</span>,
        }),
        columnHelper.accessor("acronim", {
            cell: (info) => <span className="">{info.getValue()}</span>,
            header: () => <span>Akronim</span>,
        }),
        columnHelper.accessor("option_1", {
            cell: (info) => <span className="">{info.getValue()}</span>,
            header: () => <span>Opsi 1</span>,
        }),
        columnHelper.accessor("option_2", {
            cell: (info) => <span className="">{info.getValue()}</span>,
            header: () => <span>Opsi 2</span>,
        }),
        columnHelper.accessor("option_3", {
            cell: (info) => <span className="">{info.getValue()}</span>,
            header: () => <span>Opsi 3</span>,
        }),
        columnHelper.accessor("option_4", {
            cell: (info) => <span className="">{info.getValue()}</span>,
            header: () => <span>Opsi 4</span>,
        }),
    ]

    const table = useReactTable({
        data: questions,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    })

    return (
        <>
            <h1 className="mb-4 text-3xl font-semibold text-left">
                Pertanyaaan
            </h1>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="border-2 rounded-lg border-primary"
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row) => (
                            <tr
                                key={row.id}
                                className="border-2 rounded-lg border-primary"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        className="border-2 rounded-lg border-primary"
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex items-center justify-between mt-4">
                    <button
                        className="px-4 py-2 rounded-md text-secondary bg-primary"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </button>
                    <span>
                        Page {table.getState().pagination.pageIndex + 1} of{" "}
                        {table.getPageCount()}
                    </span>
                    <button
                        className="px-4 py-2 rounded-md text-secondary bg-primary"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </button>
                </div>
            </div>
        </>
    )
}
