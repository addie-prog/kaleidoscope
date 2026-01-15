'use client';

import { useEffect, useState } from 'react';
import ToastModal from '../CustomToast';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type props = {
  onNext: (value: number) => void;
  selectedValues: any,
  Principles: PrincipleProps[],
  ResetPrinciples: PrincipleProps[],
  reportData: (value: Array<any>) => void
  userNotes: (value: string) => void
  updatedPrinciples: (value: Array<any>) => void
  project: any
}

type PrincipleProps = {
  id: string;
  name: string;
  description: string;
  color: string;
  bgcolor: string;
  percentage: number;
  checked: boolean;
  layersVisible: boolean;
  budget: number;
  layersAllocated: boolean;
  layers: any[];
}

export default function AllocatePage({ onNext, selectedValues, Principles, reportData, userNotes, updatedPrinciples, ResetPrinciples, project }: props) {
  const totalBudget = selectedValues.budget;
  const [principles, setPrinciples] = useState<PrincipleProps[]>(selectedValues?.principles?.length > 0 ? selectedValues?.principles : Principles);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const router = useRouter();
  const [error, setError] = useState("");

  const togglePrincipleChecked = (principleId: string) => {
    setPrinciples((prev) =>
      prev.map((p) =>
        p.id === principleId ? { ...p, checked: !p.checked, percentage: !p.checked == false ? 0 : p.percentage } : p
      )
    );
  };

  const toggleLayersVisible = (principleId: string) => {
    setPrinciples((prev) =>
      prev.map((p) =>
        p.id === principleId ? { ...p, layersVisible: !p.layersVisible } : p
      )
    );
  };

  const toggleLayer = (principleId: string, layerId: string) => {
    setPrinciples((prev) =>
      prev.map((p) =>
        p.id === principleId
          ? {
            ...p,
            layers: p.layers.map((layer) =>
              layer.id === layerId ? { ...layer, checked: !layer.checked, percentage: !layer.checked == false ? 0 : layer.percentage } : layer
            ),
          }
          : p
      )
    );
  };

  const handlePrincipleSlider = (principleId: string, value: number) => {
    const clampedValue = Math.min(Math.max(value, 0), 100); // principle percentage
    setPrinciples((prev) =>
      prev.map((p) => {
        if (p.id !== principleId) return p;

        const numLayers = p.layers.length;
        if (numLayers === 0) return p;

        // Each layer gets an equal share of 100% (relative to principle)
        const layerPercentage = 100 / numLayers;
        const layerBudget = p.budget / numLayers;

        return {
          ...p,
          percentage: clampedValue,
          budget: clampedValue === 0 ? 0 : p.budget,
          layers: p.layers.map((layer) => ({
            ...layer,
            checked: !p.layersAllocated ? clampedValue > 0 : layer.checked,
            percentage: !p.layersAllocated ? (clampedValue === 0 ? 0 : layerPercentage) : layer.percentage,
            budget: !p.layersAllocated ? (clampedValue === 0 ? 0 : layerBudget) : layer.budget,
          })),
        };
      })
    );
  };


  const handleLayerSlider = (principleId: string, layerId: string, value: number) => {
    setPrinciples((prev) =>
      prev.map((p) =>
        p.id === principleId
          ? {
            ...p,
            layersAllocated: true,
            layers: p.layers.map((layer) =>
              layer.id === layerId
                ? { ...layer, percentage: Math.min(Math.max(value, 0), 100) }
                : layer
            ),
          }
          : p
      )
    );
  };

  const getPrincipalDollarAmount = (principleId: string) => {
    const principle = principles?.find((p) => p.id === principleId);
    if (!principle) return '0';
    const amount = (principle.percentage / 100 * Number(totalBudget.replace(/,/g, ""))).toLocaleString("en-US", { maximumFractionDigits: 1 });
    return amount;
  };

  const getLayerDollarAmount = (layer: any, principleId: string) => {
    if (!layer) return '0';
    const amount = (layer.percentage / 100 * Number(principles?.find((p) => p.id === principleId)?.budget)).toLocaleString("en-US", { maximumFractionDigits: 1 });
    return amount;
  };




  useEffect(() => {
    const total = Number(totalBudget.replace(/,/g, ""));

    setPrinciples((prev) =>
      prev.map((p) => {
        const principleBudget = (p.percentage / 100) * total;

        const updatedLayers = p.layers?.map((l: any) => ({
          ...l,
          budget: Math.round((l.percentage / 100) * principleBudget),
        }));

        return {
          ...p,
          budget: principleBudget,
          layers: updatedLayers,
        };
      })
    );
  }, [
    totalBudget,
    principles?.map((p) => p.percentage).join(),
    principles?.map((p) =>
      p.layers?.map((l) => l.percentage).join()
    ).join(),
  ]);



  const calculateRemaining = () => {

    const totalAllocated = principles?.reduce((sum, p) => sum + p.percentage, 0);
    let allocated = 100 - totalAllocated;
    if (allocated < 0) {
      allocated = totalAllocated;
    }
    return allocated;
  };


  const calculateDollarAmount = (percentage: number) => {
    const amount = (percentage / 100) * Number(totalBudget.replace(/,/g, ""));
    return amount.toLocaleString("en-US", { maximumFractionDigits: 1 });
  };

  const calculateRemainingL = (principleId: string) => {
    const principle = principles?.find((p) => p.id === principleId);
    if (!principle) return 0;

    const totalAllocated = principle.layers.reduce(
      (sum, l) => sum + l.percentage,
      0
    );
    let remaining = 100 - totalAllocated;
    if (remaining < 0) {
      remaining = totalAllocated;
    }

    return remaining;
  };
  const getTotalPrinciplesPercentage = (principles: any[]) => {
    const percentage = principles?.reduce((sum, p) => sum + p.percentage, 0);

    return percentage;

  };

  const getCheckedPrinciples = (principles: any[]) => {
    const checkedP = principles?.filter((p) => p.checked && p.percentage == 0);

    return checkedP;

  };
  const areAllLayersValid = (principles: any[], totalBudget: number) => {
    return principles?.every((p) => {

      const shouldValidateLayers =
        p.budget === totalBudget || p.percentage > 0;

      if (shouldValidateLayers) {
        const layersTotal = p.layers.reduce(
          (sum: number, l: any) => sum + l.percentage,
          0
        );

        return layersTotal === 100;
      }

      return true;
    });
  };

  const calculateDollarAmountL = (
    percentage: number,
    principleBudget: number
  ) => {
    const amount = (percentage / 100) * principleBudget;

    return amount.toLocaleString("en-US", {
      maximumFractionDigits: 1,
    });
  };

  const remainingPercentage = calculateRemaining();
  const remainingDollars = calculateDollarAmount(remainingPercentage);

  const shouldShowSuccessMessage = (principles: any[]) => {
    const principlesTotal = getTotalPrinciplesPercentage(principles);
    const layersValid = areAllLayersValid(principles, Number(totalBudget.replace(/,/g, "")));

    return principlesTotal === 100 && layersValid && getCheckedPrinciples(principles)?.length == 0;
  };

  const ValidationIcon = () => {
    return <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.50056 14.3571C9.25902 14.3571 9.02738 14.2612 8.85659 14.0904C8.68579 13.9196 8.58984 13.688 8.58984 13.4464V9.19642C8.58984 8.95488 8.68579 8.72324 8.85659 8.55245C9.02738 8.38166 9.25902 8.28571 9.50056 8.28571C9.74209 8.28571 9.97374 8.38166 10.1445 8.55245C10.3153 8.72324 10.4113 8.95488 10.4113 9.19642V13.4464C10.4113 13.688 10.3153 13.9196 10.1445 14.0904C9.97374 14.2612 9.74209 14.3571 9.50056 14.3571Z" fill="#EF4444" />
      <path d="M8.28516 5.85714C8.28516 5.53509 8.41309 5.22623 8.64081 4.99851C8.86854 4.77079 9.17739 4.64285 9.49944 4.64285C9.82149 4.64285 10.1303 4.77079 10.3581 4.99851C10.5858 5.22623 10.7137 5.53509 10.7137 5.85714C10.7137 6.17919 10.5858 6.48804 10.3581 6.71577C10.1303 6.94349 9.82149 7.07142 9.49944 7.07142C9.17739 7.07142 8.86854 6.94349 8.64081 6.71577C8.41309 6.48804 8.28516 6.17919 8.28516 5.85714Z" fill="#EF4444" />
      <path fillRule="evenodd" clipRule="evenodd" d="M19 9.5C19 10.7476 18.7543 11.9829 18.2769 13.1355C17.7994 14.2881 17.0997 15.3354 16.2175 16.2175C15.3354 17.0997 14.2881 17.7994 13.1355 18.2769C11.9829 18.7543 10.7476 19 9.5 19C8.25244 19 7.0171 18.7543 5.86451 18.2769C4.71191 17.7994 3.66464 17.0997 2.78249 16.2175C1.90033 15.3354 1.20056 14.2881 0.723145 13.1355C0.245725 11.9829 -1.85901e-08 10.7476 0 9.5C3.75443e-08 6.98044 1.00089 4.56408 2.78249 2.78249C4.56408 1.00089 6.98044 0 9.5 0C12.0196 0 14.4359 1.00089 16.2175 2.78249C17.9991 4.56408 19 6.98044 19 9.5ZM16.9643 9.5C16.9643 11.4797 16.1779 13.3782 14.778 14.778C13.3782 16.1779 11.4797 16.9643 9.5 16.9643C7.52035 16.9643 5.62178 16.1779 4.22195 14.778C2.82213 13.3782 2.03571 11.4797 2.03571 9.5C2.03571 7.52035 2.82213 5.62178 4.22195 4.22195C5.62178 2.82213 7.52035 2.03571 9.5 2.03571C11.4797 2.03571 13.3782 2.82213 14.778 4.22195C16.1779 5.62178 16.9643 7.52035 16.9643 9.5Z" fill="#EF4444" />
    </svg>
  }

  const createProject = async () => {
    
    const existProjectId = project ? project : "";
    const projectId = `${Math.floor(Date.now() / 1000)}_${crypto.randomUUID().slice(0, 3)}`;
    const res = await fetch("/api/user-session/store-project", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        reportId: localStorage.getItem("reportId")?.split(",").pop(),
        sessionId: localStorage.getItem("sessionId"),
        Allocations: principles
        ?.filter(pf => pf.checked)
        ?.reduce((acc: any, p) => {
          acc[p.name] = p.budget;
          return acc;
        }, {}),
        budgetInputs: {
          "Stage": selectedValues?.stage,
          "Total cash": Number(selectedValues.budget.replace(/,/g, "")),
          "Vertical": selectedValues?.categoryName ? selectedValues?.categoryName : "None"
        },
        email: null,
        projectId: existProjectId ? "" : projectId,
        existProjectId
      })
    });
    try{
      const {id} = await res.json();
      localStorage.setItem("selectedValues",JSON.stringify(selectedValues));
      localStorage.setItem("principles",JSON.stringify(principles));
      router.push(`/dashboard?project=${id}`);
    }catch(e){
      console.log("Error in create/edit project: ",e);
    }
    setLoader(false);
  }

  const createInteraction = async (newReportData: any) => {

    const res = await fetch("/api/user-session/store-interaction", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        reportName: [localStorage
          .getItem("reportId")
          ?.split(",")
          .pop()],
        itemName: newReportData?.map((item: any) => item?.itemRecordId),
        interactionStatus: "Added to Budget",
        userNotes: selectedValues?.notes ?? "",
        allocatedCost: newReportData?.map((item1: any) => item1?.layerBudget)
      })
    });
    const data = await res.json();
    createProject();

  }

  const categoryOrder: Record<string, number> = {
    must_have: 1,
    should_have: 2,
    skip: 3,
  };

  const generateReport = async () => {
    const tiers = localStorage.getItem("Tiers");
    const budgetTiers = tiers ? JSON.parse(tiers) : [];
    let data: any;

    const layersWithTier =
      principles
        ?.filter(pf => pf.checked)
        ?.flatMap(p =>
          p.layers
            ?.filter(lf => lf.checked)
            ?.map(layer => {
              const layerBudget = Number(layer.budget || 0);

              const matchedTier = budgetTiers.find(
                (tier: any) =>
                  layerBudget >= Number(tier["Budget Min"]) &&
                  layerBudget <= Number(tier["Budget Max"])
              )?.["Tier ID"];

              return {
                layerId: layer.id,
                budgetTier: matchedTier
              };
            })
        );
    setLoader(true);
    const res = await fetch("/api/items", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        layers: layersWithTier,
        category: selectedValues?.category,

      })
    });

    try {
      data = await res.json();
    } catch (e: any) {
      console.log("Error in fetching items: ", e);
    }

    const newReportData: any[] = [];

    const items = data.data;
    principles?.filter((pf) => pf.checked === true)?.map((p) => {
      p.layers.filter((lf) => lf.checked === true).map((layer) => {

        const layerBudget = Number(layer.budget || 0);

        const matchedTier = budgetTiers.find(
          (tier: any) =>
            layerBudget >= Number(tier["Budget Min"]) &&
            layerBudget <= Number(tier["Budget Max"])
        )?.["Tier ID"];

        let matching =
          items
            ?.filter((item: any) => {
              const fields = item;

              return (
                Number(fields["Cost Min"]) <= layerBudget &&
                Number(fields["Cost Max"]) >= layerBudget
              );
            })
            ?.sort((a: any, b: any) => {
              const ca = categoryOrder[a.Category] ?? Infinity;
              const cb = categoryOrder[b.Category] ?? Infinity;

              if (ca !== cb) return ca - cb;

              const pa = a.Priority ?? Infinity;
              const pb = b.Priority ?? Infinity;

              return Number(pa) - Number(pb);
            }) ?? [];


        if (matching?.length == 0 || layerBudget >= 2000000) {
          matching = items?.filter((item: any) => {
            const fields = item;

            return (
              fields["Budget Tier"] == matchedTier
            );
          }).sort((a: any, b: any) => {
            const ca = categoryOrder[a.Category] ?? Infinity;
            const cb = categoryOrder[b.Category] ?? Infinity;

            if (ca !== cb) {
              return ca - cb; // category first
            }

            const pa = a.Priority ?? Infinity;
            const pb = b.Priority ?? Infinity;

            return Number(pa) - Number(pb); // then priority
          }) ?? [];
        }

        newReportData.push({
          principleId: p.id,
          principlePercentage: p.percentage,
          principleBudget: p.budget,
          principleName: p.name,
          principleColor: p.color,
          principleDes: p.description,
          layerName: p.layers.filter((lf) => lf.checked === true).map((l) => l.name),
          layerId: p.layers.filter((lf) => lf.checked === true).map((l) => l.id),
          layerBudget,
          itemRecordId: matching?.length > 0 ? matching.map((m: any) => m.id) : [],
          items: matching?.length ? matching : [],
        });
      });
    });
    userNotes(selectedValues?.notes);
    reportData(newReportData); 
    createInteraction(newReportData);
  }

  useEffect(() => {
    updatedPrinciples(principles);
  }, [principles])

  return (
    <>

      <div className='w-full flex justify-end sm:px-15 px-[16px] pt-10'>
        <button className="sm:px-10 px-6 cursor-pointer flex items-center gap-[5px] text-white border-2 bg-[#3B82F6] px-5 sm:py-3 py-2 rounded-lg text-center" 
        onClick={() => { setPrinciples(ResetPrinciples), userNotes("")  }}>
          <span>Reset</span>
        </button>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 lg:px-8 pb-8 sm:pb-12 lg:pb-16">
        <div className='w-fit flex gap-1 ' onClick={() => onNext(1)}>
          <div className="flex gap-1 cursor-pointer mb-4" onClick={() => onNext(1)}><Image src="/arrow-left.svg" width={18} height={18} alt='icon' className="sm:w-[18px] w-[14px]" />
            <span>Edit</span></div>

        </div>
        {/* Title Section */}
        <ToastModal
          open={showToast}
          message={error}
          onClose={() => setShowToast(false)}
        />
        <div className="mb-8 text-center">
          <h1 className="text-xl sm:text-[45px] font-bold text-gray-900 mb-4 tracking-tight">
            ALLOCATE YOUR BUDGET
          </h1>
          <p className="text-sm sm:text-lg text-[#6B7280]">
            Select principles and allocate budget. Total must equal 100%.
          </p>
        </div>

        {/* Budget Allocation Container */}
        <div className="flex flex-col gap-7">
          {/* Remaining Budget Card */}
          {remainingPercentage > 0 && remainingPercentage <= 100 ?
            <div className="px-7 py-5 inline-block m-auto rounded-xl border text-center border-gray-200 bg-[#F9FAFB] max-w-100">

              <div className="sm:text-base text-sm text-[#323152]">
                <span className="font-semibold">Remaining: </span>
                <span className="font-normal">
                  <>{remainingPercentage}% (${remainingDollars})</>

                </span>
              </div>
            </div>
            :
            shouldShowSuccessMessage(principles) ?
              <div className="px-7 py-5 inline-block m-auto rounded-xl border text-center border-[#10B981] bg-[#CFF1E6] max-w-100 text-[#10B981]">
                <div className='flex items-center gap-2 sm:text-[15px] text-[13px]'>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12.0292 5.22001C12.1696 5.36064 12.2485 5.55126 12.2485 5.75001C12.2485 5.94876 12.1696 6.13939 12.0292 6.28001L7.52918 10.78C7.38855 10.9205 7.19793 10.9994 6.99918 10.9994C6.80043 10.9994 6.6098 10.9205 6.46918 10.78L4.21918 8.53001C4.14549 8.46135 4.08639 8.37855 4.0454 8.28655C4.0044 8.19455 3.98236 8.09524 3.98059 7.99453C3.97881 7.89383 3.99733 7.7938 4.03505 7.70041C4.07278 7.60703 4.12892 7.52219 4.20014 7.45097C4.27136 7.37975 4.35619 7.32361 4.44958 7.28589C4.54297 7.24817 4.643 7.22964 4.7437 7.23142C4.8444 7.2332 4.94372 7.25524 5.03571 7.29623C5.12771 7.33722 5.21052 7.39632 5.27918 7.47001L6.99918 9.19001L10.9692 5.22001C11.1098 5.07956 11.3004 5.00067 11.4992 5.00067C11.6979 5.00067 11.8886 5.07956 12.0292 5.22001Z" fill="#10B981" />
                    <circle cx="8" cy="8" r="7.25" stroke="#10B981" strokeWidth="1.5" />
                  </svg>
                  Ready to Generate Report</div></div>
              :
              remainingPercentage > 100 ?
                <div className="px-7 py-5 inline-block m-auto  text-center max-w-fit text-[#EF4444]">
                  <div className='flex items-center gap-2 sm:text-[15px] text-[13px]'>
                    {ValidationIcon()}
                    Total must equal 100% (currently: {remainingPercentage}%)</div></div>
                : getCheckedPrinciples(principles)?.length > 0 ?
                  <div className="px-7 py-5 inline-block m-auto  text-center max-w-fit text-[#EF4444]">
                    <div className='flex items-center gap-2'>
                      {ValidationIcon()}
                      <span className='sm:text-[15px] text-[13px]'>Please ensure all the selected principles have budget allocated!</span>
                    </div></div>

                  :
                  <div className="px-7 py-5 inline-block m-auto  text-center max-w-fit text-[#EF4444]">
                    <div className='flex items-center gap-2'>
                      {ValidationIcon()}
                      <span className='sm:text-[15px] text-[13px]'>Please ensure execution layers total exactly 100%</span>
                    </div></div>
          }

          <div className="flex flex-col gap-6 sm:gap-7">
            {/* Principles Cards */}
            {principles?.map((principle) => (
              <div
                key={principle.id}
                className={`p-6 sm:p-8 rounded-lg border-l-4 
                ${principle.checked ? `bg-[${principle.bgcolor}] border-l-[${principle.color}]` : "border-l-[#AEAEAE] bg-[#FAFAFA]"}
                `}
                style={{
                  borderLeftColor: principle.checked ? principle.color : "#AEAEAE",
                  backgroundColor: principle.checked ? principle.bgcolor : "#FAFAFA",
                }}
              >
                <div className="flex flex-col gap-6 sm:gap-7">
                  {/* Header Section with Checkbox */}
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-row justify-between items-start  gap-6">
                      {/* Left Section */}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                          <button
                            className={`cursor-pointer w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0 rounded-xs ring flex items-center justify-center hover:opacity-80 transition-colors`}
                            onClick={() => togglePrincipleChecked(principle.id)}
                            style={{
                              boxShadow: `0 0 0 1px ${principle.checked ? principle.color : ''}`,
                              backgroundColor: principle.checked ? principle.color : '#F9FAFB',
                            }}
                            aria-label={`Toggle ${principle.name}`}
                          >
                            {principle.checked && (
                              <svg viewBox="0 0 14 14" fill="none" className="w-full h-full">
                                <path
                                  d="M5.57109 10.4999L2.24609 7.17493L3.07734 6.34368L5.57109 8.83743L10.9232 3.48535L11.7544 4.3166L5.57109 10.4999Z"
                                  fill="white"
                                />
                              </svg>
                            )}
                          </button>
                          <h3 onClick={() => togglePrincipleChecked(principle.id)} className="cursor-pointer text-md sm:text-lg font-semibold" style={{ color: principle.color }}>
                            {principle.name}
                          </h3>
                        </div>
                        <p className="sm:text-base text-sm text-[#6B7280] pl-6.5 ">
                          {principle.description}
                        </p>
                      </div>

                      {/* Right Section - Show only when checked */}

                      <div className="flex flex-col items-end gap-1">
                        <div className="text-md sm:text-lg font-semibold" style={{ color: principle.color }}>
                          {principle.percentage}%
                        </div>
                        {principle.checked && (
                          <div className="sm:text-base text-sm text-[#6B7280]">
                            ${getPrincipalDollarAmount(principle.id)}
                          </div>
                        )}
                      </div>

                    </div>
                  </div>

                  {/* Show slider and execution layers only when checked */}
                  {principle.checked && (
                    <>
                      {/* Slider */}
                      <div className="flex flex-col gap-3 pl-6.5">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={principle.percentage}
                          onChange={(e) =>
                            handlePrincipleSlider(principle.id, Number(e.target.value))
                          }
                          className="w-full h-2 bg-gray-300 rounded-full appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, ${principle.color} 0%, ${principle.color} ${principle.percentage}%, #d1d5db ${principle.percentage}%, #d1d5db 100%)`,
                            '--slider-color': principle.color,
                          } as React.CSSProperties}
                          aria-label={`Adjust ${principle.name} allocation`}
                        />
                      </div>



                      {/* Hide/Show Execution Layers Button */}
                      <button
                        onClick={() => toggleLayersVisible(principle.id)}
                        className="cursor-pointer flex items-center justify-center gap-2 text-sm sm:text-base text-[#323152] font-normal hover:opacity-80 transition-opacity py-2"
                      >
                        <svg
                          className={`sm:w-6 w-4 sm:h-6 h-4 transition-transform ${principle.layersVisible ? '' : 'rotate-180'
                            }`}
                          viewBox="0 0 24 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_38_1424)">
                            <path
                              d="M17.42 9.54801L18.48 8.48701L12.703 2.70801C12.6104 2.61486 12.5004 2.54093 12.3791 2.49048C12.2579 2.44003 12.1278 2.41406 11.9965 2.41406C11.8652 2.41406 11.7352 2.44003 11.6139 2.49048C11.4927 2.54093 11.3826 2.61486 11.29 2.70801L5.51001 8.48701L6.57001 9.54701L11.995 4.12301L17.42 9.54801Z"
                              fill="#323152"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_38_1424">
                              <rect
                                width="12"
                                height="24"
                                fill="white"
                                transform="matrix(0 -1 -1 0 24 12)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                        <span>
                          {principle.layersVisible ? 'Hide' : 'Show'} execution layers
                        </span>
                      </button>

                      {/* Execution Layers Section - Show only when visible */}
                      {principle.layersVisible && (
                        <>
                          <div className="h-px bg-black opacity-10" />

                          <div className="flex flex-col gap-4">
                            <div className="flex sm:flex-row flex-col justify-between sm:items-center items-start">
                              <h4 className="text-sm sm:text-base font-medium text-gray-900">
                                Allocate within {principle.name} (must total ${principle.budget.toLocaleString("en-US", {
                                  maximumFractionDigits: 1,
                                })})
                              </h4>
                              {calculateRemainingL(principle.id) <= 100 && calculateRemainingL(principle.id) != 0 ? <span className="sm:text-sm text-xs text-gray-500">
                                Remaining: {calculateRemainingL(principle.id)}% (${calculateDollarAmountL(calculateRemainingL(principle.id), principle.budget)})
                              </span> : calculateRemainingL(principle.id) == 0 ?

                                <span className='text-xs sm:text-sm text-[#10B981]'>Selected layers: 100% </span>
                                : <span className='text-xs sm:text-sm text-[#EF4444]'>Selected layers: {calculateRemainingL(principle.id)}% (Must equal 100%)</span>}
                            </div>

                            {/* Execution Layers Items */}
                            <div className="flex flex-col gap-3">
                              {principle?.layers?.map((layer) => (
                                <div
                                  key={layer.id}
                                  className="flex flex-col gap-4 p-5 rounded-lg border border-gray-200 bg-white"
                                >
                                  {/* Layer Header */}
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">


                                      <button
                                        onClick={() =>
                                          toggleLayer(principle.id, layer.id)
                                        }
                                        className={`cursor-pointer w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0 rounded-xs ring flex items-center justify-center hover:opacity-80 transition-colors`}
                                        style={{
                                          boxShadow: `0 0 0 1px ${layer.checked ? principle.color : ''}`,
                                          backgroundColor: layer.checked ? principle.color : '#F9FAFB',
                                        }}
                                        aria-label={`Toggle ${layer.name}`}
                                      >
                                        {layer.checked && (
                                          <svg
                                            viewBox="0 0 14 14"
                                            fill="none"
                                            className="w-full h-full"
                                          >
                                            <path
                                              d="M5.57109 10.4999L2.24609 7.17493L3.07734 6.34368L5.57109 8.83743L10.9232 3.48535L11.7544 4.3166L5.57109 10.4999Z"
                                              fill="white"
                                            />
                                          </svg>
                                        )}
                                      </button>
                                      <h5 onClick={() =>
                                        toggleLayer(principle.id, layer.id)
                                      } className="cursor-pointer text-xs sm:text-sm font-semibold text-gray-900">
                                        {layer.name}
                                      </h5>
                                    </div>

                                    <div className="flex items-end gap-2">
                                      <div className="text-xs sm:text-sm font-medium text-gray-900">
                                        {parseFloat(layer?.percentage?.toFixed(1)).toString()}%
                                      </div>
                                      {layer.checked && (
                                        <div className="text-xs sm:text-sm font-medium text-[#6B7280]">
                                          ${getLayerDollarAmount(layer, principle.id)}
                                        </div>
                                      )}
                                    </div>

                                    {/* <span className="text-xs sm:text-sm font-medium text-gray-900">
                                      {layer.percentage}%
                                    </span> */}
                                  </div>

                                  {/* Layer Slider */}
                                  {layer.checked && (
                                    <div className="flex flex-col gap-2 pl-7">
                                      <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={layer.percentage}
                                        onChange={(e) =>
                                          principle.percentage > 0 ? handleLayerSlider(
                                            principle.id,
                                            layer.id,
                                            Number(e.target.value)
                                          ) : ""
                                        }
                                        className="w-full h-2 bg-gray-300 rounded-full appearance-none cursor-pointer slider"
                                        style={{
                                          background: `linear-gradient(to right, ${principle.color} 0%, ${principle.color} ${layer.percentage}%, #d1d5db ${layer.percentage}%, #d1d5db 100%)`,
                                          '--slider-color': principle.color,
                                        } as React.CSSProperties}
                                        aria-label={`Adjust ${layer.name} allocation`}
                                      />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
            <div className="flex flex-col gap-4 rounded-xl border border-gray-200 p-6 sm:p-8 bg-[#FAFAFA]">
              <h1 className="font-inter sm:text-lg text-md font-semibold leading-6 text-gray-900">
                Project Notes / Context
              </h1>

              <div className="relative w-full">
                <textarea
                  value={selectedValues?.notes}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length === 1 && value === " ") return;
                    userNotes(value ?? "")
                  }}
                  placeholder="Use this space to record any critical context, rationale, etc."
                  className="h-32 w-full resize-none bg-white rounded-md border border-gray-200/50 px-5 py-5 font-inter text-sm tracking-tight text-gray-900 placeholder:text-gray-500/80 focus:border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-300"
                />
              </div>
            </div>

          </div>


          {/* Generate Report Button */}
          <button onClick={() => {
            if (!loader) {
              const principlesTotal = getTotalPrinciplesPercentage(principles);
              const layersValid = areAllLayersValid(principles, Number(totalBudget.replace(/,/g, "")));

              if (principlesTotal > 100 || (principlesTotal < 100 && principlesTotal > 0)) {
                setError(`Total must equal 100% (Allocated: ${principlesTotal}%)`);
                setShowToast(true);
                return;
              }

              else if (principlesTotal === 100 && !layersValid) {
                setError("Please ensure execution layers total exactly 100%");
                setShowToast(true);
                return;
              }
              else if (principlesTotal === 0) {
                setError("Please ensure that you are allocating your exact budget!");
                setShowToast(true);
                return;
              }
              else if (getCheckedPrinciples(principles)?.length > 0) {
                setError("Please ensure all the selected principles have budget allocated!");
                setShowToast(true);
                return;
              }

              generateReport();
            }
          }
          } className="cursor-pointer w-full px-10 sm:py-4 py-3 rounded-lg bg-[#3B82F6] text-center">
            <span className="text-base font-semibold text-white">
              {loader ? "Processing..." : "View Strategy"}
             
            </span>
          </button>
        </div>
      </main>
    </>
  );
}
