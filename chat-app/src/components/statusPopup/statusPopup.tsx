'use client';

import { ReactNode, useEffect, useRef } from "react";

export type Popup = {
    type: 'info' | 'warning' | 'error',
    children: ReactNode,
    title?: string,
    timeout?: number
}

type StatusPopupType = Popup & { onClose: () => void };

export default function StatusPopup({ children, type, onClose, title, timeout }: StatusPopupType) {
    const timeoutHandle = useRef<NodeJS.Timeout>(null);

    const getColor = () => {
        switch(type) {
            case 'error': return 'red-600'
            case 'warning': return 'yellow-500'
            case 'info': return 'orange-500'
        }
    }

    useEffect(() => {
        if(timeout) timeoutHandle.current = setTimeout(() => onClose(), timeout);

        return () => {
            if(timeoutHandle.current) clearTimeout(timeoutHandle.current);
        }
    }, [timeout]);

    return <div className={`bg-gray-100 hover:bg-gray-200 relative p-2 border-t-4 p-1 rounded-l-md min-w-80 border-${getColor()}`}>
        <div className={`flex justify-between w-full h-max border-b-3 p-1 rounded-l-md border-${getColor()}`}>
            { title && <h1 className={`mr-5 ml-2 font-bold text-${getColor()}`}>{title}</h1> }
            <button
                className="text-gray-500 hover:text-orange-500"
                onClick={() => {
                if(timeoutHandle.current) clearTimeout(timeoutHandle.current);
                onClose()
            }}>X</button>
        </div>
        <div className="px-3 pt-2">
            {children}
        </div>
    </div>
}