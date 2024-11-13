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
    email?: string
    address?: string
    phone?: string
    age: number
    education: string
    profession: string
    service_type: string
    gender: string
}

export interface ResponsesByUserResponse {
    id: number
    question_id: number
    responden_id: number
    select_option: number
    created_at: Date
    select_option_text: string
    question: QuestionResponse
}

export interface ResponsesResponse {
    id: number
    question_id: number
    responden_id: number
    select_option: number
    created_at: Date
    select_option_text: string
}

export interface ResponsesWithQuestionResponse {
    id: number
    question: string
    acronim: string
    option_1: string
    option_2: string
    option_3: string
    option_4: string
    status: boolean
    responses: Array<ResponsesResponse>
}

export interface RespondenCountResponseByGender {
    total: number
    gender: string
}
