"use client";

import { useContext } from "react";
import { SemesterContext } from "@/contexts/SemesterContext"
import Header from "@/components/Header"

export default function Members() {

  const semester = useContext(SemesterContext)
  return (
    <div className="h-full flex flex-col">
      <Header title="Members" semester={ semester }>

      </Header>
      
      <div className="ml-6 mt-2 overflow-y-auto">body</div>
    </div>
  );
}
