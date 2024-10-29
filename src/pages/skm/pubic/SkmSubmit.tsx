import { Button } from "@/components/ui/button"
import pky from "../../../assets/images/web/pky.png"
import { HiCursorClick } from "react-icons/hi"
import { useCallback, useEffect, useState } from "react"
import { QuestionResponse, RespondenResponse } from "@/model/SkmModel"
import Confetti from "react-confetti"

export default function SkmSubmit() {
    return (
        <div className="w-full lg:max-w-[650px] mx-auto">
            <header className="p-6 text-white border-2 bg-gradient-to-b md:bg-gradient-to-r from-purples to-cyan-500 rounded-xl shadow-box border-darks2 dark:shadow-light dark:border-primary">
                <div className="items-center justify-center col-span-4 gap-3 sm:flex md:text-left ">
                    <div>
                        <p></p>
                        <h1 className="my-3 text-2xl font-bold md:text-2xl">
                            Selamat Datang di Dinas Pendidikan Kota Palangka
                            Raya
                        </h1>
                        <p className="md:text-xl lg:text-lg">
                            Semoga harimu menyenangkan!
                        </p>
                    </div>
                    <img
                        className="order-2 mx-auto h-28 md:h-36 lg:h-28 md:order-1"
                        src={pky}
                        alt=""
                    />
                </div>
            </header>
            <div className="mt-2">
                <QuestionCard />
            </div>
        </div>
    )
}

function QuestionCard() {
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
    const [questions, setQuestions] = useState<QuestionResponse[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<
        "idle" | "success" | "error"
    >("idle")

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

    const handleRespondenChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setResponden((prev) => ({
            ...prev,
            [name]: name === "age" ? parseInt(value) || 0 : value,
        }))

        console.log(responden)
    }

    const handleOptionChange = (questionId: number, optionNumber: number) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: optionNumber,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitStatus("idle")

        try {
            setIsSubmitting(true)
            const responseResponden = await fetch("/api/v1/skm/responden", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(responden),
            })

            const bodyResponden = await responseResponden.json()

            if (!bodyResponden.errors) {
                setResponden(bodyResponden.data)
                setIsSubmitting(false)
            } else {
                setIsSubmitting(false)
                setSubmitStatus("error")
                throw new Error(bodyResponden.errors)
            }

            if (!isSubmitting) {
                for (const [questionId, optionNumber] of Object.entries(
                    answers
                )) {
                    const formattedAnswer = {
                        question_id: parseInt(questionId),
                        responden_id: bodyResponden.data.id,
                        select_option: optionNumber,
                    }

                    const responseResponses = await fetch(
                        "/api/v1/skm/responses",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(formattedAnswer),
                        }
                    )

                    const bodyResponses = await responseResponses.json()

                    if (bodyResponses.errors) {
                        throw new Error(bodyResponses.errors)
                    }
                }
                setSubmitStatus("success")
            }
        } catch (error) {
            setSubmitStatus("error")
            console.log(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (submitStatus === "success") {
        return (
            <>
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    recycle={false}
                    numberOfPieces={1000}
                />
                <div className="fixed top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center w-full min-h-screen bg-background">
                    <div className="max-w-md p-6 text-left border-2 rounded-lg border-darks2 shadow-box">
                        <h1 className="pb-2 mb-10 text-4xl font-semibold border-b text-purples">
                            Formulir berhasil di kirim
                        </h1>
                        <h3 className="pb-10 text-sm border-b text-muted-foreground">
                            Terimakasih telah mengisi formulir ini, kamu boleh
                            keluar dari halaman ini.
                        </h3>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
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
                                value={responden.name}
                                onChange={handleRespondenChange}
                                className="w-full px-3 py-2 border-2 rounded-md border-primary bg-background"
                                required
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
                                value={responden.email}
                                onChange={handleRespondenChange}
                                className="w-full px-3 py-2 border-2 rounded-md border-primary bg-background"
                                required
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
                                value={responden.phone}
                                onChange={handleRespondenChange}
                                className="w-full px-3 py-2 border-2 rounded-md border-primary bg-background"
                                required
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
                                value={responden.age || ""}
                                onChange={handleRespondenChange}
                                className="w-full px-3 py-2 border-2 rounded-md border-primary bg-background"
                                required
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
                                value={responden.address}
                                onChange={handleRespondenChange}
                                className="w-full px-3 py-2 border-2 rounded-md border-primary bg-background"
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
                                onChange={handleRespondenChange}
                                className="w-full px-3 py-2 border-2 rounded-md border-primary bg-background"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Pendidikan
                            </label>
                            <select
                                name="education"
                                value={responden.education}
                                onChange={handleRespondenChange}
                                className="w-full px-3 py-2 border-2 rounded-md border-primary bg-background"
                            >
                                <option selected hidden>
                                    Pilih Pendidikan
                                </option>
                                <option value="SD">SD</option>
                                <option value="SMP">SMP</option>
                                <option value="SMA">SMA</option>
                                <option value="D1/D2/D3">D1/D2/D3</option>
                                <option value="D4/S1">D4/S1</option>
                                <option value="S2">S2</option>
                                <option value="S3">S3</option>
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Jenis Kelamin
                            </label>
                            <select
                                name="gender"
                                value={responden.gender}
                                onChange={handleRespondenChange}
                                className="w-full px-3 py-2 border-2 rounded-md border-primary bg-background"
                            >
                                <option selected hidden>
                                    Pilih Jenis Kelamin
                                </option>
                                <option value="MALE">Laki - Laki</option>
                                <option value="FEMALE">Perempuan</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block mb-1 text-sm font-medium">
                                Pilih Jenis Layanan yang Bapak/Ibu terima!
                            </label>
                            <select
                                name="service_type"
                                value={responden.service_type}
                                onChange={handleRespondenChange}
                                className="w-full px-3 py-2 border-2 rounded-md border-primary bg-background"
                            >
                                <option selected hidden>
                                    Pilih Jenis Layanan
                                </option>
                                <option value="Legalisasi">Legalisasi</option>
                                <option value="Surat Keterangan Pengganti Ijazah/STTB">
                                    Surat Keterangan Pengganti Ijazah/STTB
                                </option>
                                <option value="Layanan Kepegawaian">
                                    Layanan Kepegawaian
                                </option>
                                <option value="Izin Operasional Pendirian Sekolah">
                                    Izin Operasional Pendirian Sekolah
                                </option>
                                <option value="Layanan Pendidikan Non Formal (PNF)">
                                    Layanan Pendidikan Non Formal (PNF)
                                </option>
                                <option value="Layanan Intervensi Terpadu">
                                    Layanan Intervensi Terpadu
                                </option>
                                <option value="Layanan Mutasi Siswa">
                                    Layanan Mutasi Siswa
                                </option>
                                <option value="Layanan Data Pokok Pendidikan (DAPODIK)">
                                    Layanan Data Pokok Pendidikan (DAPODIK)
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
                            {value.question}
                            <span className="ml-2 text-sm text-gray-500">
                                ({value.acronim})
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
                                        name={`question-${value.id}`}
                                        value={optionNum}
                                        checked={
                                            answers[value.id] === optionNum
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
                                            value[
                                                `option_${optionNum}` as keyof QuestionResponse
                                            ]
                                        }
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
                <Button
                    className="gap-2 mt-4 bg-purples"
                    disabled={isSubmitting}
                >
                    <HiCursorClick />{" "}
                    {isSubmitting ? "Mengirim..." : "Kirim Survey"}
                </Button>
            </form>
        </>
    )
}
