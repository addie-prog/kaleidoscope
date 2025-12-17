"use client";

import { use, useEffect, useState } from "react";
import BudgetStep from "@/app/components/steps/BudgetStep";
import AllocateStep from "@/app/components/steps/AllocateStep";
import ReportStep from "@/app/components/steps/ReportStep";
import Image from "next/image";

export default function BudgetTool({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const utmSource: any = use(searchParams)?.utm_source ?? "";
  const [step, setStep] = useState<Number>(1);
  const [selectedValues, setSelectedValues] = useState({});
  const [principles, setPrinciples] = useState([]);
  const [reportData, setReportData] = useState([]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex  items-center justify-center sm:py-8 py-7">

            <Image
              onClick={() => setStep(1)}
              src="/logo.svg"
              width={100}
              height={100}
              alt="The Kaleidoscope Project"
              className="h-6 w-auto"
            />
          </div>
        </div>
      </header>
      {step === 1 && <BudgetStep utmSource={utmSource} Principles={(val:any)=>{setPrinciples(val), setStep(2)}} onNext={(value: number) => setStep(value)} allValues={selectedValues} selectedValues={(value)=>setSelectedValues(value)} />}

      {step === 2 && (
        <AllocateStep
          updatedPrinciples={(val: any)=>setSelectedValues({...selectedValues,['principles']: val})}
          userNotes={(val: any)=>setSelectedValues({...selectedValues,["notes"]:val})}
          selectedValues={selectedValues}
          onNext={(value: number) => setStep(value)}
          Principles={principles}
          reportData={(value: any)=>{setReportData(value)}}
        />
      )}

      {step === 3 && <ReportStep onBack={(value: number) => setStep(value)} reportData={reportData} selectedValues={selectedValues}/>}
    </div>
  );
}
