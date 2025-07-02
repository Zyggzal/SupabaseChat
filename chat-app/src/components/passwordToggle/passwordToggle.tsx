"use client";

import React, { MouseEvent, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "../icons/icons";

type InputProps = React.ComponentPropsWithRef<'input'> & { containerClassName?: string };

export default function PasswordToggle({ className, containerClassName, ...rest } : InputProps) {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = (e: MouseEvent) => {
        e.preventDefault();
        setIsVisible(prev => !prev);
    }

    return <div className={`relative flex items-center ${containerClassName}`}>
        <input className={`${className} pr-12`} {...rest} type={isVisible ? 'text' : 'password'}/>
        <button className="absolute right-3 text-orange-600 hover:text-orange-400" onClick={toggleVisibility}>
            {
                isVisible ? <EyeSlashIcon/> : <EyeIcon/>
            }
        </button>
    </div>
}