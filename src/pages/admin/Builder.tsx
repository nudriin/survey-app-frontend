import FormBuilder from '@/components/FormBuilder';
import { FormResponse } from '@/model/FormModel';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Builder() {
    const { formId } = useParams();
    const [form, setForm] = useState<FormResponse>();

    const getFormById = useCallback(async () => {
        try {
            const response = await fetch(`/api/v1/forms/${formId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const body = await response.json();
            if (!body.errors) {
                setForm(body.data);
            } else {
                throw new Error(body.errors);
            }
        } catch (error) {
            console.log(error);
        }
    }, [formId]);

    useEffect(() => {
        getFormById();
    }, [getFormById]);

    return <FormBuilder form={form} />;
}
