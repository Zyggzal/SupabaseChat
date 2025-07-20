"use client";

import { createContext, useState } from "react";
import StatusPopup, { Popup } from "@/components/statusPopup/statusPopup";

export type TPopupContext = {
   popups: Popup[]|undefined,
   showPopup: (popup: Popup) => void
}

export const PopupContext = createContext<TPopupContext|null>(null)

const PopupProvider = ({ children } : { 
    children: React.ReactNode,
}) => {
    const [popups, setPopups] = useState<Popup[]>([]);

    const showPopup = (popup: Popup) => {
        setPopups(prev => [...prev, popup]);
    }

    const closePopup = (popup: Popup) => {
        setPopups(prev => prev.filter(p => p !== popup));
    }

    return (
        <PopupContext.Provider value={{ popups, showPopup }}>
            {children}
            <div id="popupContainer" className="fixed right-5 bottom-5 flex flex-col-reverse gap-y-2 z-40">
                {
                    popups.map(popup => <StatusPopup 
                        type={popup.type} 
                        title={popup.title} 
                        onClose={() => closePopup(popup)} 
                        timeout={popup.timeout}
                        key={`${popup.type}popup${popup.title}`}>
                        {popup.children}
                    </StatusPopup>)
                }
            </div>
        </PopupContext.Provider>
    );
}

export default PopupProvider;