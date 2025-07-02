import React from "react";

type ButtonProps = {
    children: React.ReactNode,
    pending: boolean,
    className?: string 
}
export default function ActionButton({ children, pending, className } : ButtonProps) 
{
    return <button className={`${ className || '' } bg-orange-400 hover:bg-orange-500 disabled:bg-orange-200 disabled:text-gray-400 font-bold px-5 py-3 rounded-lg text-lg text-white transition:colors duration-200`} type="submit" disabled={pending}>{ pending ?  'Loading' : children }</button>
}