import { Button } from "@/components/ui/button"
import pky from "../../../assets/images/web/pky.png"
import { HiCursorClick } from "react-icons/hi"
import { useCallback, useEffect, useRef, useState } from "react"
import { QuestionResponse, RespondenResponse } from "@/model/SkmModel"
import Confetti from "react-confetti"
import Footer from "@/components/Footer"
import ReCAPTCHA from "react-google-recaptcha"
import { toast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"

export default function SkmSubmit() {
    return (
        <div className="w-full lg:max-w-[650px] mx-auto">
            <header className="p-6 text-white border-2 bg-purples rounded-xl shadow-box border-darks2 dark:shadow-light dark:border-primary">
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
        suggestions: "",
        gender: "",
    })
    const [answers, setAnswers] = useState<{ [key: number]: number }>({})
    const [questions, setQuestions] = useState<QuestionResponse[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<
        "idle" | "success" | "error"
    >("idle")
    const captchaRef = useRef<ReCAPTCHA | null>(null)

    const [customEducation, setCustomEducation] = useState<string>("")
    const [customService, setCustomService] = useState<string>("")

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
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target
        setResponden((prev) => ({
            ...prev,
            [name]: name === "age" ? parseInt(value) || 0 : value,
        }))

        console.log(responden)
    }

    const handleCustomEducationChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { value } = e.target
        setCustomEducation(value)
        console.log(customEducation)
    }

    const handleCustomServiceChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { value } = e.target
        setCustomService(value)
        console.log(customService)
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
        const captchaToken = captchaRef?.current?.getValue()
        captchaRef?.current?.reset()

        if (responden.education === "Lainnya")
            responden.education = customEducation

        if (responden.service_type === "Lainnya")
            responden.service_type = customService

        if (!responden.email) delete responden.email
        if (!responden.phone) delete responden.phone
        if (!responden.address) delete responden.address

        try {
            setIsSubmitting(true)
            const captchaReponse = await fetch(`/api/v1/users/verify/captcha`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: captchaToken }),
            })

            const captchaBody = await captchaReponse.json()

            if (!captchaBody.errors && captchaBody.data.success) {
                console.log("Human 👨 👩")
            } else {
                console.log("Robot 🤖")
                throw new Error("gagal verifikasikan reCaptcha")
            }

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
            } else {
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
                setIsSubmitting(false)
                setSubmitStatus("success")
            }
        } catch (error) {
            setSubmitStatus("error")
            toast({
                title: "Error",
                description: "Mohon periksa kembali data anda",
                variant: "destructive",
            })
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
                                Email{" "}
                                <span className="text-muted-foreground">
                                    (Opsional)
                                </span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Cth: elonmusk@gmail.com"
                                value={responden.email}
                                onChange={handleRespondenChange}
                                className="w-full px-3 py-2 border-2 rounded-md border-primary bg-background"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                No. Telepon{" "}
                                <span className="text-muted-foreground">
                                    (Opsional)
                                </span>
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Cth: 08123993xxxx"
                                value={responden.phone}
                                onChange={handleRespondenChange}
                                className="w-full px-3 py-2 border-2 rounded-md border-primary bg-background"
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
                                Alamat{" "}
                                <span className="text-muted-foreground">
                                    (Opsional)
                                </span>
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
                                    <option value="Lainnya">Lainnya</option>
                                </select>
                            </div>
                            {responden.education === "Lainnya" && (
                                <div>
                                    <label className="block mb-1 text-sm font-medium">
                                        Pendidikan Lainnya
                                    </label>
                                    <input
                                        type="text"
                                        name="customEducation"
                                        value={customEducation}
                                        onChange={handleCustomEducationChange}
                                        placeholder="Masukkan pendidikan Anda"
                                        className="w-full px-3 py-2 border-2 rounded-md border-primary bg-background"
                                        required
                                    />
                                </div>
                            )}
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
                            <div>
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
                                    <option value="Legalisasi">
                                        Legalisasi
                                    </option>
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
                                    <option value="Lainnya">Lainnya</option>
                                </select>
                            </div>
                            {responden.service_type === "Lainnya" && (
                                <div>
                                    <label className="block mb-1 text-sm font-medium">
                                        Jenis Layanan Lainnya
                                    </label>
                                    <input
                                        type="text"
                                        name="customService"
                                        value={customService}
                                        onChange={handleCustomServiceChange}
                                        placeholder="Masukkan Jenis Layanan Anda terima"
                                        className="w-full px-3 py-2 border-2 rounded-md border-primary bg-background"
                                        required
                                    />
                                </div>
                            )}
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
                <div className="p-6 mt-2 text-left border-2 border-primary rounded-xl shadow-box dark:shadow-light bg-background">
                    <h1 className="mb-4 text-lg font-semibold">
                        Kritik dan Saran
                    </h1>
                    <Textarea
                        name="suggestions"
                        onChange={handleRespondenChange}
                        rows={1}
                        className="border border-primary"
                        placeholder="Kritik dan saran"
                    />
                </div>
                <div className="flex justify-center mt-5">
                    <ReCAPTCHA
                        sitekey={import.meta.env.VITE_APP_SITE_KEY}
                        ref={captchaRef}
                    />
                </div>
                <Button
                    className="gap-2 mt-4 bg-purples"
                    disabled={isSubmitting}
                >
                    <HiCursorClick />{" "}
                    {isSubmitting ? "Mengirim..." : "Kirim Survey"}
                </Button>
            </form>
            <Footer />
        </>
    )
}
