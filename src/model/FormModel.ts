export interface FormSaveRequest {
    name: string;
    description?: string;
}

export interface FormResponse {
    id: number;
    createdAt: Date;
    published: boolean;
    name: string;
    description: string;
    content: string;
    visit: number;
    submissions: number;
    shareURL?: string;
    userId: number;
}
