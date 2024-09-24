import { DesignerContext } from '@/components/context/DesignerContext';
import { useContext } from 'react';

export default function useDesigner() {
    const context = useContext(DesignerContext);

    if (!context) {
        throw new Error('no DesignerContext include');
    }
    return context;
}
