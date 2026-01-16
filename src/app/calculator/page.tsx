"use client";

import { use, useEffect, useState } from "react";
import BudgetStep from "@/app/components/steps/BudgetStep";
import AllocateStep from "@/app/components/steps/AllocateStep";
import ReportStep from "@/app/components/steps/ReportStep";
import Image from "next/image";

type objectType = {
  [key: string | number]: any
}

export default function BudgetTool({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const utmSource: any = use(searchParams)?.utm_source ?? null;
  const [step, setStep] = useState<Number>(1);
  const [selectedValues, setSelectedValues] = useState<objectType>({});
  const [principles, setPrinciples] = useState<Array<any>>([]);
  const [resetPrinciples, setResetPrinciples] = useState([]);
  const [reportData, setReportData] = useState([]);
  const project = use(searchParams)?.project ?? null;
  const stepUpdated: Number  = use(searchParams)?.step ? Number(use(searchParams)?.step) : 1;

  useEffect(() => {
    const init = () => {
      if (project && localStorage.getItem("selectedValues")) {
        const storedSelectedValues = localStorage.getItem("selectedValues");
        const storedPrinciples = localStorage.getItem("principles");
        if (storedSelectedValues) {
          setSelectedValues(JSON.parse(storedSelectedValues));
        }
        if (storedPrinciples) {
          setPrinciples(JSON.parse(storedPrinciples))
        }
      }

      if(stepUpdated){
        setStep(stepUpdated)
      }
    }
    init();
  }, []);



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
      {step === 1 && <BudgetStep project={project ?? ""} ResetPrinciples={(principles: any) => setResetPrinciples(principles)} utmSource={utmSource} Principles={(val: any) => { setPrinciples(val), setStep(2) }} onNext={(value: number) => setStep(value)} allValues={selectedValues} selectedValues={(value) => setSelectedValues(value)} />}

      {step === 2 && (
        <AllocateStep
          updatedPrinciples={(val: any) => setSelectedValues({ ...selectedValues, ['principles']: val })}
          userNotes={(val: any) => setSelectedValues({ ...selectedValues, ["notes"]: val })}
          selectedValues={selectedValues}
          onNext={(value: number) => setStep(value)}
          Principles={principles}
          ResetPrinciples={resetPrinciples}
          reportData={(value: any) => { setReportData(value) }}
          project={project ?? ""}
        />
      )}

      {step === 3 && <ReportStep onBack={(value: number) => setStep(value)} reportData={reportData} selectedValues={selectedValues} />}
    </div>
  );
}
