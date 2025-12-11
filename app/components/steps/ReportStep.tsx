'use client';

import Image from "next/image";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

export default function ReportPage() {
  const contentRef = useRef<HTMLDivElement>(null);

  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <div> 
      {/* <button onClick={reactToPrintFn}>Download PDF</button> */}
      {/* Main Content */}
      <div ref={contentRef}>
      <main  className="mx-auto max-w-4xl px-4  py-6 sm:py-8 lg:py-12">
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

            <div className="flex flex-wrap items-center justify-around  w-full">
              <div className="flex flex-col items-center gap-2 sm:w-[30%]">
                <div className="sm:text-[15px] text-[12px] font-medium text-[#6B7280] text-center w-full">Budget</div>
                <div className="sm:text-[17px] text-[12px] font-bold text-[#111827] text-center w-full">$50.0K</div>
              </div>
              <div className="flex flex-col items-center gap-2 sm:w-[30%]">
                <div className="sm:text-[15px] text-[12px] font-medium text-[#6B7280] text-center w-full">Tech Type</div>
                <div className="sm:text-[17px] text-[12px] font-bold text-[#111827] text-center">AI/ML Models</div>
              </div>
              <div className="flex flex-col items-center gap-2 sm:w-[30%]">
                <div className="sm:text-[15px] text-[12px] font-medium text-[#6B7280] text-center">Generated</div>
                <div className="sm:text-[17px] text-[12px] font-bold text-[#111827] text-center whitespace-nowrap">December 1, 2025</div>
              </div>
            </div>

            <div className="inline-flex items-center justify-center h-[30px] sm:px-[20px] px-[15px] rounded-[18px] bg-[#3B82F6]">
              <span className="sm:text-[13px] text-[11px] font-semibold text-[#FFFFFF] leading-none">Early Implementation ($25K-$75K)</span>
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

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-[3px] h-16 rounded-full bg-[#8B5CF6]"></div>
              <div className="flex flex-col gap-1">
                <div className="text-[15px] sm:text-[18px]  font-semibold text-[#111827]">Fairness</div>
                <div className="text-sm font-medium text-[#6B7280]">Ensuring equitable outcomes</div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="sm:text-lg text-md font-bold text-[#111827]">100%</div>
              <div className="text-sm font-medium text-[#111827]">$12.0K</div>
            </div>
          </div>
        </div>

        {/* Tasks Container */}
        <div className="mx-auto max-w-4xl px-5 py-6 sm:py-8 lg:py-12 rounded-md border-2 border-[#E5E7EB]">
          {/* Section Header */}
          <div className="mb-8 flex gap-2 items-center">
            <div className="flex h-2 w-2 flex-shrink-0 rounded-full bg-[#8B5CF6]"></div>
            <div className="flex gap-1 items-center">
              <h2 className="sm:text-[20px] text-medium font-semibold text-[#111827]">Fairness</h2>
              <p className="sm:text-[15px] text-xs font-medium text-[#6B7280]">— $50.0K allocated</p>
            </div>
          </div>

          {/* Task Container */}
          <div className="border-l-2 border-[#E5E7EB] bg-white px-4 sm:px-6 mb-8">
            {/* Task 1: Document dataset representation gaps */}
            <div className="flex flex-col gap-8">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center px-3 py-2 rounded-full bg-[#10B981]">
                    <span className="text-[10px] font-semibold text-white leading-[normal]">MUST HAVE</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" viewBox="0 0 10 10" fill="none">
                      <circle cx="5" cy="5" r="4.167" stroke="#6B7280" strokeWidth="0.833" />
                      <path d="M5 2.5V5L6.667 5.833" stroke="#6B7280" strokeWidth="0.833" strokeLinecap="round" />
                    </svg>
                    <span className="text-xs font-medium text-[#6B7280]">0.5 week</span>
                  </div>
                </div>
                <div className="text-sm font-semibold text-[#8B5CF6]">$0 (Internal review 4–10 hrs)</div>
              </div>

              <h4 className="text-[15px] sm:text-[20px] font-semibold text-[#111827] leading-tight">
                Document dataset representation gaps
              </h4>

              <div className="flex items-start gap-1.5">
                <Image src="/warning.svg" width={15} height={15} alt="Icon" className="mt-1" />
                <div className="flex flex-col gap-3.5 w-full">
                  <div className="sm:text-[15px] text-[13px] font-semibold text-[#111827]">Why This Matters:</div>
                  <p className="text-xs sm:text-sm font-medium text-[#6B7280] leading-relaxed">
                    Early identification of representation gaps prevents downstream bias and helps funders assess whether the project's data foundations are viable.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-1.5">
                <Image src="/quesmark.svg" width={15} height={15} alt="Icon" className="mt-1" />
                <div className="flex flex-col gap-3.5 w-full">
                  <div className="sm:text-[15px] text-[13px] font-semibold text-[#111827]">What To Look For:</div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-[#8B5CF6] flex-shrink-0 "></div>
                      <p className="text-xs sm:text-sm font-medium text-[#6B7280]">Simple table showing demographic groups present/absent</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-[#8B5CF6] flex-shrink-0 "></div>
                      <p className="text-xs sm:text-sm font-medium text-[#6B7280]">Notes on data sources and known limitations</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-[#8B5CF6] flex-shrink-0 "></div>
                      <p className="text-xs sm:text-sm font-medium text-[#6B7280]">Evidence of basic descriptive statistics</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-md border border-[#E5E7EB] bg-[#F9FAFB]">
                <div className="flex flex-col gap-3.5 w-full">
                  <div className="sm:text-[15px] text-[13px] font-semibold text-[#111827]">Due Diligence Questions</div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="text-sm text-[#8B5CF6] font-bold">1.</div>
                      <p className="text-xs sm:text-sm font-medium text-[#6B7280]">Which demographic groups are currently over- or underrepresented?</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="text-sm text-[#8B5CF6] font-bold">2.</div>
                      <p className="text-xs sm:text-sm font-medium text-[#6B7280]">How did you assess representation gaps?</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="text-sm text-[#8B5CF6] font-bold">3.</div>
                      <p className="text-xs sm:text-sm font-medium text-[#6B7280]">What assumptions remain unverified?</p>
                    </div>

                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-6 rounded-md border border-[#EF4444] bg-[#FDF4F4]">
                  <div className="flex flex-col gap-2">
                    <div className="sm:text-sm text-xs font-semibold text-[#EF4444]">Red Flags</div>
                    <div className="flex flex-col sm:gap-3 gap-2">
                      <div className="flex items-center gap-2">
                        <Image src="/cross.svg" width={9} height={9} alt="Icon" />
                        <p className="sm:text-sm text-xs font-medium text-[#EF4444]">No dataset documentation</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Image src="/cross.svg" width={9} height={9} alt="Icon" />
                        <p className="sm:text-sm text-xs font-medium text-[#EF4444]">Representative data claim unsupported</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Image src="/cross.svg" width={9} height={9} alt="Icon" />
                        <p className="sm:text-sm text-xs font-medium text-[#EF4444]">Missing groups not considered</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-md border border-[#10B981] bg-[#F4FBF7]">
                  <div className="flex flex-col gap-2">
                    <div className="sm:text-sm text-xs font-semibold text-[#10B981]">Green Flags</div>
                    <div className="flex flex-col sm:gap-3 gap-2">
                      <div className="flex items-center gap-2">
                        <Image src="/tick.svg" width={9} height={9} alt="Icon" />
                        <p className="sm:text-sm text-xs font-medium text-[#10B981]">Clear table of data distributions</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Image src="/tick.svg" width={9} height={9} alt="Icon" />
                        <p className="sm:text-sm text-xs font-medium text-[#10B981]">Transparent discussion of gaps</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Image src="/tick.svg" width={9} height={9} alt="Icon" />
                        <p className="sm:text-sm text-xs font-medium text-[#10B981]">Basic descriptive stats included</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded bg-purple-100">
                <p className="sm:text-sm text-xs text-[#111827] leading-relaxed">
                  <span className="font-bold text-[#8B5CF6]">Recommendation:</span>{' '}
                  Foundations should expect at least lightweight documentation of representation patterns at the planning stage.
                </p>
              </div>
            </div>
          </div>

          {/* Task 2: Conduct stakeholder consultation */}
          <div className="border-l-2 border-gray-200 bg-white px-4 sm:px-6 mb-8">
            <div className="flex flex-col gap-8">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center px-3 py-2 rounded-full bg-[#F59E0B]">
                    <span className="text-[10px] font-semibold text-white leading-[normal]">SHOULD HAVE</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 10 10" fill="none">
                      <circle cx="5" cy="5" r="4.167" stroke="#6B7280" strokeWidth="0.833" />
                      <path d="M5 2.5V5L6.667 5.833" stroke="#6B7280" strokeWidth="0.833" strokeLinecap="round" />
                    </svg>
                    <span className="text-xs font-medium text-[#6B7280]">3 weeks</span>
                  </div>
                </div>
                <div className="text-sm font-semibold text-[#8B5CF6]">$2K-$5K (Facilitator + participant costs)</div>
              </div>

              <h4 className="text-[15px] sm:text-[20px] font-semibold text-[#111827] leading-tight">
                Conduct stakeholder consultation on fairness definition
              </h4>

              <div className="flex items-start gap-1.5">
                <Image src="/warning.svg" width={15} height={15} alt="Icon" className="mt-1" />
                <div className="flex flex-col gap-3.5 w-full">
                  <div className="sm:text-[15px] text-[13px] font-semibold text-[#111827]">Why This Matters:</div>
                  <p className="text-xs sm:text-sm font-medium text-[#6B7280] leading-relaxed">
                    Technical fairness metrics may not align with community definitions of fairness. Early input prevents costly pivots.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-1.5">
                <Image src="/quesmark.svg" width={15} height={15} alt="Icon" className="mt-1" />
                <div className="flex flex-col gap-3.5">
                  <div className="sm:text-[15px] text-[13px] font-semibold text-[#111827]">What To Look For:</div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-[#8B5CF6] flex-shrink-0 "></div>
                      <p className="text-xs sm:text-sm font-medium text-[#6B7280]">Documentation of stakeholder sessions</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-[#8B5CF6] flex-shrink-0"></div>
                      <p className="text-xs sm:text-sm font-medium text-[#6B7280]">List of participants and their perspectives</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-[#8B5CF6] flex-shrink-0"></div>
                      <p className="text-xs sm:text-sm font-medium text-[#6B7280]">How input shaped fairness definitions</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-md border border-[#E5E7EB] bg-[#F9FAFB]">
                <div className="flex flex-col gap-3.5">
                  <div className="sm:text-[15px] text-[13px] font-semibold text-[#111827]">Due Diligence Questions</div>
                  <div className="flex flex-col gap-3">

                    <div className="flex items-center gap-1.5">
                      <div className="text-xs sm:text-sm text-[#8B5CF6] font-bold">1.</div>
                      <p className="text-xs sm:text-sm font-medium text-[#6B7280]">Who did you consult when defining fairness?</p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <div className="text-xs sm:text-sm text-[#8B5CF6] font-bold">2.</div>
                      <p className="text-xs sm:text-sm font-medium text-[#6B7280]">How did community input change your approach?</p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <div className="text-xs sm:text-sm text-[#8B5CF6] font-bold">3.</div>
                      <p className="text-xs sm:text-sm font-medium text-[#6B7280]">What perspectives are still missing?</p>
                    </div>

                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-6 rounded-md border border-[#EF4444] bg-[#FDF4F4]">
                  <div className="flex flex-col gap-2">
                    <div className="text-xs sm:text-sm font-semibold text-[#EF4444]">Red Flags</div>
                    <div className="flex flex-col sm:gap-3 gap-2">
                      <div className="flex items-center gap-1.5">
                        <Image src="/cross.svg" width={9} height={9} alt="Icon" />
                        <p className="text-xs sm:text-sm font-medium text-[#EF4444]">No community consultation</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Image src="/cross.svg" width={9} height={9} alt="Icon" />
                        <p className="text-xs sm:text-sm font-medium text-[#EF4444]">Only internal team defined fairness</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Image src="/cross.svg" width={9} height={9} alt="Icon" />
                        <p className="text-xs sm:text-sm font-medium text-[#EF4444]">Dismissed stakeholder concerns</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-md border border-[#10B981] bg-[#F4FBF7]">
                  <div className="flex flex-col gap-2">
                    <div className="text-xs sm:text-sm font-semibold text-[#10B981]">Green Flags</div>
                    <div className="flex flex-col sm:gap-3 gap-2">
                      <div className="flex items-center gap-1.5">
                        <Image src="/tick.svg" width={9} height={9} alt="Icon" />
                        <p className="text-xs sm:text-sm font-medium text-[#10B981]">Diverse stakeholder input documented</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Image src="/tick.svg" width={9} height={9} alt="Icon" />
                        <p className="text-xs sm:text-sm font-medium text-[#10B981]">Clear influence on metrics chosen</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Image src="/tick.svg" width={9} height={9} alt="Icon" />
                        <p className="text-xs sm:text-sm font-medium text-[#10B981]">Ongoing feedback mechanism planned</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded bg-purple-100">
                <p className="text-xs sm:text-sm text-[#111827] leading-relaxed">
                  <span className="font-bold text-[#8B5CF6]">Recommendation:</span>{' '}
                  Valuable if budget allows. Can be lightweight (5-10 interviews) or robust (focus groups). Defer if under $25K total budget.
                </p>
              </div>
            </div>
          </div>

          {/* Task 3: Enterprise fairness monitoring platform */}
          <div className="border-l-2 border-gray-200 bg-white px-4 sm:px-6">
            <div className="flex flex-col gap-8">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center px-3 py-2 rounded-full bg-[#EF4444]">
                    <span className="text-[10px] font-semibold text-white leading-[normal]">SKIP FOR NOW</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 10 10" fill="none">
                      <circle cx="5" cy="5" r="4.167" stroke="#6B7280" strokeWidth="0.833" />
                      <path d="M5 2.5V5L6.667 5.833" stroke="#6B7280" strokeWidth="0.833" strokeLinecap="round" />
                    </svg>
                    <span className="text-xs font-medium text-[#6B7280]">12 weeks</span>
                  </div>
                </div>
                <div className="text-sm font-semibold text-[#8B5CF6]">$50K-$150K Annual (Enterprise software)</div>
              </div>

              <h4 className="text-[13px] sm:text-[20px] font-semibold text-[#111827] leading-tight">
                Enterprise fairness monitoring platform
              </h4>
              <div className="flex items-start gap-1.5">
                <Image src="/warning.svg" width={15} height={15} alt="Icon" className="mt-1" />
                <div className="flex flex-col gap-3.5 w-full">
                  <div className="sm:text-[15px] text-[13px] font-semibold text-[#111827]">Why This Matters:</div>
                  <p className="text-xs sm:text-sm font-medium text-[#6B7280] leading-relaxed">
                    Enterprise platforms offer comprehensive monitoring but are expensive for early-stage projects.
                  </p>
                </div>
              </div>


              <div className="flex items-start gap-1.5">
                <Image src="/quesmark.svg" width={15} height={15} alt="Icon" className="mt-1" />
                <div className="flex flex-col gap-3.5">
                  <div className="sm:text-[15px] text-[13px] font-semibold text-[#111827]">What To Look For:</div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-[#8B5CF6] flex-shrink-0"></div>
                      <p className="text-xs sm:text-sm font-medium text-[#6B7280]">Not applicable for this tier</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-md border border-[#E5E7EB] bg-[#F9FAFB]">
                <div className="flex flex-col gap-2">
                  <div className="sm:text-[15px] text-[13px] font-semibold text-[#111827]">Due Diligence Questions</div>
                  <div className="flex flex-col sm:gap-3 gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="text-xs sm:text-sm text-[#8B5CF6] font-bold">1.</div>
                      <p className="text-xs sm:text-sm font-medium text-[#6B7280]">Not applicable for this tier</p>
                    </div>

                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-6 rounded-md border border-[#EF4444] bg-[#FDF4F4]">
                  <div className="flex flex-col gap-2">
                    <div className="text-xs sm:text-sm font-semibold text-[#EF4444]">Red Flags</div>
                    <div className="flex flex-col sm:gap-3 gap-2">
                      <div className="flex items-center gap-1.5">
                        <Image src="/cross.svg" width={9} height={9} alt="Icon" />
                        <p className="text-xs sm:text-sm font-medium text-[#EF4444]">Purchasing enterprise platform at this stage</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-md border border-[#10B981] bg-[#F4FBF7]">
                  <div className="flex flex-col sm:gap-3 gap-2">
                    <div className="text-xs sm:text-sm font-semibold text-[#10B981]">Green Flags</div>
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center gap-1.5">
                        <Image src="/tick.svg" width={9} height={9} alt="Icon" />
                        <p className="text-xs sm:text-sm font-medium text-[#10B981]">Wait until production scale justifies cost</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded bg-purple-100">
                <p className="text-xs sm:text-sm text-[#111827] leading-relaxed">
                  <span className="font-bold text-[#8B5CF6]">Recommendation:</span>{' '}
                  Too expensive for planning/pilot stage. Revisit at $200K+ budget when at scale.
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 sm:px-0 border-t-2 border-gray-200 py-4 ">

        <div className="flex items-center px-4 justify-between text-[8px] font-medium text-gray-400">
          <span className="text-sm">The Kaleidoscope Project</span>
          <span className="text-sm">January 15, 2025</span>
        </div>

      </footer></div>
    </div>
  );
}
