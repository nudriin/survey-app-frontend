import { FormElementInstance } from '@/components/FormElement';
import FormSubmitComponent from '@/components/FormSubmitComponent';
import { toast } from '@/hooks/use-toast';
import { FormResponse } from '@/model/FormModel';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function SumbitPage() {
    const [forms, setForms] = useState<FormResponse>();
    const { shareURL } = useParams();

    const getFormByShareUrl = useCallback(async () => {
        try {
            const response = await fetch(`/api/v1/forms/url/${shareURL}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const body = await response.json();
            if (!body.errors) {
                setForms(body.data);
            } else {
                throw new Error(body.errors);
            }
        } catch (error) {
            console.log(error);
            toast({
                title: 'Error',
                description: `${error}`,
                variant: 'destructive',
            });
        }
    }, [shareURL]);

    useEffect(() => {
        getFormByShareUrl();
    }, [getFormByShareUrl]);

    const formContent = JSON.parse(
        forms?.content ?? '[]'
    ) as FormElementInstance[];
    return (
        <FormSubmitComponent
            formURL={forms?.shareURL ?? ''}
            content={formContent}
        />
    );
}
