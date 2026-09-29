
"use client";

import { useState} from "react";

type FormFieldProps = {
    formName?: string;
    placeholder: string;
    required?: boolean;
    width?: number;
    multiline?: boolean;
    value: string;
    onChange: (value: string) => void;
    formDependencies?: ((value: string) => void)[]
};

export default function FormField({ formName, placeholder, required = false, width, multiline = false, value, onChange, formDependencies = [] }: FormFieldProps) {

    const handleFormField = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChange(e.target.value);
        formDependencies.forEach((field) => field(""));
    };

    return (
        <div className="flex flex-col h-full">
            <div className="font-medium text-foreground/75">
                <span className={` ${ formName ? "select-none" : "invisible"} `}>{ formName ? formName : "invisible" }</span>
                { required && (
                    <span className="text-alert font-bold ml-1">*</span>
                ) }
                
            </div>
            <div className={` bg-muted-1/50 py-1 px-2 rounded-[5px] outline-2 outline-card focus-within:outline-primary transition-all mt-1 ${multiline ? "flex-1" : ""} `}  style={{ width: width ?`${width}px` : "auto" }}>
                { multiline ? (
                    <textarea
                        value={value}
                        onChange={(e) => handleFormField(e)}
                        placeholder={placeholder}
                        className="placeholder:text-foreground/25 w-full h-full outline-none bg-transparent text-[1.05rem] resize-none"
                    />
                ) : (
                    <input
                        value={value}
                        onChange={(e) => handleFormField(e)}
                        placeholder={placeholder}
                        className="placeholder:text-foreground/25 w-full outline-none bg-transparent text-[1.05rem]"
                    />
                )}
            
            </div>
        </div>
    )
};