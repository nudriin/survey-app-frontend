import { Button } from './ui/button';
import { MdPreview } from 'react-icons/md';

export default function PreviewDialogBtn() {
    return (
        <Button variant={'outline'} className="gap-2">
            Preview <MdPreview />
        </Button>
    );
}
