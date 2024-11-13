/* eslint-disable @typescript-eslint/no-explicit-any */
import { MdPreview } from "react-icons/md"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import { useCallback, useEffect, useState } from "react"
import { RespondenResponse, ResponsesByUserResponse } from "@/model/SkmModel"
import { HiCursorClick } from "react-icons/hi"
import { useCookies } from "react-cookie"
import { toast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
export default function RespondenDetailBtn({ id }: { id: number }) {
    const [responden, setResponden] = useState<RespondenResponse>({
        id: 0,
        name: "",
        email: "",
        address: "",
        phone: "",
        age: 0,
        education: "",
        profession: "",
        service_type: "",
        gender: "MALE",
    })
    const [answers, setAnswers] = useState<{ [key: number]: number }>({})
    const [questions, setQuestions] = useState<ResponsesByUserResponse[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

    const [cookie] = useCookies(["auth"])
    const token = cookie.auth
    const navigate = useNavigate()

    const getAllResponsesById = useCallback(async () => {
        try {
            const response = await fetch(`/api/v1/skm/responses/${id}/user`, {
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
    }, [id])

    const getRespondenById = useCallback(async () => {
        try {
            const response = await fetch(`/api/v1/skm/responden/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })

            const body = await response.json()

            if (!body.errors) {
                setResponden(body.data)
            } else {
                throw new Error(body.errors)
            }
        } catch (error) {
            console.log(error)
        }
    }, [id, token])

    useEffect(() => {
        getAllResponsesById()
        getRespondenById()
    }, [getAllResponsesById, getRespondenById])

    const handleRespondenChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setResponden((prev: any) => ({
            ...prev,
            [name]: name === "age" ? parseInt(value) || 0 : value,
        }))

        console.log(responden)
    }

    const handleOptionChange = (responseId: number, optionNumber: number) => {
        setAnswers((prev) => ({
            ...prev,
            [responseId]: optionNumber,
        }))

        console.log(answers)
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitStatus("idle")

        try {
            setIsSubmitting(true)
            for (const [responseId, optionNumber] of Object.entries(answers)) {
                const formattedAnswer = {
                    id: parseInt(responseId),
                    select_option: optionNumber,
                }

                const responseResponses = await fetch("/api/v1/skm/responses", {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(formattedAnswer),
                })

                const bodyResponses = await responseResponses.json()

                if (bodyResponses.errors) {
                    throw new Error(bodyResponses.errors)
                }
            }
            setIsSubmitting(false)
            toast({
                title: "Sukses",
                description: "Jawaban berhasil diubah",
            })
            if (!isSubmitting) {
                navigate(0)
            }
            setSubmitStatus("success")
        } catch (error) {
            setSubmitStatus("error")
            console.log(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSubmitting) {
        return (
            <>
                <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50">
                    <div className="p-6 text-center bg-white rounded-md shadow-md">
                        <p className="mb-4 text-lg font-semibold">
                            Sedang mengirim data...
                        </p>
                        <p className="text-sm text-gray-600">
                            Jangan tutup halaman atau keluar dari aplikasi.
                        </p>
                    </div>
                </div>
            </>
        )
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    Jawaban <MdPreview />
                </Button>
            </DialogTrigger>
            <DialogContent className="flex flex-col flex-grow w-screen h-screen max-w-full max-h-screen gap-0 p-0">
                <div className="px-4 py-2 border-b">
                    <p className="text-lg font-bold text-purples">Jawaban</p>
                    <p className="text-sm text-muted-foreground">
                        Lihat tanggapan pengguna terhadap instansi
                    </p>
                </div>
                <div className="flex flex-col items-center justify-center flex-grow p-4 overflow-y-auto bg-accent">
                    <div className="max-w-[650px] flex flex-col gap-4 flex-grow bg-background h-full w-full rounded-lg p-6 overflow-y-auto">
                        <>
                            <form onSubmit={handleUpdate}>
                                <div className="p-6 text-left border-2 rounded-xl shadow-box dark:shadow-light border-primary bg-background">
                                    <h2 className="mb-4 text-xl font-semibold">
                                        Data Responden
                                    </h2>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="block mb-1 text-sm font-medium">
                                                Nama
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Cth: Elon Musk"
                                                defaultValue={responden.name}
                                                value={responden.name}
                                                onChange={handleRespondenChange}
                                                className="w-full px-3 py-2 border-2 rounded-md border-primary bg-slate-200 cursor-no-drop"
                                                required
                                                disabled
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-1 text-sm font-medium">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Cth: elonmusk@gmail.com"
                                                defaultValue={responden.email}
                                                value={responden.email}
                                                onChange={handleRespondenChange}
                                                className="w-full px-3 py-2 border-2 rounded-md border-primary bg-slate-200 cursor-no-drop"
                                                required
                                                disabled
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-1 text-sm font-medium">
                                                No. Telepon
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                placeholder="Cth: 08123993xxxx"
                                                defaultValue={responden.phone}
                                                value={responden.phone}
                                                onChange={handleRespondenChange}
                                                className="w-full px-3 py-2 border-2 rounded-md border-primary bg-slate-200 cursor-no-drop"
                                                required
                                                disabled
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-1 text-sm font-medium">
                                                Usia
                                            </label>
                                            <input
                                                type="number"
                                                name="age"
                                                placeholder="Cth: 20"
                                                defaultValue={responden.age}
                                                value={responden.age || ""}
                                                onChange={handleRespondenChange}
                                                className="w-full px-3 py-2 border-2 rounded-md border-primary bg-slate-200 cursor-no-drop"
                                                required
                                                disabled
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-1 text-sm font-medium">
                                                Alamat
                                            </label>
                                            <input
                                                type="text"
                                                name="address"
                                                placeholder="Cth: JL. Pangeran"
                                                defaultValue={responden.address}
                                                value={responden.address}
                                                onChange={handleRespondenChange}
                                                className="w-full px-3 py-2 border-2 rounded-md border-primary bg-slate-200 cursor-no-drop"
                                                disabled
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-1 text-sm font-medium">
                                                Pekerjaan
                                            </label>
                                            <input
                                                type="text"
                                                name="profession"
                                                placeholder="Cth: Guru"
                                                value={responden.profession}
                                                defaultValue={
                                                    responden.profession
                                                }
                                                onChange={handleRespondenChange}
                                                className="w-full px-3 py-2 border-2 rounded-md border-primary bg-slate-200 cursor-no-drop"
                                                disabled
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-1 text-sm font-medium">
                                                Pendidikan
                                            </label>
                                            <select
                                                name="education"
                                                value={responden.education}
                                                defaultValue={
                                                    responden.education
                                                }
                                                onChange={handleRespondenChange}
                                                className="w-full px-3 py-2 border-2 rounded-md border-primary bg-slate-200 cursor-no-drop"
                                                disabled
                                            >
                                                <option selected hidden>
                                                    Pilih Pendidikan
                                                </option>
                                                <option value="SD">SD</option>
                                                <option value="SMP">SMP</option>
                                                <option value="SMA">SMA</option>
                                                <option value="D1/D2/D3">
                                                    D1/D2/D3
                                                </option>
                                                <option value="D4/S1">
                                                    D4/S1
                                                </option>
                                                <option value="S2">S2</option>
                                                <option value="S3">S3</option>
                                                <option
                                                    value={responden.education}
                                                >
                                                    {responden.education}
                                                </option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block mb-1 text-sm font-medium">
                                                Jenis Kelamin
                                            </label>
                                            <select
                                                name="gender"
                                                value={responden.gender}
                                                defaultValue={responden.gender}
                                                onChange={handleRespondenChange}
                                                className="w-full px-3 py-2 border-2 rounded-md border-primary bg-slate-200 cursor-no-drop"
                                                disabled
                                            >
                                                <option selected hidden>
                                                    Pilih Jenis Kelamin
                                                </option>
                                                <option value="MALE">
                                                    Laki - Laki
                                                </option>
                                                <option value="FEMALE">
                                                    Perempuan
                                                </option>
                                            </select>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block mb-1 text-sm font-medium">
                                                Pilih Jenis Layanan yang
                                                Bapak/Ibu terima!
                                            </label>
                                            <select
                                                name="service_type"
                                                value={responden.service_type}
                                                defaultValue={
                                                    responden.service_type
                                                }
                                                onChange={handleRespondenChange}
                                                className="w-full px-3 py-2 border-2 rounded-md border-primary bg-slate-200 cursor-no-drop"
                                                disabled
                                            >
                                                <option selected hidden>
                                                    Pilih Jenis Layanan
                                                </option>
                                                <option value="Legalisasi">
                                                    Legalisasi
                                                </option>
                                                <option value="Surat Keterangan Pengganti Ijazah/STTB">
                                                    Surat Keterangan Pengganti
                                                    Ijazah/STTB
                                                </option>
                                                <option value="Layanan Kepegawaian">
                                                    Layanan Kepegawaian
                                                </option>
                                                <option value="Izin Operasional Pendirian Sekolah">
                                                    Izin Operasional Pendirian
                                                    Sekolah
                                                </option>
                                                <option value="Layanan Pendidikan Non Formal (PNF)">
                                                    Layanan Pendidikan Non
                                                    Formal (PNF)
                                                </option>
                                                <option value="Layanan Intervensi Terpadu">
                                                    Layanan Intervensi Terpadu
                                                </option>
                                                <option value="Layanan Mutasi Siswa">
                                                    Layanan Mutasi Siswa
                                                </option>
                                                <option value="Layanan Data Pokok Pendidikan (DAPODIK)">
                                                    Layanan Data Pokok
                                                    Pendidikan (DAPODIK)
                                                </option>
                                                <option
                                                    value={
                                                        responden.service_type
                                                    }
                                                >
                                                    {responden.service_type}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                {questions.map((value) => (
                                    <div
                                        key={value.id}
                                        className="p-6 mt-2 text-left border-2 border-primary rounded-xl shadow-box dark:shadow-light bg-background"
                                    >
                                        <h2 className="mb-4 text-lg font-semibold">
                                            {value.question.question}
                                            <span className="ml-2 text-sm text-gray-500">
                                                ({value.question.acronim})
                                            </span>
                                        </h2>

                                        <div className="space-y-1">
                                            {[1, 2, 3, 4].map((optionNum) => (
                                                <label
                                                    key={optionNum}
                                                    className="flex items-center p-2 space-x-3 rounded-lg cursor-pointer text-primary hover:bg-secondary"
                                                >
                                                    <input
                                                        type="radio"
                                                        name={`question-${value.question.id}`}
                                                        value={optionNum}
                                                        defaultChecked={
                                                            value.select_option ===
                                                            optionNum
                                                        }
                                                        onChange={() =>
                                                            handleOptionChange(
                                                                value.id,
                                                                optionNum
                                                            )
                                                        }
                                                        className="w-4 h-4 text-blue-600 form-radio"
                                                        required
                                                    />
                                                    <span>
                                                        {
                                                            value.question[
                                                                `option_${optionNum}` as keyof ResponsesByUserResponse["question"]
                                                            ]
                                                        }
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                <div className="flex justify-center">
                                    <Button
                                        className="gap-2 mt-4 bg-purples"
                                        disabled={isSubmitting}
                                    >
                                        <HiCursorClick />{" "}
                                        {isSubmitting
                                            ? "Mengirim..."
                                            : "Ubah Jawaban"}
                                    </Button>
                                </div>
                            </form>
                        </>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
