'use client';

import Image from "next/image";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

export default function ReportPage({ reportData, selectedValues, onBack }: { reportData: Array<any>, selectedValues: any, onBack: (value: number) => void }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const today = new Date();
  const uniqueByPrinciple = reportData.filter(
    (value, index, self) =>
      index === self.findIndex((t) => t.principleId === value.principleId)
  );
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const reactToPrintFn = useReactToPrint({ contentRef });

  const groupedByPrinciple = uniqueByPrinciple.map((principle) => {
    const principleItems = reportData.filter(
      (rd) => rd.principleId === principle.principleId
    );

    // group items by Execution Layer
    const itemsByExecutionLayer = principleItems
      .flatMap((p) => p.items ?? [])
      .reduce((acc, item) => {
        const executionLayer = item.fields?.["Execution Layer"];
        if (!executionLayer) return acc;

        if (!acc[executionLayer]) {
          acc[executionLayer] = [];
        }

        acc[executionLayer].push(item);
        return acc;
      }, {});

    return {
      ...principle,
      items: itemsByExecutionLayer,
    };
  });
  
  return (
    <div>

      {/* Main Content */}
      <div >

        <div className='mx-auto max-w-4xl px-4 pt-6 sm:pt-8 lg:pt-12 flex flex-col justify-between' >

          <div className="w-full flex-row flex justify-between">
            <div className="flex gap-1 cursor-pointer items-center" onClick={() => onBack(2)}><Image src="/arrow-left.svg" width={18} height={18} alt='icon' /><span >Back</span></div>

            <button className="cursor-pointer flex items-center gap-[5px] text-white px-5 sm:py-2 py-2 rounded-lg bg-[#3B82F6] text-center" onClick={reactToPrintFn}>

              <span className="text-sm">Download PDF</span>
            </button>
          </div>
          {/* <div className="mt-[15px] w-full border border-[#E5E7EB] rounded-lg p-5 bg-[#FAFAFA]"><div className="flex flex-col gap-2"><div className="relative">
            <input type="email" placeholder="Enter your email address" className="text-sm w-full px-3 py-2 border border-gray-200/50 rounded-md  text-gray-500/80 placeholder:text-gray-500/80 focus:outline-none focus:border-gray-300" />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-gray-900 text-white text-xs font-medium rounded hover:bg-gray-800 transition-colors"
              aria-label="Save email"
            >
              Submit
            </button>
          </div>
            <div className="flex items-start gap-2">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mt-0.5"><path d="M9.22751 1.0976C7.48051 1.6711 5.25321 3.2048 3.19951 5.832L1.98571 4.485C1.79901 4.2717 1.45231 4.2717 1.26551 4.485L0.372106 5.4854C0.198706 5.6854 0.212106 5.9788 0.398806 6.1522L3.14601 8.7927C3.37271 9.0061 3.74611 8.9527 3.90621 8.6727C5.37321 6.0187 6.94691 4.045 9.61421 1.7777C9.93421 1.4977 9.64081 0.964204 9.22741 1.0977L9.22751 1.0976Z" fill="#42AC52"></path></svg>
              <p className="text-xs leading-[15px] text-gray-500/80">Email me a copy & subscribe to get updates and exclusive access to additional resources</p>
            </div>
          </div>
          </div> */}
        </div>

        <main className="mx-auto max-w-4xl px-4 mt-[15px] " ref={contentRef}>

          {/* Report Header Card */}
          <div
            className="mb-6 px-4 sm:px-15 sm:py-9 py-6 rounded-lg bg-white"
            style={{
              border: '2.5px solid transparent',
              backgroundImage: 'linear-gradient(#FFFFFF, #FFFFFF), linear-gradient(135deg, #8B5CF5 0%, #EF4444 50%, #05B5D4 75%, #0C9668 87.5%, #D68908 93.75%, #3B81F5 100%)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            }}
          >
            <div className="flex flex-col items-center justify-center gap-6 sm:gap-6.5">
              <h2 className="text-[17px] sm:text-[25px] font-bold text-[#111827] text-center ">
                Responsible Tech Evaluation Report
              </h2>

              <div className="flex flex-wrap items-center justify-around  w-full sm:flex-row flex-col gap-[20px]">
                <div className="flex flex-col items-center gap-2 sm:w-[30%]">
                  <div className="md:text-[15px] text-[13px] font-medium text-[#6B7280] text-center w-full">Budget</div>
                  <div className="md:text-[17px] text-[13px] font-bold text-[#111827] text-center w-full">${selectedValues?.budget}</div>
                </div>
                <div className="flex flex-col items-center gap-2 sm:w-[30%]">
                  <div className="md:text-[15px] text-[13px] font-medium text-[#6B7280] text-center w-full">Tech Type</div>
                  <div className="md:text-[17px] text-[13px] font-bold text-[#111827] text-center">{selectedValues?.categoryName}</div>
                </div>
                <div className="flex flex-col items-center gap-2 sm:w-[30%]">
                  <div className="md:text-[15px] text-[13px] font-medium text-[#6B7280] text-center">Generated</div>
                  <div className="md:text-[17px] text-[13px] font-bold text-[#111827] text-center whitespace-nowrap">{formattedDate}</div>
                </div>
              </div>

              <div className="inline-flex items-center justify-center h-[30px] sm:px-[20px] px-[15px] rounded-[18px] bg-[#3B82F6]">
                <span className="sm:text-[13px] text-[11px] font-semibold text-[#FFFFFF] leading-none">{selectedValues?.stage}</span>
              </div>
            </div>
          </div>

          {/* Budget Allocation Summary Card */}
          <div
            className="mb-6 px-8 sm:py-9 py-6 rounded-lg bg-white"
            style={{
              border: '2.5px solid transparent',
              backgroundImage: 'linear-gradient(#FFFFFF, #FFFFFF), linear-gradient(135deg, #8B5CF5 0%, #EF4444 50%, #05B5D4 75%, #0C9668 87.5%, #D68908 93.75%, #3B81F5 100%)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            }}
          >
            <h3 className="text-[17px] sm:text-[25px] font-bold text-[#111827] mb-8">Budget Allocation Summary</h3>
            <div className="flex flex-col gap-4">
              {uniqueByPrinciple?.map((up, i) =>
                <div className="flex items-center justify-between" key={i}>
                  <div className="flex items-center gap-3">
                    <div className={`w-[3px] h-16 rounded-full bg-[${up.principleColor}]`} style={{ background: up.principleColor }}></div>
                    <div className="flex flex-col gap-1">
                      <div className="text-[15px] sm:text-[18px]  font-semibold text-[#111827]">{up.principleName}</div>
                      <div className="text-xs sm:text-sm font-medium text-[#6B7280]">{up.principleDes}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="sm:text-lg text-md font-bold text-[#111827]">{up.principlePercentage}%</div>
                    <div className="text-xs sm:text-sm font-medium text-[#111827]">${up.principleBudget.toLocaleString("en-US")}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tasks Container */}
          <div className="flex flex-col gap-10">
            {groupedByPrinciple?.map((principle: any, index: number) => {

              return <div key={index} className="max-w-4xl px-5 py-6 sm:py-8 lg:py-12 rounded-md border-2 border-[#E5E7EB]">
                {/* Section Header */}
                <div className="mb-8 flex gap-2 items-center">
                  <div className={`flex h-2 w-2 flex-shrink-0 rounded-full bg-[#${principle.principleColor}]`} style={{ background: principle.principleColor }}></div>
                  <div className="flex gap-1 items-center">
                    <h2 className="sm:text-[20px] text-medium font-semibold text-[#111827]">{principle.principleName}</h2>
                    <p className="sm:text-[15px] text-xs font-medium text-[#6B7280]">— ${principle.principleBudget.toLocaleString("en-US")} allocated</p>
                  </div>
                </div>

                {/* Task Container */}
                {(Object.entries(principle.items || {}) as [string, any[]][])
                  .map(([layerKey, items], layerIndex) =>
                    <div key={layerKey}>
                      {/* Layer title */}
                      <div className="my-8 font-semibold lg:text-[20px] text-[17px]">
                        {principle.layerName[layerIndex]}
                      </div>

                      {items?.map((item1: any, j: number) => {
                        const item = item1?.fields;

                        return typeof item != "undefined" ?
                          <div key={j} className="border-l-2 border-[#E5E7EB] bg-white px-4 sm:px-6 mb-8">
                            {/* Task 1: Document dataset representation gaps */}
                            <div className="flex flex-col gap-8">
                              <div className="flex items-start justify-between gap-4 flex-wrap">
                                <div className="flex items-center gap-3">
                                  {
                                    (item['Category'] == "skip"
                                      ?
                                      <div className="inline-flex items-center px-3 py-2 rounded-full bg-[#EF4444]">
                                        <span className="text-[10px] font-semibold text-white leading-[normal]">SKIP FOR NOW</span>
                                      </div> :
                                      item['Category'] == "must_have" ?
                                        <div className="inline-flex items-center px-3 py-2 rounded-full bg-[#10B981]">
                                          <span className="text-[10px] font-semibold text-white leading-[normal]">MUST HAVE</span>
                                        </div>

                                        :
                                        <div className="inline-flex items-center px-3 py-2 rounded-full bg-[#F59E0B]">
                                          <span className="text-[10px] font-semibold text-white leading-[normal]">SHOULD HAVE</span>
                                        </div>)
                                  }

                                  <div className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4" viewBox="0 0 10 10" fill="none">
                                      <circle cx="5" cy="5" r="4.167" stroke="#6B7280" strokeWidth="0.833" />
                                      <path d="M5 2.5V5L6.667 5.833" stroke="#6B7280" strokeWidth="0.833" strokeLinecap="round" />
                                    </svg>
                                    <span className="text-xs font-medium text-[#6B7280]">{item["Time Weeks"]} week</span>
                                  </div>
                                </div>
                                <div className="text-sm font-semibold" style={{ color: principle.principleColor }}>{item["Cost Display"]}</div>
                              </div>

                              <h4 className="text-[15px] sm:text-[20px] font-semibold text-[#111827] leading-tight">
                                {item["Item Name"]}
                              </h4>

                              <div className="flex items-start gap-1.5">
                                <Image src="/warning.svg" width={15} height={15} alt="Icon" className="mt-1" />
                                <div className="flex flex-col gap-3.5 w-full">
                                  <div className="sm:text-[15px] text-[13px] font-semibold text-[#111827]">Why This Matters:</div>
                                  <p className="text-xs sm:text-sm font-medium text-[#6B7280] leading-relaxed">
                                    {item["Why This Matters"]}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start gap-1.5">
                                <Image src="/quesmark.svg" width={15} height={15} alt="Icon" className="mt-1" />
                                <div className="flex flex-col gap-3.5 w-full">
                                  <div className="sm:text-[15px] text-[13px] font-semibold text-[#111827]">What To Look For:</div>
                                  <div className="flex flex-col gap-3">
                                    {item["What To Look For"]?.split("\\n").map((line: string) => line.replace("• ", "")).map((line: any, idx: number) => (
                                      <div key={idx} className="flex items-center gap-1.5">
                                        <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: principle.principleColor }}></div>
                                        <p className="text-xs sm:text-sm font-medium text-[#6B7280]">
                                          {line}
                                        </p>
                                      </div>
                                    ))}

                                  </div>
                                </div>
                              </div>

                              <div className="p-4 rounded-md border border-[#E5E7EB] bg-[#F9FAFB]">
                                <div className="flex flex-col gap-3.5 w-full">
                                  <div className="sm:text-[15px] text-[13px] font-semibold text-[#111827]">Common Due Diligence Questions</div>
                                  <div className="flex flex-col gap-3">

                                    {item["Due Diligence Questions"]?.split("\\n").map((line: string) => line.replace("• ", "")).map((line2: any, idx2: number) => (
                                      <div key={idx2} className="flex items-center gap-1.5">
                                        <div className="text-sm font-bold" style={{ color: principle.principleColor }}>{idx2 + 1}.</div>
                                        <p className="text-xs sm:text-sm font-medium text-[#6B7280]">
                                          {line2}
                                        </p>
                                      </div>
                                    ))}

                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {item["Red Flags"] ?
                                  <div className="p-6 rounded-md border border-[#EF4444] bg-[#FDF4F4]">
                                    <div className="flex flex-col gap-2">
                                      <div className="sm:text-sm text-xs font-semibold text-[#EF4444]">Red Flags</div>
                                      <div className="flex flex-col sm:gap-3 gap-2">

                                        {item["Red Flags"]?.split("\\n").map((line: string) => line.replace("• ", "")).map((flag1: any, idx3: number) => (
                                          <div key={idx3} className="flex items-center gap-2">
                                            <Image src="/cross.svg" width={9} height={9} alt="Icon" />
                                            <p className="sm:text-sm text-xs font-medium text-[#EF4444]">
                                              {flag1}
                                            </p>
                                          </div>
                                        ))}

                                      </div>
                                    </div>
                                  </div> : ""}

                                {item["Green Flags"] ?
                                  <div className="p-6 rounded-md border border-[#10B981] bg-[#F4FBF7]">
                                    <div className="flex flex-col gap-2">
                                      <div className="sm:text-sm text-xs font-semibold text-[#10B981]">Green Flags</div>
                                      <div className="flex flex-col sm:gap-3 gap-2">

                                        {item["Green Flags"]?.split("\\n").map((line: string) => line.replace("• ", "")).map((flag2: any, idx4: number) => (
                                          <div key={idx4} className="flex items-center gap-2">
                                            <Image src="/tick.svg" width={9} height={9} alt="Icon" />
                                            <p className="sm:text-sm text-xs font-medium text-[#10B981]">
                                              {flag2}
                                            </p>
                                          </div>
                                        ))}


                                      </div>
                                    </div>
                                  </div> : ""}
                              </div>
                              {item["Investment Recommendation"] ?
                                <div className="p-3 rounded bg-purple-100">
                                  <p className="sm:text-sm text-xs text-[#111827] leading-relaxed">
                                    <span className="font-bold text-[#8B5CF6]">Recommendation:</span>{' '}
                                    {item["Investment Recommendation"]}                </p>
                                </div> : ""}
                            </div>
                          </div> : ""
                      }

                      )}
                    </div>
                  )
                }

              </div>
            }
            )}
          </div>

          <footer className="border-t-2 border-gray-200 py-4 my-6 sm:my-8 lg:my-12">

            <div className="flex items-center justify-between text-[8px] font-medium text-gray-400">
              <span className="text-xs sm:text-sm">The Kaleidoscope Project</span>
              <span className="text-xs sm:text-sm">{formattedDate}</span>
            </div>

          </footer>
        </main>

      </div>
    </div>
  );
}
