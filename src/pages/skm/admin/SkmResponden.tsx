import SkmDashboardLayout from "@/components/layout/SkmDashboardLayout"
import { RespondenResponse } from "@/model/SkmModel"
import { useCallback, useEffect, useState } from "react"
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    createColumnHelper,
} from "@tanstack/react-table"
import { useCookies } from "react-cookie"
import RespondenDeleteBtn from "@/components/skm/RespondenDeleteBtn"
import RespondenDetailBtn from "@/components/skm/RespondenDetailBtn"

const columnHelper = createColumnHelper<RespondenResponse>()

export default function SkmResponden() {
    return (
        <SkmDashboardLayout>
            <RespondenTable />
        </SkmDashboardLayout>
    )
}

function RespondenTable() {
    const [respondens, setRespondens] = useState<RespondenResponse[]>([])
    const [cookie] = useCookies(["auth"])
    const token = cookie.auth

    const getAllResponden = useCallback(async () => {
        try {
            const response = await fetch("/api/v1/skm/responden", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })

            const body = await response.json()

            if (!body.errors) {
                setRespondens(body.data)
            } else {
                throw new Error(body.errors)
            }
        } catch (error) {
            console.log(error)
        }
    }, [token])

    useEffect(() => {
        getAllResponden()
    }, [getAllResponden])

    const columns = [
        columnHelper.accessor("name", {
            cell: (info) => <span className="">{info.getValue()}</span>,
            header: () => <span>Nama</span>,
        }),
        columnHelper.accessor("phone", {
            cell: (info) => <span className="">{info.getValue()}</span>,
            header: () => <span>No. HP</span>,
        }),
        columnHelper.accessor("age", {
            cell: (info) => <span className="">{info.getValue()}</span>,
            header: () => <span>Umur</span>,
        }),
        columnHelper.accessor("profession", {
            cell: (info) => <span className="">{info.getValue()}</span>,
            header: () => <span>Pekerjaan</span>,
        }),
        columnHelper.accessor("education", {
            cell: (info) => <span className="">{info.getValue()}</span>,
            header: () => <span>Pendidikan</span>,
        }),
        columnHelper.accessor("service_type", {
            cell: (info) => <span className="">{info.getValue()}</span>,
            header: () => <span>Jenis Layanan</span>,
        }),
        columnHelper.accessor("id", {
            cell: (info) => (
                <div className="flex items-center justify-center gap-1 p-2">
                    <RespondenDetailBtn id={info.getValue()} />
                    <RespondenDeleteBtn id={info.getValue()} />
                </div>
            ),
            header: () => <span>Aksi</span>,
        }),
    ]

    const table = useReactTable({
        data: respondens,
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
            <div className="flex justify-between mb-4">
                <h1 className="text-3xl font-semibold text-left">
                    Respon Pengguna
                </h1>
            </div>
            <div className="overflow-x-auto text-left">
                <table className="w-full">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="p-1 border-2 rounded-lg border-primary"
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
                                        className="p-1 border-2 rounded-lg border-primary"
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
