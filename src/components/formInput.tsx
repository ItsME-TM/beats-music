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
            className = {`w-[${width}] h-[${height}] text-white placeholder-white border-[1px] border-white pt-[14px] pr-[16px] pb-[14px] pl-[16px] rounded-[12px]`}
        />

    );
}