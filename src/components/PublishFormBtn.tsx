import { Button } from './ui/button';
import { MdOutlinePublish } from 'react-icons/md';

export default function PublishFormBtn() {
    return (
        <Button className="gap-2 bg-purples">
            Publish <MdOutlinePublish />
        </Button>
    );
}
