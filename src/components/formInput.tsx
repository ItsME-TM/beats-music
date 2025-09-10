'use client';

import { ChangeEvent } from "react";

interface FormInputProps{
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    height?: string;
    width?: string;
}

export default function FormInput ({type, placeholder, value, height, width, onChange}: FormInputProps){
    return(
        <input 
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className = {`${width ?? ""} ${height ?? ""} text-white text-sm placeholder-white border border-white pt-3.5 pr-4 pb-3.5 pl-4 rounded-lg`}
        />

    );
}