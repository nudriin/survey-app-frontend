import SkmDashboardLayout from "@/components/layout/SkmDashboardLayout"
import { RespondenResponse } from "@/model/SkmModel"
import { useCallback, useEffect, useState } from "react"
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
    SortingState,
    getSortedRowModel,
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
    const [totalData, setTotalData] = useState(0) // Total data dari backend
    const [globalFilter, setGlobalFilter] = useState("")
    const [sorting, setSorting] = useState<SortingState>([])
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [cookie] = useCookies(["auth"])
    const token = cookie.auth

    const [currentPage, setCurrentPage] = useState(0) // Halaman saat ini dimulai dari 0
    const pageSize = 10 // Jumlah data per halaman

    const fetchData = useCallback(async () => {
        try {
            const response = await fetch(
                `/api/v1/skm/responden?page=${
                    currentPage + 1
                }&pageSize=${pageSize}&search=${globalFilter}`, // Tambahkan search di sini
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const body = await response.json()

            if (!body.errors) {
                setRespondens(body.data.data) // Data responden
                setTotalData(body.data.total) // Total data dari backend
            } else {
                throw new Error(body.errors)
            }
        } catch (error) {
            console.error(error)
        }
    }, [currentPage, pageSize, globalFilter, token]) // Pastikan `globalFilter` ada dalam dependency array

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const columns = [
        columnHelper.accessor("name", {
            cell: (info) => <span className="">{info.getValue()}</span>,
            header: ({ column }) => (
                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Nama
                    {column.getIsSorted() === "asc"
                        ? "▲"
                        : column.getIsSorted() === "desc"
                        ? "▼"
                        : ""}
                </div>
            ),
            enableSorting: true, // Aktifkan sorting pada kolom ini
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
        state: {
            globalFilter,
            sorting,
            pagination: {
                pageIndex: currentPage,
                pageSize,
            },
        },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        onPaginationChange: (updater) => {
            const newPagination =
                typeof updater === "function"
                    ? updater({ pageIndex: currentPage, pageSize })
                    : updater

            setCurrentPage(newPagination.pageIndex)
        },
        manualPagination: true, // Aktifkan pagination manual (server-side)
        pageCount: Math.ceil(totalData / pageSize), // Total halaman dari backend
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev)
    }

    const closeDropdown = () => {
        setIsDropdownOpen(false)
    }

    return (
        <>
            <div className="flex flex-col gap-4 mb-4">
                <h1 className="text-3xl font-semibold text-left">
                    Respon Pengguna
                </h1>
                <div className="flex items-center justify-between gap-4">
                    <input
                        type="text"
                        value={globalFilter ?? ""}
                        onChange={(e) => setGlobalFilter(e.target.value)} // Update nilai pencarian
                        placeholder="Cari responden..."
                        className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ring-1 ring-muted-foreground"
                    />
                    <div className="relative">
                        {/* Tombol untuk membuka dropdown */}
                        <button
                            onClick={toggleDropdown}
                            className="px-4 py-2 text-white rounded-md bg-primary"
                        >
                            Sort
                        </button>

                        {/* Dropdown hanya terlihat jika `isDropdownOpen` true */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 w-40 mt-2 bg-white border rounded-md shadow-lg">
                                <div
                                    onClick={() => {
                                        setSorting([
                                            { id: "name", desc: false },
                                        ])
                                        closeDropdown()
                                    }}
                                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                                        sorting.length &&
                                        sorting[0].id === "name" &&
                                        !sorting[0].desc
                                            ? ""
                                            : ""
                                    }`}
                                >
                                    Nama (A-Z)
                                </div>
                                <div
                                    onClick={() => {
                                        setSorting([{ id: "name", desc: true }])
                                        closeDropdown()
                                    }}
                                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                                        sorting.length &&
                                        sorting[0].id === "name" &&
                                        sorting[0].desc
                                            ? ""
                                            : ""
                                    }`}
                                >
                                    Nama (Z-A)
                                </div>
                                <div
                                    onClick={
                                        () =>
                                            setSorting([
                                                { id: "age", desc: false },
                                            ]) // Sorting by Age (Ascending)
                                    }
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                >
                                    Umur (Terkecil)
                                </div>
                                <div
                                    onClick={
                                        () =>
                                            setSorting([
                                                { id: "age", desc: true },
                                            ]) // Sorting by Age (Descending)
                                    }
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                >
                                    Umur (Terbesar)
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto text-left">
                <table className="w-full">
                    <thead className="text-white bg-purples">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                <th className="p-1 border-2 border-primary">
                                    No
                                </th>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="p-1 border-2 border-primary"
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
                        {table.getRowModel().rows.map((row, index) => (
                            <tr
                                key={row.id}
                                className="border-2 border-primary"
                            >
                                <td className="p-1 border-2 border-primary">
                                    {index + 1}
                                </td>
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        className="p-1 border-2 border-primary"
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
                        className="px-4 py-2 rounded-md text-secondary bg-primary disabled:opacity-50"
                        onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 0))
                        }
                        disabled={currentPage === 0}
                    >
                        Previous
                    </button>
                    <span>
                        Page {currentPage + 1} of{" "}
                        {Math.ceil(totalData / pageSize)}
                    </span>
                    <button
                        className="px-4 py-2 rounded-md text-secondary bg-primary disabled:opacity-50"
                        onClick={() =>
                            setCurrentPage((prev) =>
                                Math.min(
                                    prev + 1,
                                    Math.ceil(totalData / pageSize) - 1
                                )
                            )
                        }
                        disabled={
                            currentPage >= Math.ceil(totalData / pageSize) - 1
                        }
                    >
                        Next
                    </button>
                </div>
            </div>
        </>
    )
}
