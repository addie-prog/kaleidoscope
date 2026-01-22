"use client";

import React, { use, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { redirect } from "next/navigation";
import SaveProgressModal from "@/components/modals/SaveProgressModal";
import { useModal } from "@/hooks/useModal";
import DownloadReportModal from "@/components/modals/DownloadReportModal";
import DownloadReportCSVModal from "@/components/modals/DownloadReportCSVModal";
import { Doughnut } from 'react-chartjs-2';
import '@/lib/chartjs';

type objectType = {
  [key: string | number]: any
}

interface SubTab {
  id: string;
  name: string;
  percentage: number;
}
type ActiveCards = Record<string, any>;

interface ActionStep {
  step_id: number;
  text: string;
  completed: boolean;
  skipped: boolean;
  note: string;
}
export default function Dashboard2Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tabs, setTabs] = useState<Array<any>>([]);
  const [activeTab, setActiveTab] = useState("FAIRNESS");
  const [activeSubTab, setActiveSubTab] = useState<string>("");
  const [activeNoteId, setActiveNoteId] = useState<{ cardId: number; stepId: number } | null>(null);
  const [tempNote, setTempNote] = useState("");
  const [selectedValues, setSelectedValues] = useState<objectType>({});
  const [currentCards, setActiveCards] = useState<ActiveCards>([]);
  const [currentSubTabs, setCurrentSubTabs] = useState<Array<SubTab>>([])
  const project = use(searchParams)?.project ?? null;
  const saveProgressModal = useModal();
  const downloadReportModal = useModal();
  const downloadCSVModal = useModal();
  const navRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // For second tab row
  const navRef2 = useRef<HTMLDivElement>(null);
  const tabRefs2 = useRef<(HTMLButtonElement | null)[]>([]);

  // Different sub-tabs for different main tabs
  const getSubTabsForTab = (tabId: string): SubTab[] => {
    const principles: any = localStorage.getItem("principles");
    const selectedFormValues: string = localStorage.getItem("selectedValues") ?? "";

    const mainTabs = principles ? JSON.parse(principles) : [];
    if (mainTabs?.length > 0) {
      setTabs(mainTabs);
    }
    const subTabsMap: Record<string, SubTab[]> = mainTabs?.reduce((acc: any, tab: any) => {
      acc[tab.id] = tab?.layers ?? [];
      return acc;
    }, {});

    setSelectedValues(selectedFormValues ? JSON.parse(selectedFormValues) : {});

    return subTabsMap[tabId] || [];
  };

  // Different cards for different sub-tabs
  const getCardsForSubTab = (subCardId: string): any => {
    const items: any = localStorage.getItem("newReportData");
    const cards = items ? JSON.parse(items) : [];

    const cardsMap: Record<string, SubTab[]> = cards.reduce((acc: any, tab: any) => {
      acc[tab.layerId] = tab?.items ?? [];
      return acc;
    }, {});

    const groupedByCategory = (cardsMap[subCardId] || []).reduce(
      (acc: any, card: any) => {
        const category =
          Array.isArray(card["Category"])
            ? card["Category"][0]
            : card["Category"] || "Uncategorized";

        if (!acc[category]) {
          acc[category] = [];
        }

        acc[category].push({
          ...card,
          activeCardTab: "action",
          isExpanded: false,
          cardChecked: false,
          steps: card?.steps?.map((step: any) => ({
            ...step,
            completed: step.completed ?? false,
            skipped: step.skipped ?? false,
            note: step.note ?? "",
          })),
        });

        return acc;
      },
      []
    );

    const groupedCards = subCardId && groupedByCategory;
    return groupedCards;
  };


  const scrollNextTabIfNeeded = (
    nav: HTMLDivElement | null,
    tabRefs: (HTMLButtonElement | null)[],
    index: number
  ) => {
    if (!nav) return;

    const currentTab = tabRefs[index];
    const nextTab = tabRefs[index + 1];
    if (!currentTab) return;

    const navLeft = nav.scrollLeft;
    const navRight = nav.scrollLeft + nav.offsetWidth;

    const currentLeft = currentTab.offsetLeft;
    const currentRight = currentLeft + currentTab.offsetWidth;

    const isFullyVisible =
      currentLeft >= navLeft && currentRight <= navRight;

    // Case : clicked tab NOT fully visible
    if (!isFullyVisible) {
      let targetLeft = currentLeft;

      // Add a little peek of next tab if exists
      if (nextTab) {
        const peek = nextTab.offsetWidth * 0.25; // 25% peek
        targetLeft = Math.max(
          0,
          currentRight - nav.offsetWidth + peek
        );
      }

      nav.scrollTo({
        left: targetLeft,
        behavior: "smooth",
      });
      return;
    }

    // Case : clicked tab fully visible → show half of next tab
    if (nextTab) {
      nav.scrollTo({
        left: nav.scrollLeft + nextTab.offsetWidth / 2,
        behavior: "smooth",
      });
    }
  };

  const toggleCheckbox = (cardId: number, stepId: number, category: any) => {
    setActiveCards((prev: any) => ({
      ...prev,
      [activeSubTab]: {
        ...prev[activeSubTab],
        [category]: prev[activeSubTab]?.[category]?.map((card1: any) =>
          card1.id === cardId
            ? {
              ...card1,
              steps: card1?.steps?.map((step: any) =>
                step.step_id === stepId && !step.skipped
                  ? { ...step, completed: !step.completed }
                  : step
              ),
            }
            : card1
        ),
      },
    }));
  };

  useEffect(() => {
    setCurrentSubTabs(getSubTabsForTab(activeTab));
    setActiveSubTab(getSubTabsForTab(activeTab)[0]?.id);
  }, [activeTab]);

  useEffect(() => {
    if (activeSubTab) {
      setActiveCards((prev: any) => {
        if (prev[activeSubTab]) {
          return prev; // already exists → do nothing
        }

        return {
          ...prev,
          [activeSubTab]: getCardsForSubTab(activeSubTab),
        };
      });
    }
  }, [activeSubTab])

  const getProgressPercentage = (steps: ActionStep[]) => {
    const completedCount = steps?.filter(step => step.completed && !step.skipped).length;
    const totalSteps = steps?.length;
    return totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;
  };

  const toggleSkip = (cardId: number, stepId: number, categoryKey: any) => {
    setActiveCards((prev: any) => ({
      ...prev,
      [activeSubTab]: {
        ...prev[activeSubTab],
        [categoryKey]: prev[activeSubTab]?.[categoryKey]?.map((card1: any) =>
          card1.id === cardId
            ? {
              ...card1,
              steps: card1?.steps?.map((step: any) =>
                step.step_id === stepId
                  ? { ...step, skipped: !step.skipped, completed: !step.skipped ? false : step.completed }
                  : step
              ),
            }
            : card1
        ),
      },
    }));
  };

  const openNote = (cardId: number, stepId: number, currentNote: string) => {
    setActiveNoteId({ cardId, stepId });
    setTempNote(currentNote);
  };

  const saveNote = (category: any) => {
    if (activeNoteId) {

      setActiveCards((prev: any) => ({
        ...prev,
        [activeSubTab]: {
          ...prev[activeSubTab],
          [category]: prev[activeSubTab]?.[category]?.map((card1: any) =>
            card1.id === activeNoteId.cardId
              ? {
                ...card1,
                steps: card1.steps.map((step: any) =>
                  step.step_id === activeNoteId.stepId
                    ? { ...step, note: tempNote }
                    : step
                ),
              }
              : card1
          ),
        },
      }));
      setActiveNoteId(null);
      setTempNote("");
    }
  };

  const cancelNote = () => {
    setActiveNoteId(null);
    setTempNote("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F0F0F0]">
      {/* Header */}
      <header className="sticky top-0 h-16 bg-white border-b border-[#E5E5E5] flex items-center px-4 lg:px-8 z-50 shadow-sm">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 mr-4"
          aria-label="Toggle menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 12H21M3 6H21M3 18H21"
              stroke="#323743"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <Image
          src="/logo.svg"
          width={256}
          height={21}
          alt="The Kaleidoscope Project"
          className="h-5 w-auto"
        />
      </header>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Prevent scrolling of body when sidebar is open */}

      {sidebarOpen && (

        <style>{`
          body {
            overflow: hidden;
          }
        `}</style>

      )}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`sm:w-70 md:w-78 w-[80%] bg-white border-r border-[#E5E5E5] flex flex-col z-40 transition-transform duration-300 fixed sm:relative left-0 top-0 bottom-0 sm:bottom-auto h-screen sm:h-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
            }`}
        >
          {/* Scrollable content */}
          <div className="pb-32 flex-1 px-5 sm:px-4 py-6 pt-20 sm:pt-6 overflow-y-auto">
            {/* Budget Summary */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-[#323743] mb-2">
                Budget Summary
              </h2>
              <div className="relative rounded-xl bg-white py-4 px-5 ">
                <div style={{
                  border: '2.5px solid transparent',
                  backgroundImage: 'linear-gradient(#FFFFFF, #FFFFFF), linear-gradient(135deg, #8B5CF5 0%, #EF4444 50%, #05B5D4 75%, #0C9668 87.5%, #D68908 93.75%, #3B81F5 100%)',
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box, border-box',
                }} className="absolute inset-0 rounded-xl p-[2px]">
                  <div className="h-full w-full rounded-xl bg-white"></div>
                </div>

                <div className="relative z-10 ">
                  {selectedValues?.projectName &&
                    <div className="flex gap-0 flex-col pb-[5px] border-b mb-0">
                      <div className="text-sm text-[#6B7280]">Project Name</div>
                      <div className="text-[15px] font-semibold text-[#1C202C]">
                        {selectedValues?.projectName}
                      </div>
                    </div>
                  }

                  <div className="bg-[#D4D4D4] opacity-50 mb-[5px]" />
                  <div className="flex gap-0 flex-col pb-[5px] border-b mb-0">
                    <div className="text-sm text-[#6B7280]">Tech Type</div>
                    <div className="text-[15px] font-semibold text-[#1C202C]">
                      {selectedValues?.categoryName ? selectedValues?.categoryName : "None"}
                    </div>
                  </div>
                  <div className="bg-[#D4D4D4] opacity-50 mb-[5px]" />
                  <div className="flex gap-0 flex-col mb-0">
                    <div className="text-sm text-[#6B7280]">Budget</div>
                    <div className="text-xl font-bold text-[#323743] leading-[normal]">${selectedValues?.budget}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Allocation */}

            <div>
              <h2 className="text-lg font-semibold text-[#323743] mb-2">
                Allocation
              </h2>
              <div style={{
                border: '2.5px solid transparent',
                backgroundImage: 'linear-gradient(#FFFFFF, #FFFFFF), linear-gradient(135deg, #8B5CF5 0%, #EF4444 50%, #05B5D4 75%, #0C9668 87.5%, #D68908 93.75%, #3B81F5 100%)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
              }} className="rounded-xl bg-[#F9FAFB] p-3">
                <div className="relative w-42 h-42 mx-auto mb-6 mt-2">
                  <Doughnut
                    data={{
                      labels: tabs
                        ?.filter((t: objectType) => t.checked)
                        ?.map((chart: objectType) => chart.name),

                      datasets: [
                        {
                          data: tabs
                            ?.filter((t: objectType) => t.checked)
                            ?.map((chart: objectType) => Number(chart.percentage) || 0),

                          backgroundColor: tabs
                            ?.filter((t: objectType) => t.checked)
                            ?.map((chart: objectType) => chart.color),
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          display: false, //  removes top labels
                        },
                      },
                    }}
                  />


                </div>

                {/* <div className="relative w-42 h-42 mx-auto mb-6 mt-2">
                  <svg className="w-full h-full" viewBox="0 0 168 168">
                    <path
                      d="M152.254 35.0365C140.561 18.7378 123.423 7.16122 103.937 2.40037C84.4512 -2.36049 63.9051 0.00874235 46.0143 9.07957C28.1236 18.1504 14.0694 33.324 6.39356 51.8561C-1.28232 70.3882 -2.07312 91.0553 4.16416 110.12C10.4014 129.184 23.255 145.387 40.4003 155.799C57.5455 166.21 77.8505 170.143 97.6431 166.885C117.436 163.627 135.409 153.394 148.313 138.036C161.216 122.679 168.198 103.21 167.996 83.1526L144.477 83.3899C144.623 97.8316 139.596 111.849 130.305 122.906C121.014 133.964 108.074 141.331 93.823 143.677C79.5724 146.023 64.9528 143.191 52.6082 135.695C40.2636 128.199 31.009 116.533 26.5182 102.806C22.0273 89.0799 22.5967 74.1995 28.1234 60.8564C33.65 47.5133 43.769 36.5883 56.6503 30.0573C69.5316 23.5263 84.3249 21.8205 98.3546 25.2483C112.384 28.6761 124.724 37.0113 133.143 48.7463L152.254 35.0365Z"
                      fill="#895AF6"
                    />
                    <g clipPath="url(#clip0_727_388)">
                      <path
                        d="M27.7739 6.75562C35.4526 18.7671 39.9479 32.5352 40.8366 46.7637L17.3624 48.2298C16.7225 37.9854 13.4859 28.0723 7.95721 19.424L27.7739 6.75562Z"
                        fill="#3C83F6"
                        transform="translate(127 32)"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_727_388">
                        <rect
                          width="41"
                          height="58"
                          fill="white"
                          transform="translate(127 32)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div> */}

                <div className="space-y-0 border-t border-[#E5E7EB] pb-2">
                  {tabs?.filter((t: objectType) => t.checked === true)?.map((tb: objectType, ij: number) => {
                    const totalTabs = tabs?.filter((t: objectType) => t.checked === true).length;
                    return <div key={ij} className={`flex justify-between items-center py-2  ${Number(totalTabs) - 1 > ij ? "border-b" : ""} border-[#E5E7EB]`}>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{
                          background:
                            tb.color
                        }} />
                        <span className="text-sm font-medium" style={{
                          color:
                            tb.color
                        }}>
                          {tb?.name}
                        </span>
                      </div>
                      <span className="text-[15px] font-medium text-[#323743]">
                        {tb?.percentage}%
                      </span>
                    </div>
                  }
                  )}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col w-full lg:w-auto overflow-x-hidden m-2 sm:m-5">
          {/* Category Tabs */}

          <nav ref={navRef} className="w-full bg-white flex items-end overflow-x-auto no-scrollbar">
            {tabs?.map((tab: any, index: any) => {
              const isActive = tab.id === activeTab;
              const textColor = tab.color;

              return (
                <button
                  key={tab.id}
                  ref={(el: any) => (tabRefs.current[index] = el)}
                  onClick={() => {
                    setActiveTab(tab.id);
                    scrollNextTabIfNeeded(navRef.current, tabRefs.current, index);
                    const childFirstTab = tabRefs2.current[0];
                    if (childFirstTab && navRef2.current) {
                      const nav = navRef2.current;
                      nav.scrollTo({
                        left: childFirstTab.offsetLeft, // scroll so first tab is visible
                        behavior: "smooth",
                      });
                    }
                  }}
                  className={`relative flex-1 flex-col px-4 py-[12px] justify-center items-center gap-1.5 transition-colors border-r border-[#EDEDED] flex-shrink-0 min-w-fit ${isActive
                    ? "bg-white border-0"
                    : "bg-[#FCFCFC] hover:bg-gray-50 border-b"
                    } ${index === 0 && !isActive ? "border-l" : ""}`}
                >
                  <div className="flex items-center gap-2 justify-center">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: tab.color }}
                      />
                      <span
                        className={`sm:text-base text-sm whitespace-nowrap ${isActive ? "font-semibold" : "font-medium"
                          }`}
                        style={{ color: textColor }}
                      >
                        {tab.name}
                      </span>
                    </div>
                    {tab.percentage !== undefined && (
                      <span className="text-sm font-medium text-[#323743]">
                        {tab.percentage}%
                      </span>
                    )}
                  </div>
                  {isActive && (
                    <div
                      className="absolute bottom-0 left-6 right-6 h-[3px]"
                      style={{ backgroundColor: tab.color }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
          {/* Sub-tabs */}
          <div ref={navRef2} className="bg-white px-4  w-full flex lg:flex-wrap items-center gap-2 py-5 overflow-x-auto no-scrollbar">
            {currentSubTabs?.map((subTab: any, ij: number) => {
              const isActiveSubTab = subTab.id === activeSubTab;
              return (
                <button
                  key={subTab.id}
                  ref={(el: any) => (tabRefs2.current[ij] = el)}
                  onClick={() => {
                    scrollNextTabIfNeeded(navRef2.current, tabRefs2.current, ij);
                    setActiveSubTab(subTab.id);
                  }}
                  className={`shrink-0 w-max inline-flex items-center gap-2 px-3 lg:py-1.5 py-2 rounded-lg whitespace-nowrap transition-colors ${isActiveSubTab
                    ? " text-white"
                    : "border border-[#918D8D] text-[#918D8D] hover:bg-gray-50"
                    }`}
                  style={{ background: isActiveSubTab ? tabs?.filter((p) => p.id == activeTab)[0]?.color : "" }}
                >
                  <span className="sm:text-base text-sm font-medium">{subTab.name}</span>
                  <span className="sm:text-base text-sm font-medium">{tabs.filter((mt: objectType) => { return mt.id == activeTab })[0]?.percentage > 0 ? Number.isInteger(subTab.percentage * 100)
                    ? subTab.percentage
                    : subTab.percentage.toFixed(1) : 0}%</span>

                </button>
              );
            })}

            { }
          </div><div className="h-px bg-[#E9E9E9]" />
          {/* Content Area */}
          <div className="flex-1 overflow-y-auto no-scrollbar bg-white p-5 pt-0 pb-32 sm:pb-28">
            {currentCards?.[activeSubTab] && Object.keys(currentCards?.[activeSubTab])?.length > 0 ?
              Object.entries(currentCards?.[activeSubTab])
                .map(([categoryKey, cards]: any) =>
                  <div key={categoryKey}>
                    {
                      (categoryKey == "skip"
                        ?
                        <div className="inline-flex items-center px-3 py-1.5 rounded-[20px] bg-[#EF4444] my-5">
                          <span className="text-sm font-normal text-white">Skip For Now ({cards?.length})</span>
                        </div> :
                        categoryKey == "must_have" ?
                          <div className="inline-flex items-center px-3 py-1.5 rounded-[20px] bg-[#10B981] my-5">
                            <span className="text-sm font-normal text-white">Must Have ({cards?.length})</span>
                          </div>

                          :
                          <div className="inline-flex items-center px-3 py-1.5 rounded-[20px] bg-[#F59E0B] my-5">
                            <span className="text-sm font-normal text-white">Should Have ({cards?.length})</span>
                          </div>)
                    }

                    {/* <span className="text-sm font-medium text-white"> {formatCategory(categoryKey)} ({cards?.length})</span> */}
                    {/* </div> */}
                    {/* Task Cards */}
                    <div className="flex flex-col gap-5">
                      {cards?.map((card: any, k: number) => {
                        const progressPercentage = getProgressPercentage(card?.steps);
                        const completedCount = card?.steps?.filter(
                          (step: objectType) => step.completed && !step.skipped
                        ).length;

                        return (
                          <div
                            key={k}
                            style={{
                              borderColor: tabs?.filter((p) => p.id == activeTab)[0]
                                ?.color,
                            }}
                            className={`rounded-xl bg-white transition-all duration-300 border-2 `}
                          >
                            {/* Card Header */}
                            <div className="lg:p-6 p-4 pb-7">
                              <div className={`flex justify-between items-start`}>
                                <div className="flex items-start gap-2.5 flex-1">
                                  <button onClick={() =>
                                    setActiveCards((prev: any) => ({
                                      ...prev,
                                      [activeSubTab]: {
                                        ...prev[activeSubTab],
                                        [categoryKey]: prev[activeSubTab]?.[categoryKey]?.map((card1: any) =>
                                          card1.id === card.id
                                            ? {
                                              ...card1,
                                              cardChecked: !card1.cardChecked,
                                            }
                                            : card1
                                        ),
                                      },
                                    }))


                                  } style={
                                    {
                                      background: card?.cardChecked ? tabs?.filter((p) => p.id == activeTab)[0]
                                        ?.color : "",
                                      '--ring-color': card?.cardChecked ? tabs?.filter((p) => p.id == activeTab)[0]
                                        ?.color : "",
                                      '--border-color': card?.cardChecked ? tabs?.filter((p) => p.id == activeTab)[0]
                                        ?.color : "",
                                    } as React.CSSProperties
                                  }

                                    className="lg:mt-[5px] mt-[4px] ring ring-[var(--border-color)] cursor-pointer w-3 h-3  flex-shrink-0 rounded-[1px] ring flex items-center justify-center hover:opacity-80 transition-colors" >
                                    {card?.cardChecked && (
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
                                  <div className="flex-1" role="button" onClick={() =>
                                    setActiveCards((prev: any) => ({
                                      ...prev,
                                      [activeSubTab]: {
                                        ...prev[activeSubTab],
                                        [categoryKey]: prev[activeSubTab]?.[categoryKey]?.map((card1: any) =>
                                          card1.id === card.id
                                            ? {
                                              ...card1,
                                              isExpanded: card?.isExpanded ? false : true,
                                            }
                                            : card1
                                        ),
                                      },
                                    }))

                                  }>
                                    <h3 className="sm:text-base text-sm lg:text-lg font-semibold text-[#323743] leading-[normal]">
                                      {card["Item Name"]}
                                    </h3>
                                    <div className="mt-1 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
                                      <span className="sm:text-base text-sm font-medium text-[#ADADAD]">
                                        {card["Cost Display"]}
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
                                        <span className="sm:text-base text-sm font-medium text-[#ADADAD]">
                                          {card["Time Weeks"]} week
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <button
                                  className="p-0 hover:opacity-70 transition-opacity flex-shrink-0"
                                  aria-label={card?.isExpanded ? "Collapse" : "Expand"}
                                  onClick={() =>
                                    setActiveCards((prev: any) => ({
                                      ...prev,
                                      [activeSubTab]: {
                                        ...prev[activeSubTab],
                                        [categoryKey]: prev[activeSubTab]?.[categoryKey]?.map((card1: any) =>
                                          card1.id === card.id
                                            ? {
                                              ...card1,
                                              isExpanded: card?.isExpanded ? false : true,
                                            }
                                            : card1
                                        ),
                                      },
                                    }))

                                  }
                                >
                                  <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`transition-transform duration-300 ${card?.isExpanded ? "" : "rotate-180"
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
                              {card?.steps?.length > 0 &&
                                <div className="mt-3">


                                  <div className="flex justify-between items-center mb-2.5">
                                    <span className="text-sm font-medium text-[#ADADAD]">
                                      Step {completedCount} of {card?.steps?.length}
                                    </span>
                                    <span className="text-sm font-medium text-[#ADADAD]">
                                      {Math.round(progressPercentage)}%
                                    </span>
                                  </div>
                                  <div className="h-1.5 bg-[#F0F0F0] rounded-[10px] overflow-hidden">
                                    <div
                                      className="h-full rounded-[10px] transition-all duration-300"
                                      style={{
                                        width: `${progressPercentage}%`, background: tabs?.filter((p) => p.id == activeTab)[0]
                                          ?.color
                                      }}
                                    />
                                  </div>



                                </div>
                              }
                            </div>

                            {/* Collapsible Content */}
                            <div
                              className={`overflow-hidden transition-all duration-300 ease-in-out ${card?.isExpanded
                                ? "max-h-[5000px] opacity-100"
                                : "max-h-0 opacity-0"
                                }`}
                            >
                              {/* Tabs */}
                              <div className="w-full flex items-center border-t border-b border-[#E5E5E5] px-5 overflow-x-auto no-scrollbar">


                                <button
                                  onClick={() => {
                                    setActiveCards((prev: any) => ({
                                      ...prev,
                                      [activeSubTab]: {
                                        ...prev[activeSubTab],
                                        [categoryKey]: prev[activeSubTab]?.[categoryKey]?.map((card1: any) =>
                                          card1.id === card.id
                                            ? {
                                              ...card1,
                                              activeCardTab: "action",
                                            }
                                            : card1
                                        ),
                                      },
                                    }));
                                  }
                                  }
                                  className={`relative flex-1 sm:flex-none sm:px-4 flex py-[12px] justify-center items-center gap-1.5 transition-colors flex-shrink-0 min-w-fit bg-white border-0  ${card?.activeCardTab === "action"
                                    ? "border-b-2"
                                    : "border-b-2 border-transparent"
                                    } `}

                                  style={{
                                    borderColor: card?.activeCardTab === "action" ? tabs?.filter((p) => p.id == activeTab)[0]
                                      ?.color : "",
                                  }}
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
                                      stroke={`${card?.activeCardTab === "action"
                                        ? tabs?.filter((p) => p.id == activeTab)[0]
                                          ?.color
                                        : "#323743"
                                        }`}
                                      strokeWidth="1.5"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M6.75 1.5V3.75M11.25 1.5V3.75M6 7.125H12M6 10.125H10.5M6 13.125H9"
                                      stroke={` ${card?.activeCardTab === "action"
                                        ? tabs?.filter((p) => p.id == activeTab)[0]
                                          ?.color
                                        : "#323743"
                                        }`}
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  <span className={`text-sm font-medium`}
                                    style={{
                                      color: card?.activeCardTab === "action" ? tabs?.filter((p) => p.id == activeTab)[0]
                                        ?.color : "#323743",
                                    }}
                                  >
                                    Action
                                  </span>
                                </button>
                                <button

                                  onClick={() => {

                                    setActiveCards((prev: any) => ({
                                      ...prev,
                                      [activeSubTab]: {
                                        ...prev[activeSubTab],
                                        [categoryKey]: prev[activeSubTab]?.[categoryKey]?.map((card1: any) =>
                                          card1.id === card.id
                                            ? {
                                              ...card1,
                                              activeCardTab: "context",
                                            }
                                            : card1
                                        ),
                                      },
                                    }))
                                  }

                                  }
                                  className={`relative flex-1 sm:flex-none flex sm:ml-0 sm:px-4 ml-4 py-[12px] justify-center items-center gap-1.5 transition-colors flex-shrink-0 min-w-fit bg-white border-0  ${card?.activeCardTab === "context"
                                    ? "border-b-2"
                                    : "border-b-2 border-transparent"
                                    } `}

                                  style={{
                                    borderColor: card?.activeCardTab === "context" ? tabs?.filter((p) => p.id == activeTab)[0]
                                      ?.color : "",
                                  }}
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
                                      stroke={` ${card?.activeCardTab === "context"
                                        ? tabs?.filter((p) => p.id == activeTab)[0]
                                          ?.color
                                        : "#323743"
                                        }`}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  <span className={`text-sm font-medium`}
                                    style={{
                                      color: card?.activeCardTab === "context" ? tabs?.filter((p) => p.id == activeTab)[0]
                                        ?.color : "#323743",
                                    }}
                                  >
                                    Context & Education
                                  </span>
                                </button>
                                <button

                                  onClick={() => {
                                    setActiveCards((prev: any) => ({
                                      ...prev,
                                      [activeSubTab]: {
                                        ...prev[activeSubTab],
                                        [categoryKey]: prev[activeSubTab]?.[categoryKey]?.map((card1: any) =>
                                          card1.id === card.id
                                            ? {
                                              ...card1,
                                              activeCardTab: "diligence",
                                            }
                                            : card1
                                        ),
                                      },
                                    }));
                                  }
                                  }
                                  className={`relative flex-1 sm:flex-none flex sm:px-4 sm:ml-0 ml-4 py-[12px] justify-center items-center gap-1.5 transition-colors flex-shrink-0 min-w-fit bg-white border-0  ${card?.activeCardTab === "diligence"
                                    ? "border-b-2"
                                    : "border-b-2 border-transparent"
                                    } `}

                                  style={{
                                    borderColor: card?.activeCardTab === "diligence" ? tabs?.filter((p) => p.id == activeTab)[0]
                                      ?.color : "",
                                  }}
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
                                      stroke={`${card?.activeCardTab === "diligence"
                                        ? tabs?.filter((p) => p.id == activeTab)[0]
                                          ?.color
                                        : "#323743"
                                        }`}
                                      strokeWidth="1.5"
                                    />
                                    <path
                                      d="M14.5184 7.91005C14.7674 9.17094 14.5772 10.4791 13.9793 11.6168C13.3814 12.7545 12.4119 13.6531 11.2322 14.1632C10.0524 14.6732 8.73364 14.7638 7.49523 14.42C6.25683 14.0762 5.17351 13.3186 4.42558 12.2734C3.67764 11.2282 3.31019 9.9584 3.38438 8.6753C3.45858 7.39219 3.96994 6.17319 4.83336 5.22116C5.69678 4.26913 6.8602 3.64149 8.12998 3.4427C9.39976 3.24391 10.6993 3.48595 11.8124 4.12855"
                                      stroke={`${card?.activeCardTab === "diligence"
                                        ? tabs?.filter((p) => p.id == activeTab)[0]
                                          ?.color
                                        : "#323743"
                                        }`}
                                      strokeWidth="0.75"
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                  <span className={`text-sm font-medium`}
                                    style={{
                                      color: card?.activeCardTab === "diligence" ? tabs?.filter((p) => p.id == activeTab)[0]
                                        ?.color : "#323743",
                                    }}
                                  >
                                    Diligence Tab
                                  </span>
                                </button>
                              </div>

                              {/* Tab Content */}
                              {card?.activeCardTab === "action" && (
                                <div className="px-5 py-7 flex flex-col gap-5">
                                  {/* Cost and Timeline */}
                                  <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-14">
                                    <div className="flex flex-col">
                                      <div className="text-sm font-medium text-[#6B7280] leading-6">
                                        Estimate Cost
                                      </div>
                                      <div className="sm:text-base text-sm font-medium text-[#323743]">
                                        {card["Cost Display"]}
                                      </div>
                                    </div>
                                    <div className="flex flex-col">
                                      <div className="text-sm font-medium text-[#6B7280] leading-6">
                                        Timeline
                                      </div>
                                      <div className="sm:text-base text-sm font-medium text-[#323743]">
                                        {card["Time Weeks"]} week
                                      </div>
                                    </div>
                                  </div>

                                  {/* Action Steps */}
                                  {card?.steps?.length > 0 &&
                                    <div className="flex flex-col gap-4">
                                      <h4 className="sm:text-base text-sm font-medium text-[#323743]">
                                        Action Steps
                                      </h4>
                                      <div className="flex flex-col gap-3">
                                        {card?.steps?.map((step: objectType, index: number) => (
                                          <React.Fragment key={`${step.step_id}_${index}`}>
                                            <div className="flex flex-col gap-2">
                                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                                <div className="flex items-start gap-2" role="button" onClick={() => {
                                                  toggleCheckbox(card.id, step.step_id, categoryKey)
                                                }

                                                }>
                                                  <button

                                                    disabled={step.skipped}
                                                    style={
                                                      {
                                                        background: step.completed ? tabs?.filter((p) => p.id == activeTab)[0]
                                                          ?.color : "",
                                                        '--ring-color': step.completed ? tabs?.filter((p) => p.id == activeTab)[0]
                                                          ?.color : "",
                                                        '--border-color': step.completed ? tabs?.filter((p) => p.id == activeTab)[0]
                                                          ?.color : "",
                                                      } as React.CSSProperties
                                                    }

                                                    className={`lg:mt-[8px] mt-[6px] flex justify-center cursor-pointer   w-2.5 h-2.5  flex-shrink-0 rounded-[1px] ring ring-[var(--border-color)] items-center  transition-colors ${step.skipped
                                                      ? "bg-[#F5F5F5] cursor-not-allowed"
                                                      : "bg-[#F9FAFB] hover:bg-gray-100"
                                                      }`}
                                                  >
                                                    {step.completed && (
                                                      <svg
                                                        width="8"
                                                        height="5"
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
                                                    className={`sm:text-base text-sm font-normal transition-all ${step.skipped
                                                      ? "line-through"
                                                      : "text-[#323743]"
                                                      }`}
                                                    style={{
                                                      color: step.skipped ? tabs?.filter((p) => p.id == activeTab)[0]
                                                        ?.color : "",
                                                    }}
                                                  >
                                                    {step.text}
                                                  </span>
                                                </div>
                                                <div className="flex items-center justify-end gap-2">
                                                  <button
                                                    onClick={() =>
                                                      toggleSkip(card.id, step.step_id, categoryKey)
                                                    }
                                                    style={{
                                                      backgroundColor: `${tabs?.filter((p) => p.id == activeTab)[0]
                                                        ?.color}52`,
                                                    }}
                                                    className="flex items-center justify-center gap-2.5 h-5 px-2 py-1.5 rounded-[10px] bg-[rgba(137,90,246,0.32)] hover:bg-[rgba(137,90,246,0.4)] transition-colors"
                                                  >
                                                    <span className="text-xs font-medium" style={{
                                                      color: tabs?.filter((p) => p.id == activeTab)[0]
                                                        ?.color,
                                                    }}>
                                                      {step.skipped ? "Include" : "Skip"}
                                                    </span>
                                                  </button>
                                                  <button
                                                    onClick={() =>
                                                      openNote(card.id, step.step_id, step.note)
                                                    }
                                                    style={{
                                                      backgroundColor: `${tabs?.filter((p) => p.id == activeTab)[0]
                                                        ?.color}52`,
                                                    }}
                                                    className="flex items-center justify-center gap-1 px-1.5 py-1 rounded-[10px] hover:bg-[rgba(137,90,246,0.4)] transition-colors"
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
                                                        fill={tabs?.filter((p) => p.id == activeTab)[0]
                                                          ?.color}
                                                      />
                                                    </svg>
                                                    <span className="text-xs font-medium"
                                                      style={{
                                                        color: tabs?.filter((p) => p.id == activeTab)[0]
                                                          ?.color,
                                                      }}
                                                    >
                                                      Note
                                                    </span>
                                                  </button>
                                                </div>
                                              </div>

                                              {/* Notes Section */}
                                              {activeNoteId?.cardId === card.id &&
                                                activeNoteId?.stepId === step.step_id && (
                                                  <div className="flex flex-col gap-2 mt-2">
                                                    <textarea
                                                      value={tempNote}
                                                      onChange={(e) =>
                                                        setTempNote(e.target.value)
                                                      }


                                                      style={
                                                        {
                                                          '--focus-border': tabs?.filter((p) => p.id == activeTab)[0]
                                                            ?.color,
                                                        } as React.CSSProperties
                                                      }
                                                      placeholder="Enter Notes"
                                                      className={`h-[100px] px-3 py-4 border border-[#C5C5C5] rounded-lg text-sm text-[#323743] placeholder:text-[#C5C5C5] focus:outline-none focus:border-[var(--focus-border)] resize-none`}
                                                    />
                                                    <div className="flex items-center gap-2">
                                                      <button
                                                        onClick={() => saveNote(categoryKey)}
                                                        style={{
                                                          background: tabs?.filter((p) => p.id == activeTab)[0]
                                                            ?.color
                                                        }}
                                                        className="px-4 py-1.5 text-[#fff] sm:text-base text-sm font-normal rounded-lg hover:bg-[#7a4dd6] transition-colors"
                                                      >
                                                        Save
                                                      </button>
                                                      <button
                                                        onClick={cancelNote}
                                                        style={{
                                                          background: tabs?.filter((p) => p.id == activeTab)[0]
                                                            ?.color
                                                        }}
                                                        className="px-4 py-1.5 border text-[#fff] sm:text-base text-sm font-normal rounded-lg hover:bg-[rgba(137,90,246,0.1)] transition-colors"
                                                      >
                                                        Cancel
                                                      </button>
                                                    </div>
                                                  </div>
                                                )}
                                            </div>
                                            {index < card?.steps?.length - 1 && (
                                              <div className="h-px bg-[#EAEAEA]" />
                                            )}
                                          </React.Fragment>
                                        ))}
                                      </div>
                                    </div>}
                                </div>
                              )}

                              {card?.activeCardTab === "context" && (
                                <div className="px-5 py-7 flex flex-col gap-5">
                                  <div className="flex flex-col gap-1">
                                    <div className="sm:text-lg text-sm font-medium text-[#323743]">Why This Matters:</div>
                                    <p className="text-sm sm:text-[15px] font-normal text-[#323743] leading-relaxed">
                                      {card["Why This Matters"]}
                                    </p>
                                  </div>
                                  <div className="flex sm:flex-row flex-col sm:w-[80%] gap-3">
                                    {card["Red Flags"] ?
                                      <div className="flex sm:w-[50%] md:w-[80%] p-3 rounded-md border-2 border-[#EF4444] bg-[#FDF4F4]">
                                        <div className="flex flex-col gap-2">
                                          <div className="sm:text-lg text-sm font-semibold text-[#EF4444]">Red Flags</div>
                                          <div className="flex flex-col gap-1">

                                            {card["Red Flags"]?.split("\\n").map((line: string) => line.replace("• ", "")).map((flag1: any, idx3: number) => (
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

                                    {card["Green Flags"] ?
                                      <div className="flex sm:w-[50%] md:w-[80%] p-3 rounded-md border-2 border-[#10B981] bg-[#F4FBF7]">
                                        <div className="flex flex-col gap-2">
                                          <div className="sm:text-lg text-sm font-semibold text-[#10B981]">Green Flags</div>
                                          <div className="flex flex-col gap-1">

                                            {card["Green Flags"]?.split("\\n").map((line: string) => line.replace("• ", "")).map((flag2: any, idx4: number) => (
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
                                </div>
                              )}
                              {card?.activeCardTab === "diligence" && (
                                <div className="px-5 py-7 flex flex-col gap-5">

                                  <div className="flex items-start gap-1.5">
                                    <div className="flex flex-col gap-1 w-full">
                                      <div className="sm:text-lg text-sm font-medium text-[#323743]">What To Look For:</div>
                                      <div className="flex flex-col gap-1">
                                        {card["What To Look For"]?.split("\\n").map((line: string) => line.replace("• ", "")).map((line: any, idx: number) => (
                                          <div key={idx} className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full flex-shrink-0 bg-black" ></div>
                                            <p className="text-xs sm:text-sm font-normal text-[#323743]">
                                              {line}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-1 w-full">
                                    <div className="sm:text-lg text-sm font-medium text-[#323743]">Common Due Diligence Questions</div>
                                    <div className="flex flex-col gap-1">

                                      {card["Due Diligence Questions"]?.split("\\n").map((line: string) => line.replace("• ", "")).map((line2: any, idx2: number) => (
                                        <div key={idx2} className="flex items-center gap-1.5">
                                          <p className="text-xs sm:text-sm font-normal text-[#323743]">
                                            {line2}
                                          </p>
                                        </div>
                                      ))}


                                    </div>
                                  </div>
                                  {card["Investment Recommendation"] ?
                                    <div className="p-3 rounded" style={{
                                      backgroundColor: `${tabs?.filter((p) => p.id == activeTab)[0]
                                        ?.color}1A`,
                                    }}>
                                      <p className="sm:text-sm text-xs text-[#111827] leading-relaxed">
                                        <span className="font-bold text-[#8B5CF6]" style={{
                                          color: `${tabs?.filter((p) => p.id == activeTab)[0]
                                            ?.color}`,
                                        }}>Recommendation:</span>{' '}
                                        {card["Investment Recommendation"]}                </p>
                                    </div> : ""}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )
              :
              <div className="py-5 px-6 flex flex-col items-center justify-center">
                {/* Illustration */}
                <div className="mb-10 opacity-80">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/c3a4c1abed61c9cb562422fc7ec26fc93f2c0325?width=596"
                    alt="No budget allocated illustration"
                    className="w-64 h-64 sm:w-72 sm:h-72 object-contain"
                  />
                </div>
                {/* Title */}
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-4">
                  No Budget Allocated to {tabs?.filter((t: any) => t.id == activeTab)[0]?.layers?.filter((l: any) => l.id == activeSubTab)[0]?.name}
                </h1>

                {/* Description */}
                <p className="sm:text-base text-sm text-gray-600 text-center max-w-md leading-6 mb-8">
                  You haven't allocated any budget to this Layer. Without
                  investment here, you may be at risk of gaps in your responsible
                  tech strategy.
                </p>

                {/* Action Button */}
                <button onClick={() => redirect(`/calculator?project=${project}&step=2`)} className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold sm:text-base text-sm rounded-lg transition-colors">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.16667 15.8333H5.35417L13.5 7.6875L12.3125 6.5L4.16667 14.6458V15.8333ZM3.33333 17.5C3.09722 17.5 2.89944 17.42 2.74 17.26C2.58056 17.1 2.50056 16.9022 2.5 16.6667V14.6458C2.5 14.4236 2.54167 14.2117 2.625 14.01C2.70833 13.8083 2.82639 13.6314 2.97917 13.4792L13.5 2.97917C13.6667 2.82639 13.8508 2.70833 14.0525 2.625C14.2542 2.54167 14.4658 2.5 14.6875 2.5C14.9092 2.5 15.1244 2.54167 15.3333 2.625C15.5422 2.70833 15.7228 2.83333 15.875 3L17.0208 4.16667C17.1875 4.31944 17.3089 4.5 17.385 4.70833C17.4611 4.91667 17.4994 5.125 17.5 5.33333C17.5 5.55556 17.4617 5.7675 17.385 5.96917C17.3083 6.17083 17.1869 6.35472 17.0208 6.52083L6.52083 17.0208C6.36806 17.1736 6.19083 17.2917 5.98917 17.375C5.7875 17.4583 5.57583 17.5 5.35417 17.5H3.33333ZM12.8958 7.10417L12.3125 6.5L13.5 7.6875L12.8958 7.10417Z"
                      fill="white"
                    />
                  </svg>
                  Edit Budget Allocation
                </button>
              </div>
            }
          </div>
          <SaveProgressModal isOpen={saveProgressModal.isOpen} onClose={saveProgressModal.closeModal} />
          <DownloadReportModal isOpen={downloadReportModal.isOpen} onClose={downloadReportModal.closeModal} />
          <DownloadReportCSVModal isOpen={downloadCSVModal.isOpen} onClose={downloadCSVModal.closeModal} />
        </main>
      </div>
      {/* Sticky Action Buttons */}
      <div className="fixed z-90 w-full left-0 right-0 bottom-0 bg-white border-t border-[#E5E5E5] p-2 sm:p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5 sm:items-center sm:justify-between">
          <div className="flex gap-2 sm:gap-2.5">
            <button onClick={() => redirect(`/calculator?project=${project}`)} className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-2 sm:px-3 py-2 border border-[#E5E7EB] bg-[#F9FAFB] rounded-lg sm:rounded-xl hover:bg-gray-100 transition-colors">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.16667 15.8333H5.35417L13.5 7.6875L12.3125 6.5L4.16667 14.6458V15.8333ZM3.33333 17.5C3.09722 17.5 2.89944 17.42 2.74 17.26C2.58056 17.1 2.50056 16.9022 2.5 16.6667V14.6458C2.5 14.4236 2.54167 14.2117 2.625 14.01C2.70833 13.8083 2.82639 13.6314 2.97917 13.4792L13.5 2.97917C13.6667 2.82639 13.8508 2.70833 14.0525 2.625C14.2542 2.54167 14.4658 2.5 14.6875 2.5C14.9092 2.5 15.1244 2.54167 15.3333 2.625C15.5422 2.70833 15.7228 2.83333 15.875 3L17.0208 4.16667C17.1875 4.31944 17.3089 4.5 17.385 4.70833C17.4611 4.91667 17.4994 5.125 17.5 5.33333C17.5 5.55556 17.4617 5.7675 17.385 5.96917C17.3083 6.17083 17.1869 6.35472 17.0208 6.52083L6.52083 17.0208C6.36806 17.1736 6.19083 17.2917 5.98917 17.375C5.7875 17.4583 5.57583 17.5 5.35417 17.5H3.33333ZM12.8958 7.10417L12.3125 6.5L13.5 7.6875L12.8958 7.10417Z"
                  fill="#3B82F6"
                />
              </svg>
              <span className="text-sm sm:text-base font-semibold text-[#3B82F6]">Edit</span>
            </button>
            <button onClick={saveProgressModal.openModal} className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-2 sm:px-3 py-2 border border-[#E5E7EB] bg-[#F9FAFB] rounded-lg sm:rounded-xl hover:bg-gray-100 transition-colors">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.5391 17.5V13.5292C13.5388 13.355 13.5043 13.1826 13.4374 13.0219C13.3705 12.8611 13.2726 12.7151 13.1492 12.5922C13.0258 12.4693 12.8795 12.3719 12.7184 12.3056C12.5574 12.2393 12.3849 12.2054 12.2107 12.2058H7.78406C7.60992 12.2054 7.4374 12.2393 7.27637 12.3056C7.11534 12.3719 6.96895 12.4693 6.84558 12.5922C6.72221 12.7151 6.62428 12.8611 6.55739 13.0219C6.49049 13.1826 6.45595 13.355 6.45573 13.5292V17.5M13.5391 2.73751V4.70584C13.5388 4.87998 13.5043 5.05237 13.4374 5.21316C13.3705 5.37394 13.2726 5.51996 13.1492 5.64286C13.0258 5.76577 12.8795 5.86315 12.7184 5.92943C12.5574 5.99572 12.3849 6.02961 12.2107 6.02918H7.78406C7.60992 6.02961 7.4374 5.99572 7.27637 5.92943C7.11534 5.86315 6.96895 5.76577 6.84558 5.64286C6.72221 5.51996 6.62428 5.37394 6.55739 5.21316C6.49049 5.05237 6.45595 4.87998 6.45573 4.70584V2.50001M13.5391 2.73751C13.1935 2.58099 12.8184 2.50003 12.4391 2.50001H6.45573M13.5391 2.73751C13.8257 2.86751 14.0899 3.04918 14.3174 3.27501L16.3024 5.25417C16.5489 5.49944 16.7445 5.79096 16.8781 6.112C17.0116 6.43304 17.0805 6.77729 17.0807 7.12501V14.8517C17.0805 15.2 17.0116 15.5449 16.878 15.8666C16.7443 16.1883 16.5486 16.4805 16.3019 16.7265C16.0552 16.9725 15.7625 17.1674 15.4404 17.3001C15.1183 17.4329 14.7732 17.5008 14.4249 17.5H5.57073C5.22238 17.5009 4.87727 17.4331 4.55515 17.3004C4.23303 17.1678 3.94022 16.973 3.69347 16.7271C3.44672 16.4812 3.25087 16.1891 3.11714 15.8674C2.9834 15.5457 2.91439 15.2009 2.91406 14.8525V5.14668C2.9145 4.79839 2.98359 4.45361 3.11737 4.13205C3.25116 3.81048 3.44703 3.51845 3.69376 3.27264C3.9405 3.02683 4.23328 2.83207 4.55534 2.69949C4.87741 2.56692 5.22245 2.49913 5.57073 2.50001H6.45573"
                  stroke="#3B82F6"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-sm sm:text-base font-semibold text-[#3B82F6]">Save</span>
            </button>
          </div>
          <div className="flex gap-2 sm:gap-2.5">
            <button onClick={downloadReportModal.openModal} className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-2 sm:px-3 py-2 bg-[#3B82F6] rounded-lg hover:bg-[#2563EB] transition-colors">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.6905 10.9697C11.82 10.8661 11.9854 10.8183 12.1502 10.8366C12.315 10.855 12.4657 10.9381 12.5693 11.0676C12.6728 11.1971 12.7207 11.3624 12.7023 11.5272C12.684 11.692 12.6009 11.8428 12.4714 11.9463L10.393 13.6088C10.2817 13.6997 10.1425 13.7494 9.99886 13.7497H9.9922C9.85112 13.7486 9.71455 13.6999 9.6047 13.6113L7.52386 11.9463C7.39435 11.8428 7.31127 11.692 7.29291 11.5272C7.27455 11.3624 7.3224 11.1971 7.42595 11.0676C7.52949 10.9381 7.68024 10.855 7.84504 10.8366C8.00984 10.8183 8.17518 10.8661 8.3047 10.9697L9.3722 11.8247V8.95801C9.3722 8.79225 9.43805 8.63328 9.55526 8.51607C9.67247 8.39886 9.83144 8.33301 9.9972 8.33301C10.163 8.33301 10.3219 8.39886 10.4391 8.51607C10.5563 8.63328 10.6222 8.79225 10.6222 8.95801V11.8247L11.6905 10.9697Z"
                  fill="white"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.83073 1.875C5.22294 1.875 4.64005 2.11644 4.21028 2.54621C3.78051 2.97598 3.53906 3.55888 3.53906 4.16667V15.8333C3.53906 16.4411 3.78051 17.024 4.21028 17.4538C4.64005 17.8836 5.22294 18.125 5.83073 18.125H14.1641C14.7718 18.125 15.3547 17.8836 15.7845 17.4538C16.2143 17.024 16.4557 16.4411 16.4557 15.8333V6.83167C16.4557 6.52672 16.3601 6.22945 16.1824 5.98167L13.6707 2.48333C13.5358 2.29522 13.358 2.14194 13.1521 2.03616C12.9462 1.93038 12.7181 1.87513 12.4866 1.875H5.83073ZM4.78906 4.16667C4.78906 3.59167 5.25573 3.125 5.83073 3.125H11.8724V6.78917C11.8724 7.13417 12.1524 7.41417 12.4974 7.41417H15.2057V15.8333C15.2057 16.4083 14.7391 16.875 14.1641 16.875H5.83073C5.25573 16.875 4.78906 16.4083 4.78906 15.8333V4.16667Z"
                  fill="white"
                />
              </svg>
              <span className="text-sm sm:text-base font-semibold text-white">Download PDF</span>
            </button>
            <button onClick={downloadCSVModal.openModal} className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-2 sm:px-3 py-2 bg-[#3B82F6] rounded-lg hover:bg-[#2563EB] transition-colors">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.6905 10.9697C11.82 10.8661 11.9854 10.8183 12.1502 10.8366C12.315 10.855 12.4657 10.9381 12.5693 11.0676C12.6728 11.1971 12.7207 11.3624 12.7023 11.5272C12.684 11.692 12.6009 11.8428 12.4714 11.9463L10.393 13.6088C10.2817 13.6997 10.1425 13.7494 9.99886 13.7497H9.9922C9.85112 13.7486 9.71455 13.6999 9.6047 13.6113L7.52386 11.9463C7.39435 11.8428 7.31127 11.692 7.29291 11.5272C7.27455 11.3624 7.3224 11.1971 7.42595 11.0676C7.52949 10.9381 7.68024 10.855 7.84504 10.8366C8.00984 10.8183 8.17518 10.8661 8.3047 10.9697L9.3722 11.8247V8.95801C9.3722 8.79225 9.43805 8.63328 9.55526 8.51607C9.67247 8.39886 9.83144 8.33301 9.9972 8.33301C10.163 8.33301 10.3219 8.39886 10.4391 8.51607C10.5563 8.63328 10.6222 8.79225 10.6222 8.95801V11.8247L11.6905 10.9697Z"
                  fill="white"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.83073 1.875C5.22294 1.875 4.64005 2.11644 4.21028 2.54621C3.78051 2.97598 3.53906 3.55888 3.53906 4.16667V15.8333C3.53906 16.4411 3.78051 17.024 4.21028 17.4538C4.64005 17.8836 5.22294 18.125 5.83073 18.125H14.1641C14.7718 18.125 15.3547 17.8836 15.7845 17.4538C16.2143 17.024 16.4557 16.4411 16.4557 15.8333V6.83167C16.4557 6.52672 16.3601 6.22945 16.1824 5.98167L13.6707 2.48333C13.5358 2.29522 13.358 2.14194 13.1521 2.03616C12.9462 1.93038 12.7181 1.87513 12.4866 1.875H5.83073ZM4.78906 4.16667C4.78906 3.59167 5.25573 3.125 5.83073 3.125H11.8724V6.78917C11.8724 7.13417 12.1524 7.41417 12.4974 7.41417H15.2057V15.8333C15.2057 16.4083 14.7391 16.875 14.1641 16.875H5.83073C5.25573 16.875 4.78906 16.4083 4.78906 15.8333V4.16667Z"
                  fill="white"
                />
              </svg>
              <span className="text-sm sm:text-base font-semibold text-white">Download CSV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
