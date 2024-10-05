import { FormElementInstance } from "@/components/FormElement"
import FormResponseEditComponent from "@/components/FormResponseEditComponent"
import { toast } from "@/hooks/use-toast"
import { FormDetails, FormResponse } from "@/model/FormModel"
import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export default function FormEditResponse() {
    const [forms, setForms] = useState<FormResponse>()
    const [formDetails, setFormDetails] = useState<FormDetails>()
    const { shareURL } = useParams()
    const { detailId } = useParams()

    const getFormByShareUrl = useCallback(async () => {
        try {
            const response = await fetch(`/api/v1/forms/url/${shareURL}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            const body = await response.json()
            if (!body.errors) {
                setForms(body.data)
            } else {
                throw new Error(body.errors)
            }
        } catch (error) {
            console.log(error)
            toast({
                title: "Error",
                description: `${error}`,
                variant: "destructive",
            })
        }
    }, [shareURL])

    const getFormDetailById = useCallback(async () => {
        try {
            const response = await fetch(`/api/v1/forms/details/${detailId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            const body = await response.json()
            if (!body.errors) {
                setFormDetails(body.data)
            } else {
                throw new Error(body.errors)
            }
        } catch (error) {
            console.log(error)
            toast({
                title: "Error",
                description: `${error}`,
                variant: "destructive",
            })
        }
    }, [detailId])

    useEffect(() => {
        getFormByShareUrl()
    }, [getFormByShareUrl])

    useEffect(() => {
        getFormDetailById()
    }, [getFormDetailById])

    const formContent = JSON.parse(
        forms?.content ?? "[]"
    ) as FormElementInstance[]
    return (
        <FormResponseEditComponent
            form={forms}
            content={formContent}
            detailContent={formDetails?.content}
            detailId={parseInt(detailId || "")}
        />
    )
}
