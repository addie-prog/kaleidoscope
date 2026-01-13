"use client";

import React, { useState } from "react";

interface ActionStep {
  id: number;
  text: string;
  completed: boolean;
  skipped: boolean;
  note: string;
}

export default function TasksPage() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<"action" | "context" | "diligence">("action");
  const [actionSteps, setActionSteps] = useState<ActionStep[]>([
    { id: 1, text: "Document all data sources and collection methods", completed: false, skipped: false, note: "" },
    { id: 2, text: "Analyze demographic distribution across datasets", completed: false, skipped: false, note: "" },
    { id: 3, text: "Identify and document any gaps or underrepresentation", completed: false, skipped: false, note: "" },
    { id: 4, text: "Create remediation plan for identified biases", completed: false, skipped: false, note: "" },
  ]);
  const [activeNoteId, setActiveNoteId] = useState<number | null>(null);
  const [tempNote, setTempNote] = useState("");

  const toggleCheckbox = (id: number) => {
    setActionSteps((prev) =>
      prev.map((step) => 
        step.id === id && !step.skipped 
          ? { ...step, completed: !step.completed } 
          : step
      )
    );
  };

  const toggleSkip = (id: number) => {
    setActionSteps((prev) =>
      prev.map((step) => {
        if (step.id === id) {
          const newSkipped = !step.skipped;
          return {
            ...step,
            skipped: newSkipped,
            completed: newSkipped ? false : step.completed,
          };
        }
        return step;
      })
    );
  };

  const openNote = (id: number, currentNote: string) => {
    setActiveNoteId(id);
    setTempNote(currentNote);
  };

  const saveNote = () => {
    if (activeNoteId !== null) {
      setActionSteps((prev) =>
        prev.map((step) =>
          step.id === activeNoteId ? { ...step, note: tempNote } : step
        )
      );
      setActiveNoteId(null);
      setTempNote("");
    }
  };

  const cancelNote = () => {
    setActiveNoteId(null);
    setTempNote("");
  };

  const completedCount = actionSteps.filter(step => step.completed && !step.skipped).length;
  const totalSteps = actionSteps.length;
  const progressPercentage = (completedCount / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-[#F0F0F0] p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#323743] mb-8">Task Management</h1>

        {/* Collapsible Card */}
        <div
          className={`rounded-xl bg-white transition-all duration-300 ${
            isExpanded ? "border-2 border-[#895AF6]" : "border-2 border-[#E5E7EB]"
          }`}
        >
          {/* Card Header */}
          <div className="p-6 pb-7">
            <div className="flex justify-between items-start mb-5">
              <div className="flex items-start gap-2.5 flex-1">
                <div className="mt-1 w-3.5 h-3.5 flex-shrink-0 rounded-[1px] border border-[#323743] bg-[#F9FAFB]" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#323743] leading-6 mb-4">
                    Inclusive Design Workshop Series
                  </h3>
                  <div className="flex items-center gap-6">
                    <span className="text-base font-medium text-[#ADADAD]">
                      $3,000 - $8,000
                    </span>
                    <div className="flex items-center gap-1.5">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_time)">
                          <path
                            d="M8.00016 14.6663C11.6822 14.6663 14.6668 11.6817 14.6668 7.99967C14.6668 4.31767 11.6822 1.33301 8.00016 1.33301C4.31816 1.33301 1.3335 4.31767 1.3335 7.99967C1.3335 11.6817 4.31816 14.6663 8.00016 14.6663Z"
                            stroke="#ADADAD"
                            strokeWidth="1.5"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M8.00293 4V8.00333L10.8293 10.83"
                            stroke="#ADADAD"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_time">
                            <rect width="16" height="16" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      <span className="text-base font-medium text-[#ADADAD]">3 Weeks</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-0 hover:opacity-70 transition-opacity"
                aria-label={isExpanded ? "Collapse" : "Expand"}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`transition-transform duration-300 ${
                    isExpanded ? "" : "rotate-180"
                  }`}
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.3763 8.62371C12.1888 8.43624 11.9345 8.33093 11.6693 8.33093C11.4041 8.33093 11.1498 8.43624 10.9623 8.62371L5.30529 14.2807C5.20978 14.373 5.1336 14.4833 5.08119 14.6053C5.02878 14.7273 5.00119 14.8585 5.00004 14.9913C4.99888 15.1241 5.02419 15.2558 5.07447 15.3787C5.12475 15.5016 5.199 15.6132 5.29289 15.7071C5.38679 15.801 5.49844 15.8753 5.62133 15.9255C5.74423 15.9758 5.87591 16.0011 6.00869 16C6.14147 15.9988 6.27269 15.9712 6.39469 15.9188C6.5167 15.8664 6.62704 15.7902 6.71929 15.6947L11.6693 10.7447L16.6193 15.6947C16.8079 15.8769 17.0605 15.9777 17.3227 15.9754C17.5849 15.9731 17.8357 15.8679 18.0211 15.6825C18.2065 15.4971 18.3117 15.2463 18.314 14.9841C18.3162 14.7219 18.2154 14.4693 18.0333 14.2807L12.3763 8.62371Z"
                    fill="#323743"
                  />
                </svg>
              </button>
            </div>

            {/* Progress */}
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-sm font-medium text-[#ADADAD]">Step {completedCount} of {totalSteps}</span>
                <span className="text-sm font-medium text-[#ADADAD]">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="h-1.5 bg-[#F0F0F0] rounded-[10px] overflow-hidden">
                <div
                  className="h-full bg-[#895AF6] rounded-[10px] transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Collapsible Content */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {/* Tabs */}
            <div className="flex items-center border-t border-b border-[#E5E5E5] px-5">
              <button
                onClick={() => setActiveTab("action")}
                className={`flex items-center justify-center gap-1 px-4 py-3 transition-colors ${
                  activeTab === "action"
                    ? "border-b-2 border-[#895AF6]"
                    : "border-b-2 border-transparent"
                }`}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.875 3H4.125C3.71079 3 3.375 3.33579 3.375 3.75V15.75C3.375 16.1642 3.71079 16.5 4.125 16.5H13.875C14.2892 16.5 14.625 16.1642 14.625 15.75V3.75C14.625 3.33579 14.2892 3 13.875 3Z"
                    stroke="#895AF6"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.75 1.5V3.75M11.25 1.5V3.75M6 7.125H12M6 10.125H10.5M6 13.125H9"
                    stroke="#895AF6"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-sm font-medium text-[#895AF6]">Action</span>
              </button>
              <button
                onClick={() => setActiveTab("context")}
                className={`flex items-center justify-center gap-1 px-4 py-3 rounded-[10px] transition-colors ${
                  activeTab === "context" ? "bg-gray-100" : ""
                }`}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 14.25C7.97387 13.6576 6.80987 13.3457 5.625 13.3457C4.44013 13.3457 3.27613 13.6576 2.25 14.25V4.50003C3.27613 3.9076 4.44013 3.5957 5.625 3.5957C6.80987 3.5957 7.97387 3.9076 9 4.50003M9 14.25C10.0261 13.6576 11.1901 13.3457 12.375 13.3457C13.5599 13.3457 14.7239 13.6576 15.75 14.25V4.50003C14.7239 3.9076 13.5599 3.5957 12.375 3.5957C11.1901 3.5957 10.0261 3.9076 9 4.50003M9 14.25V4.50003"
                    stroke="#323743"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-sm font-normal text-[#323743]">Context & Education</span>
              </button>
              <button
                onClick={() => setActiveTab("diligence")}
                className={`flex items-center justify-center gap-1 px-4 py-3 rounded-[10px] transition-colors ${
                  activeTab === "diligence" ? "bg-gray-100" : ""
                }`}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.375 8.25L8.5455 10.4205C8.56659 10.4416 8.59519 10.4534 8.625 10.4534C8.65481 10.4534 8.68341 10.4416 8.7045 10.4205L14.625 4.5"
                    stroke="#323743"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M14.5184 7.91005C14.7674 9.17094 14.5772 10.4791 13.9793 11.6168C13.3814 12.7545 12.4119 13.6531 11.2322 14.1632C10.0524 14.6732 8.73364 14.7638 7.49523 14.42C6.25683 14.0762 5.17351 13.3186 4.42558 12.2734C3.67764 11.2282 3.31019 9.9584 3.38438 8.6753C3.45858 7.39219 3.96994 6.17319 4.83336 5.22116C5.69678 4.26913 6.8602 3.64149 8.12998 3.4427C9.39976 3.24391 10.6993 3.48595 11.8124 4.12855"
                    stroke="#323743"
                    strokeWidth="0.75"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="text-sm font-normal text-[#323743]">Diligence Tab</span>
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "action" && (
              <div className="px-5 py-7 flex flex-col gap-8">
                {/* Cost and Timeline */}
                <div className="flex items-start gap-14">
                  <div className="flex flex-col gap-2.5">
                    <div className="text-sm font-medium text-[#6B7280] leading-6">
                      Estimate Cost
                    </div>
                    <div className="text-base font-medium text-[#323743]">
                      $3,000 - $8,000
                    </div>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <div className="text-sm font-medium text-[#6B7280] leading-6">Timeline</div>
                    <div className="text-base font-medium text-[#323743]">3 weeks</div>
                  </div>
                </div>

                {/* Action Steps */}
                <div className="flex flex-col gap-8">
                  <h4 className="text-base font-medium text-[#323743]">Action Steps</h4>
                  <div className="flex flex-col gap-4">
                    {actionSteps.map((step, index) => (
                      <React.Fragment key={step.id}>
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleCheckbox(step.id)}
                                disabled={step.skipped}
                                className={`w-3.5 h-3.5 rounded-[1px] flex items-center justify-center transition-colors ${
                                  step.skipped
                                    ? "border border-[#C5C5C5] bg-[#F5F5F5] cursor-not-allowed"
                                    : "border border-[#323743] bg-[#F9FAFB] hover:bg-gray-100"
                                }`}
                              >
                                {step.completed && (
                                  <svg
                                    width="10"
                                    height="7"
                                    viewBox="0 0 10 7"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M3.41997 5.47216L8.90063 0.187083C9.02997 0.0623609 9.18086 0 9.35331 0C9.52576 0 9.67666 0.0623609 9.80599 0.187083C9.93533 0.311804 10 0.460015 10 0.631715C10 0.803415 9.93533 0.951418 9.80599 1.07572L3.87265 6.81292C3.74332 6.93764 3.59242 7 3.41997 7C3.24752 7 3.09663 6.93764 2.96729 6.81292L0.186544 4.1314C0.0572069 4.00668 -0.00487502 3.85868 0.00029847 3.68739C0.00547196 3.51611 0.0729427 3.3679 0.202711 3.24276C0.332479 3.11762 0.486175 3.05526 0.663798 3.05568C0.841421 3.05609 0.994901 3.11846 1.12424 3.24276L3.41997 5.47216Z"
                                      fill="white"
                                    />
                                  </svg>
                                )}
                              </button>
                              <span
                                className={`text-base font-normal transition-all ${
                                  step.skipped
                                    ? "text-[#895AF6] line-through"
                                    : "text-[#323743]"
                                }`}
                              >
                                {step.text}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleSkip(step.id)}
                                className="flex items-center justify-center gap-2.5 h-5 px-2 py-1.5 rounded-[10px] bg-[rgba(137,90,246,0.32)] hover:bg-[rgba(137,90,246,0.4)] transition-colors"
                              >
                                <span className="text-xs font-medium text-[#895AF6]">
                                  {step.skipped ? "Include" : "Skip"}
                                </span>
                              </button>
                              <button
                                onClick={() => openNote(step.id, step.note)}
                                className="flex items-center justify-center gap-1 px-1.5 py-1 rounded-[10px] bg-[rgba(137,90,246,0.32)] hover:bg-[rgba(137,90,246,0.4)] transition-colors"
                              >
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 12 12"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M7.71429 3.85714C7.71429 4.88012 7.30791 5.8612 6.58455 6.58455C5.8612 7.30791 4.88012 7.71429 3.85714 7.71429C2.83417 7.71429 1.85309 7.30791 1.12973 6.58455C0.406376 5.8612 0 4.88012 0 3.85714C0 2.83417 0.406376 1.85309 1.12973 1.12973C1.85309 0.406376 2.83417 0 3.85714 0C4.88012 0 5.8612 0.406376 6.58455 1.12973C7.30791 1.85309 7.71429 2.83417 7.71429 3.85714ZM4.28571 2.14286C4.28571 2.02919 4.24056 1.92018 4.16019 1.83981C4.07982 1.75944 3.97081 1.71429 3.85714 1.71429C3.74348 1.71429 3.63447 1.75944 3.5541 1.83981C3.47372 1.92018 3.42857 2.02919 3.42857 2.14286V3.42857H2.14286C2.02919 3.42857 1.92018 3.47372 1.83981 3.5541C1.75944 3.63447 1.71429 3.74348 1.71429 3.85714C1.71429 3.97081 1.75944 4.07982 1.83981 4.16019C1.92018 4.24056 2.02919 4.28571 2.14286 4.28571H3.42857V5.57143C3.42857 5.68509 3.47372 5.7941 3.5541 5.87447C3.63447 5.95485 3.74348 6 3.85714 6C3.97081 6 4.07982 5.95485 4.16019 5.87447C4.24056 5.7941 4.28571 5.68509 4.28571 5.57143V4.28571H5.57143C5.68509 4.28571 5.7941 4.24056 5.87447 4.16019C5.95485 4.07982 6 3.97081 6 3.85714C6 3.74348 5.95485 3.63447 5.87447 3.5541C5.7941 3.47372 5.68509 3.42857 5.57143 3.42857H4.28571V2.14286ZM9.85714 2.57143H8.394C8.30996 2.2754 8.19713 1.98832 8.05714 1.71429H9.85714C10.4255 1.71429 10.9705 1.94005 11.3724 2.34191C11.7742 2.74378 12 3.28882 12 3.85714V7.53086C11.9997 7.87174 11.864 8.19854 11.6229 8.43943L8.43943 11.6237C8.1984 11.8646 7.87161 11.9999 7.53086 12H3.85714C3.28882 12 2.74378 11.7742 2.34191 11.3724C1.94005 10.9705 1.71429 10.4255 1.71429 9.85714V8.05714C1.98629 8.19657 2.272 8.30886 2.57143 8.394V9.85714C2.57143 10.1981 2.70689 10.5252 2.94801 10.7663C3.18912 11.0074 3.51615 11.1429 3.85714 11.1429H6.85714V9.42857C6.85714 8.74659 7.12806 8.09253 7.6103 7.6103C8.09253 7.12806 8.74659 6.85714 9.42857 6.85714H11.1429V3.85714C11.1429 3.51615 11.0074 3.18912 10.7663 2.94801C10.5252 2.70689 10.1981 2.57143 9.85714 2.57143ZM7.71429 11.1017C7.75881 11.0808 7.7994 11.0524 7.83429 11.0177L11.0177 7.83343C11.0523 7.7988 11.0807 7.75851 11.1017 7.71429H9.42857C8.97392 7.71429 8.53788 7.8949 8.21639 8.21639C7.8949 8.53788 7.71429 8.97392 7.71429 9.42857V11.1017Z"
                                    fill="#895AF6"
                                  />
                                </svg>
                                <span className="text-xs font-medium text-[#895AF6]">Note</span>
                              </button>
                            </div>
                          </div>

                          {/* Notes Section */}
                          {activeNoteId === step.id && (
                            <div className="flex flex-col gap-2 mt-2">
                              <textarea
                                value={tempNote}
                                onChange={(e) => setTempNote(e.target.value)}
                                placeholder="Enter Notes"
                                className="h-[100px] px-3 py-4 border border-[#C5C5C5] rounded-lg text-sm text-[#323743] placeholder:text-[#C5C5C5] focus:outline-none focus:border-[#895AF6] resize-none"
                              />
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={saveNote}
                                  className="px-4 py-3 bg-[#895AF6] text-white text-base font-semibold rounded-xl hover:bg-[#7a4dd6] transition-colors"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={cancelNote}
                                  className="px-4 py-3 border border-[#895AF6] text-[#895AF6] text-base font-semibold rounded-xl hover:bg-[rgba(137,90,246,0.1)] transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        {index < actionSteps.length - 1 && (
                          <div className="h-px bg-[#EAEAEA]" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "context" && (
              <div className="px-5 py-7">
                <p className="text-base text-[#323743]">
                  Context & Education content goes here...
                </p>
              </div>
            )}

            {activeTab === "diligence" && (
              <div className="px-5 py-7">
                <p className="text-base text-[#323743]">Diligence Tab content goes here...</p>
              </div>
            )}
          </div>
        </div>

        {/* Demo Controls */}
        <div className="mt-8 p-6 bg-white rounded-xl border border-[#E5E7EB]">
          <h2 className="text-lg font-semibold text-[#323743] mb-4">Demo Controls</h2>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-2 bg-[#895AF6] text-white rounded-lg hover:bg-[#7a4dd6] transition-colors"
          >
            {isExpanded ? "Collapse Card" : "Expand Card"}
          </button>
        </div>
      </div>
    </div>
  );
}
