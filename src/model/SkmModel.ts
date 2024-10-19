export interface QuestionResponse {
    id: number
    question: string
    acronim: string
    option_1: string
    option_2: string
    option_3: string
    option_4: string
    status: boolean
}

export interface RespondenResponse {
    id: number
    name: string
    email: string
    address: string
    phone: string
    age: number
    education: string
    profession: string
    service_type: string
    gender: string
}
