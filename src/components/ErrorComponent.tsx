import { useEffect } from 'react';

export default function ErrorComponent({ error }: { error: Error }) {
    useEffect(() => {
        console.log(error);
    }, [error]);
    return (
        <div className="flex w-full h-full flex-col items-center justify-center">
            ErrorComponent
        </div>
    );
}
