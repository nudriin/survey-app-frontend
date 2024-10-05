export interface FormSaveRequest {
    name: string
    description?: string
}

export interface FormDetails {
    id: number
    createdAt: Date
    formId: number
    content: string
}

export interface FormResponse {
    id: number
    createdAt: Date
    published: boolean
    name: string
    description: string
    content: string
    visit: number
    submissions: number
    shareURL?: string
    userId: number
    formDetails: FormDetails[]
}

export interface FormTotalStatistics {
    totalVisit: number
    totalSubmission: number
    totalSubmissionThisMonth: number
}

export interface SubmissionDistributionByForm {
    form: string
    count: number
}

export interface MonthlySubmissionCount {
    date: Date
    count: number
}

export interface FormDetails {
    id: number
    createdAt: Date
    formId: number
    content: string
}
