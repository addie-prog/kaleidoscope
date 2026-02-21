"use client";

import { use, useEffect, useState } from "react";
import BudgetStep from "@/components/steps/BudgetStep";
import AllocateStep from "@/components/steps/AllocateStep";

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
  const [reportID, setReportID] = useState<string>("");
  const [projectData, setProjectData] = useState<objectType>({});
  const [loader, setLoader] = useState<boolean>(false);

  const project = use(searchParams)?.project ?? null;
  const stepUpdated: Number = use(searchParams)?.step ? Number(use(searchParams)?.step) : 1;

  useEffect(() => {
    const init = async () => {
      if (project) {
        setLoader(true);
        const res = await fetch(`/api/user-session/get-project?project=${project}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        try {
          const { data } = await res.json();
          setLoader(false);
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
          setLoader(false);
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
          <div className="flex  items-center justify-center sm:h-[70px] h-[60px]">

            <img
          
              onClick={() => setStep(1)}
              src="/kaleido_Logo.png"
              alt="The Kaleidoscope Project"
              className="sm:w-[400px] w-[300px]"
            />
          
        </div>
      </header>
      {loader ? 
        <div className="min-h-inherit h-full flex bg-white p-5 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-[#F0F0F0]"></div>
                <div className="absolute inset-0 rounded-full border-4 border-[#3B82F6] border-t-transparent animate-spin"></div>
              </div>
              <p className="text-lg font-medium text-[#6B7280]">
                Loading ...
              </p>
            </div>
          </div>
      : 
      <>
      {step === 1 && <BudgetStep latestReportID={(val: string)=>setReportID(val)} project={project ?? ""} projectData={projectData} ResetPrinciples={(principles: any) => setResetPrinciples(principles)} utmSource={utmSource} Principles={(val: any) => { setPrinciples(val), setStep(2) }} allValues={selectedValues} selectedValues={(value) => setSelectedValues(value)} />}

      {step === 2 && (
        <AllocateStep
          projectData={projectData}
          updatedPrinciples={(val: any) => setSelectedValues({ ...selectedValues, ['principles']: val })}
          userNotes={(val: any) => setSelectedValues({ ...selectedValues, ["notes"]: val })}
          selectedValues={selectedValues}
          onNext={(value: number) => setStep(value)}
          Principles={principles}
          ResetPrinciples={resetPrinciples}
          reportID={reportID}
          project={project ?? ""}
        />
      )}
      </>
      }
    
    </div>
  );
}
