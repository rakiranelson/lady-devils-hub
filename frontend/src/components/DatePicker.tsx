"use client"

import * as React from "react";
import { cn } from "cn";
import { format } from "date-fns";
import CalendarIcon from "@/assets/icons/calendar.svg";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type MyProps = {
    formName?: string;
    required?: boolean;
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
    width?: number;
    formDependencies?: (() => void)[]
};

export default function DatePickerDemo({ formName, required, date, setDate, width, formDependencies = [] }: MyProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col">
      <div className={` font-medium text-foreground/75 mb-1 ${ formName ? "select-none" : "invisible"} `}>
        { formName ? formName : "invisible" }

        { required && (
            <span className="text-alert font-bold ml-1 select-none">*</span>
        ) }
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              variant="default"
              data-empty={!date}
              className="justify-start text-left font-normal data-[empty=true]:text-muted-foreground hover:cursor-pointer"
              style={{ width: width ?`${width}px` : "auto" }}
            />
          }
        >
          <div className="flex items-center justify-between w-full">
            {date ? format(date, "PPP") : <span className="text-foreground/25">Choose a date</span>}
            <CalendarIcon />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar 
          mode="single" 
          defaultMonth={date}
          disabled={{ before: new Date() }}
          selected={date} 
          onSelect={(selectedDate) => {
            setDate(selectedDate)
            setTimeout(() => setOpen(false), 200)
            formDependencies.forEach((field) => field());
          }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
};