"use client";

import { useEffect, useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

dayjs.extend(customParseFormat);

type TimePickerProps = {
    formName?: string;
    required?: boolean;
    value: string;
    onChange: (value: string) => void;
    width?: number;
    formDependencies?: (() => void)[]
};

function parseTime(value: string): Dayjs | null {
    if (!value) return null;

    const parsed = dayjs(value, "hh:mm A", true);
    return parsed.isValid() ? parsed : null;
}

export default function TimePicker({ formName, required, value, onChange, width, formDependencies = [] }: TimePickerProps) {
    const [fieldValue, setFieldValue] = useState<Dayjs | null>(
        () => parseTime(value)
    );

    useEffect(() => {
        setFieldValue(parseTime(value));
    }, [value]);

    return (
    <div className="flex flex-col">
        <div className={` font-medium text-foreground/75 mb-1 ${ formName ? "select-none" : "invisible"} `}>
            { formName ? formName : "invisible" }

            { required && (
                <span className="text-alert font-bold ml-1 select-none">*</span>
            ) }
        </div>
        <LocalizationProvider
            dateAdapter={AdapterDayjs}
            localeText={{
                fieldHoursPlaceholder: () => "--",
                fieldMinutesPlaceholder: () => "--",
                fieldMeridiemPlaceholder: () => "--",
            }}
        >
        <TimeField
            value={fieldValue}
            onChange={(newValue: Dayjs | null) => {
                setFieldValue(newValue);
                if (newValue?.isValid()) {
                    onChange(newValue.format("hh:mm A"));

                    // reset other fields that cannot coexist
                    formDependencies.forEach((field) => field());
                }
            }}

            format="hh:mm A"
            sx={{
                width: width ? `${width}px` : "auto",

                "& .MuiPickersOutlinedInput-root": {
                    backgroundColor: "color-mix(in srgb, var(--muted-1) 50%, transparent)",
                    borderRadius: "4px",
                    height: "auto",
                    outline: "2px solid var(--card)",
                    outlineOffset: "0px",
                    transition: "outline-color",
                    justifyContent: "flex-start !important",
                    paddingLeft: "8px !important",
                    paddingRight: "8px !important",
                },

                "& .MuiPickersOutlinedInput-notchedOutline": {
                    border: "none !important",
                },

                "& .MuiPickersOutlinedInput-root:hover": {
                    // outlineColor: "var(--foreground)",
                    cursor: "pointer",
                },

                "& .MuiPickersOutlinedInput-root.Mui-focused": {
                    outline: "2px solid var(--primary)",
                },

                "& .MuiPickersInputBase-input, & .MuiPickersSectionList-root": {
                    fontFamily: "var(--font-rajdhani) !important",
                    fontSize: "1.05rem",
                    color: "var(--foreground)",
                    padding: "4px 0px",
                    justifyContent: "flex-start !important",
                },

                "& .MuiPickersSectionList-sectionContent": {
                    fontFamily: "var(--font-rajdhani) !important",
                    padding: "0px 2px",
                },

                '& .MuiPickersInputBase-sectionContent[aria-valuetext="Empty"]': {
                    color: "color-mix(in srgb, var(--foreground) 40%, transparent)",
                },
            }}
        />
        </LocalizationProvider>
    </div>
    );
}