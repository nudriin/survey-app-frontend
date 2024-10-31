import SkmDashboardLayout from "@/components/layout/SkmDashboardLayout"
import AdminAddUserBtn from "@/components/skm/AdminAddUserBtn"
import AdminDeleteUserBtn from "@/components/skm/AdminDeleteUserBtn"
import { UserResponse } from "@/model/UserModel"
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { useCallback, useEffect, useState } from "react"
import { useCookies } from "react-cookie"

const columnHelper = createColumnHelper<UserResponse>()

export default function SkmAdminUsers() {
    return (
        <SkmDashboardLayout>
            <div>
                <div className="flex justify-end mb-2">
                    <AdminAddUserBtn />
                </div>
                <UsersTable />
            </div>
        </SkmDashboardLayout>
    )
}

function UsersTable() {
    const [users, setUsers] = useState<UserResponse[]>([])
    const [cookie] = useCookies(["auth"])
    const token = cookie.auth

    const getAllUsers = useCallback(async () => {
        try {
            const response = await fetch("/api/v1/users", {
                method: "GET",
                headers: {
                    "content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })

            const body = await response.json()

            if (!body.errors) {
                setUsers(body.data)
            } else {
                throw new Error(body.errors)
            }
        } catch (error) {
            console.log(error)
        }
    }, [token])

    useEffect(() => {
        getAllUsers()
    }, [getAllUsers])

    const columns = [
        columnHelper.accessor("id", {
            cell: (info) => <span className="">{info.getValue()}</span>,
            header: () => <span>ID</span>,
        }),
        columnHelper.accessor("name", {
            cell: (info) => <span className="">{info.getValue()}</span>,
            header: () => <span>Nama</span>,
        }),
        columnHelper.accessor("email", {
            cell: (info) => <span className="">{info.getValue()}</span>,
            header: () => <span>Email</span>,
        }),
        columnHelper.accessor("role", {
            cell: (info) => <span className="">{info.getValue()}</span>,
            header: () => <span>Role</span>,
        }),
        columnHelper.accessor("id", {
            cell: (info) => <AdminDeleteUserBtn id={info.getValue()} />,
            header: () => <span>Aksi</span>,
        }),
    ]

    const table = useReactTable({
        data: users,
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
        <div className="p-4 bg-white border-2 border-primary rounded-2xl">
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
                                    className="py-2 border-2 rounded-lg border-primary"
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
                    className="px-4 py-2 text-white rounded-md bg-primary"
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
                    className="px-4 py-2 text-white rounded-md bg-primary"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </button>
            </div>
        </div>
    )
}
