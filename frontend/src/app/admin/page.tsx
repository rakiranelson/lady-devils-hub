"use client";

import { useContext } from "react";
import { SemesterContext } from "@/contexts/SemesterContext"
import Header from "@/components/Header"

export default function Admin() {

  const semester = useContext(SemesterContext)
  return (
    <div className="h-full flex flex-col">
      <Header title="Admin Settings" semester={ semester }/>
      
      <div className="w-full max-w-[1050px] mx-auto px-5 mt-2 overflow-y-auto scrollbar-gutter-auto mb-2">body</div>
    </div>
  );
}
