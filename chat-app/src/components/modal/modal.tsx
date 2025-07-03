import React, { useEffect } from "react"
import ReactPortal from "../reactPortal/reactPortal";

export type ModalProps = {
    children: React.ReactElement,
    isOpen: boolean,
    id: string
}

export default function Modal({
    children,
    isOpen,
    id
} : ModalProps) {
    
    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return isOpen && <ReactPortal wrapperId={id}>
        {children}
    </ReactPortal>
}