import React from "react";
import { GearIcon } from "../icons/icons";

type ButtonProps = {
    children: React.ReactNode,
    pending: boolean,
    className?: string,
    onClick?: () => void  
}
export default function ActionButton({ children, pending, className, onClick } : ButtonProps) 
{
    return <button onClick={onClick} className={`${ className || '' } bg-orange-400 hover:bg-orange-500 disabled:bg-orange-200 disabled:text-gray-400 font-bold px-5 py-3 rounded-lg text-lg text-white transition:colors duration-200`} type="submit" disabled={pending}>
        { pending ? <div className="animate-spin flex items-center justify-center"><GearIcon size={30}/></div> : children }
    </button>
}