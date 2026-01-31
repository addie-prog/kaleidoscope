"use client";

import { use, useEffect, useState } from "react";
import BudgetStep from "@/components/steps/BudgetStep";
import AllocateStep from "@/components/steps/AllocateStep";
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
  const [step, setStep] = useState<Number>();
  const [selectedValues, setSelectedValues] = useState<objectType>({});
  const [principles, setPrinciples] = useState<Array<any>>([]);
  const [resetPrinciples, setResetPrinciples] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [projectData, setProjectData] = useState<objectType>({});
  const project = use(searchParams)?.project ?? null;
  const stepUpdated: Number = use(searchParams)?.step ? Number(use(searchParams)?.step) : 1;

  useEffect(() => {
    const init = async () => {
      if (project) {
        const res = await fetch(`/api/user-session/get-project?project=${project}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        try {
          const { data } = await res.json();
          if (data?.length > 0) {
            setProjectData(data[0]);
            setStep(1);
            const storedSelectedValues = {
              budget: data[0]["Budget Inputs"]?.["Total cash"].toLocaleString("en-US"),
              category: data[0]["Budget Inputs"]?.["category"],
              categoryName: data[0]["Budget Inputs"]?.["Vertical"],
              email: data[0]["Owner Email"],
              notes: data[0]["User Notes"],
              principles: data[0].principles,
              projectName: data[0]["Budget Inputs"]?.["Project Name"],
              stage: data[0]["Budget Inputs"]?.["Stage"],
              tier: null,
            };
            if (storedSelectedValues) {
              setSelectedValues(storedSelectedValues);
            }
            const storedPrinciples = storedSelectedValues?.principles;

            if (storedPrinciples) {
              setPrinciples(storedPrinciples)
            }

          }

        } catch (e) {
          console.log("Error in edit project: ", e);
        }
      }
      if (stepUpdated) {
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
      {step === 1 && <BudgetStep project={project ?? ""} projectData={projectData} ResetPrinciples={(principles: any) => setResetPrinciples(principles)} utmSource={utmSource} Principles={(val: any) => { setPrinciples(val), setStep(2) }} allValues={selectedValues} selectedValues={(value) => setSelectedValues(value)} />}

      {step === 2 && (
        <AllocateStep
          projectData={projectData}
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

      {/* {step === 3 && <ReportStep onBack={(value: number) => setStep(value)} reportData={reportData} selectedValues={selectedValues} />} */}
    </div>
  );
}
