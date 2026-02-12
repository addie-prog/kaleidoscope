'use client';

import Image from "next/image";
import { Fragment, useEffect, useRef, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import "@/lib/chartjs";

type objectType = {
    [key: string | number]: any
}

export default function ReportPage() {

    const contentRef = useRef<HTMLDivElement>(null);
    const today = new Date();
    const [topValues, setTopValues] = useState<objectType>({});
    const [principles, setPrinciples] = useState<Array<objectType>>([]);
    const [items, setItems] = useState<objectType>({});

    useEffect(() => {
        const init = () => {
            if (typeof window !== "undefined" && window.__PDF_DATA__) {
                const data = window.__PDF_DATA__
                const selectedValues: objectType = JSON.parse(data.selectedValues || "{}");
                const principles: objectType[] = JSON.parse(data.principles || "[]");
                const cards: objectType[] = JSON.parse(data.currentCards || "{}");
                setTopValues(selectedValues);
                setPrinciples(principles);
                setItems(cards);
            }
        }
        init();
    }, []);



    const formattedDate = today.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });


    const order = ["must_have", "should_have", "skip"];
    const allLayers = principles?.flatMap((p) => { return p.layers });
    const layerOrderMap = Object.fromEntries(
        allLayers.map((layer, index) => [layer.id, index])
    );


    const lighten = (hex: string, amount = 0.5) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);

        const newR = Math.round(r + (255 - r) * amount);
        const newG = Math.round(g + (255 - g) * amount);
        const newB = Math.round(b + (255 - b) * amount);

        return `rgb(${newR}, ${newG}, ${newB})`;
    };

    const logoHTML = (paddingTop: string = "pt-6") => {
        return <div className="print-logo">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className={`flex  items-center justify-center ${paddingTop} pb-6`}>
                    <img
                        src="/logo.svg"
                        alt="The Kaleidoscope Project"
                        className="h-5 w-auto"
                    />
                </div>
            </div>
        </div>
    }

    return (

        <main className="m-auto max-w-4xl mx-auto max-w-4xl px-4 pt-6 sm:pt-8 lg:pt-12 " ref={contentRef}>

            {logoHTML("pt-0")}

            {/* Report Header Card */}
            <div
                className="px-4 sm:px-15 sm:py-7 py-6 rounded-lg bg-white"
                style={{
                    border: '3px solid transparent',
                    backgroundImage: 'linear-gradient(#FFFFFF, #FFFFFF), linear-gradient(135deg, #8B5CF5 0%, #EF4444 50%, #05B5D4 75%, #0C9668 87.5%, #D68908 93.75%, #3B81F5 100%)',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'padding-box, border-box',
                }}
            >
                <div className="flex flex-col items-center justify-center gap-6 sm:gap-5">
                    <h2 className="text-[17px] sm:text-[25px] font-bold text-[#111827] text-center ">
                        Responsible Tech Evaluation Report
                    </h2>

                    <div className="flex flex-wrap items-center justify-around  w-full sm:flex-row flex-col gap-[20px]">
                        <div className="flex flex-col items-center gap-2 sm:w-[30%]">
                            <div className="md:text-[15px] text-[13px] font-medium text-[#6B7280] text-center w-full">Project Name</div>
                            <div className="md:text-[17px] text-[13px] font-bold text-[#111827] text-center w-full">{topValues["Project Name"] ? topValues["Project Name"] : "None"}</div>
                        </div>
                        <div className="flex flex-col items-center gap-2 sm:w-[30%]">
                            <div className="md:text-[15px] text-[13px] font-medium text-[#6B7280] text-center w-full">Tech Type</div>
                            <div className="md:text-[17px] text-[13px] font-bold text-[#111827] text-center">{topValues["Vertical"] ? topValues["Vertical"] : "None"}</div>
                        </div>
                        <div className="flex flex-col items-center gap-2 sm:w-[30%]">
                            <div className="md:text-[15px] text-[13px] font-medium text-[#6B7280] text-center">Generated</div>
                            <div className="md:text-[17px] text-[13px] font-bold text-[#111827] text-center whitespace-nowrap">{formattedDate}</div>
                        </div>
                    </div>

                    <div className="inline-flex items-center justify-center h-[30px] sm:px-[20px] px-[15px] rounded-[18px] bg-[#3B82F6]">
                        <span className="sm:text-[15px] text-[11px] text-[#FFFFFF] leading-[normal]">{topValues["Stage"]}</span>
                    </div>
                </div>
            </div>

            {/* Budget Allocation Summary Card */}
            <div className="mt-6 flex flex-col items-center gap-6 sm:gap-5 w-full rounded-lg border-[3px] border-gray-200 bg-white sm:py-7 py-6">
                <h3 className="text-[17px] sm:text-[25px] font-bold text-[#111827] text-center">Budget Allocation Summary</h3>

                <div className="relative w-[200px] h-[200px]">
                    <Doughnut data={{
                        datasets: [
                            {
                                data: principles?.map((p) => { return p.budget }),
                                backgroundColor: principles?.map((p) => { return p.color }),
                                borderWidth: 3,
                            },
                        ],
                    }} options={{
                        cutout: "60%",
                        plugins: {
                            tooltip: { enabled: false },
                            legend: { display: false },
                        },
                        maintainAspectRatio: true,
                    }} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-sm text-gray-500 font-medium">Budget</span>
                        <span className="font-bold text-lg text-gray-900">
                            ${(topValues["Total cash"] / 1000).toFixed(1)}K
                        </span>
                    </div>
                </div>

            </div>


            {/* Principle Allocation */}

            {Array.from({ length: Math.ceil(principles.length / 3) }).map((_, groupIndex) => {
                const group = principles.slice(groupIndex * 3, groupIndex * 3 + 3);

                return (
                    <div key={groupIndex} className="print-page-break space-y-4">
                        <div className="page-break-avoid">
                            {logoHTML()}
                            <div className="w-full rounded-lg border-[3px] border-gray-200 bg-white p-5">
                                <h2 className="text-[17px] sm:text-[25px] font-semibold text-gray-900 mb-4">
                                    Principle Allocation
                                </h2>
                                <div className="flex flex-col gap-3">
                                    {group.map((principle) => (
                                        <div
                                            key={principle.id}
                                            style={{ backgroundColor: lighten(principle.color, 0.92) }}
                                            className="flex gap-0 overflow-hidden "
                                        >
                                            <div
                                                className="w-[3px] flex-shrink-0"
                                                style={{ backgroundColor: principle.color }}
                                            />

                                            <div className="flex flex-col w-full">
                                                {/* Header */}
                                                <div className="flex items-center justify-between px-4 py-3">
                                                    <div className="flex flex-col gap-1">
                                                        <h3 className="text-base font-semibold text-gray-900">
                                                            {principle.name}
                                                        </h3>
                                                        <p className="text-sm text-gray-500">
                                                            {principle.description}
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-col items-end gap-0">
                                                        <span
                                                            className="text-2xl font-bold"
                                                            style={{ color: principle.color }}
                                                        >
                                                            {principle.percentage}%
                                                        </span>

                                                        <span className="text-sm font-medium text-gray-900">
                                                            {principle.budget >= 1000
                                                                ? `$${(principle.budget / 1000).toLocaleString("en-US", {
                                                                    minimumFractionDigits: 1,
                                                                    maximumFractionDigits: 1,
                                                                })}K`
                                                                : `$${principle.budget?.toLocaleString("en-US")}`}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Layers */}
                                                {principle.layers?.filter((l: objectType) => l.checked).length > 0 && (
                                                    <div className="flex flex-col gap-2 px-4 pb-3">
                                                        {principle.layers
                                                            .filter((l: objectType) => l.checked)
                                                            .map((layer: objectType) => (
                                                                <div
                                                                    key={layer.id}
                                                                    className="flex items-center justify-between bg-white px-2 py-1.5"
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        <div
                                                                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                                                            style={{ backgroundColor: principle.color }}
                                                                        />
                                                                        <span className="text-sm text-gray-900">
                                                                            {layer.name}
                                                                        </span>
                                                                    </div>

                                                                    <span className="text-sm font-medium text-gray-900">
                                                                        ${layer?.budget?.toLocaleString("en-US")}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}</div>
                            </div>
                        </div></div>
                );
            })}



            {/* Content Section with Purple Left Border */}
            {Object.entries(items)
                .sort(
                    ([a], [b]) =>
                        (layerOrderMap[a] ?? 999) -
                        (layerOrderMap[b] ?? 999)
                )
                .map(([categoryKey, cards]) =>
                    <Fragment key={categoryKey}>
                        {(order.map((key) =>

                        (cards?.[key]?.map((card: objectType) =>

                        (<Fragment key={`${categoryKey}-${key}-${card.id}`}>

                            <div className="page-break-avoid ">
                                {logoHTML()}
                                <div className="border-l-2" style={{
                                    borderColor: principles?.filter((p: objectType) => {
                                        return p.id == card["Principle"]
                                    })[0]?.color
                                }}>
                                    <div className="border-t border-b border-gray-200 bg-white">
                                        <div className="flex items-center gap-4  pl-4 py-4">
                                            <h1 className="font-semibold text-lg text-gray-900 ">{principles?.filter((p: objectType) => {
                                                return p.id == card["Principle"]
                                            })[0]?.name} - {principles?.filter((p: objectType) => {
                                                return p.id == card["Principle"]
                                            })[0]?.layers?.filter((l: objectType) => { return l.id == card["Execution Layer"] })[0]?.name}</h1>
                                        </div>
                                    </div>

                                    {/* Main Content */}
                                    <div className="flex-1 space-y-6 pl-4 py-4">
                                        {/* Title Section with Badges */}
                                        <div className="space-y-3.5">
                                            {/* Badges and Cost */}
                                            <div className="flex items-center justify-between gap-4 flex-wrap">
                                                <div className="flex items-center gap-2">
                                                    {/* Must Have Badge */}
                                                    {card["Category"][0] == "skip"
                                                        ?
                                                        <div className="inline-flex items-center px-3 py-2 rounded-full bg-[#EF4444]">
                                                            <span className="text-[10px] font-semibold text-white leading-[normal]">SKIP FOR NOW</span>
                                                        </div> :
                                                        card["Category"][0] == "must_have" ?
                                                            <div className="inline-flex items-center px-3 py-2 rounded-full bg-[#10B981]">
                                                                <span className="text-[10px] font-semibold text-white leading-[normal]">MUST HAVE</span>
                                                            </div>

                                                            :
                                                            <div className="inline-flex items-center px-3 py-2 rounded-full bg-[#F59E0B]">
                                                                <span className="text-[10px] font-semibold text-white leading-[normal]">SHOULD HAVE</span>
                                                            </div>}


                                                    {/* Time Badge */}
                                                    <div className="flex items-center gap-1.5">
                                                        <svg className="w-4 h-4" viewBox="0 0 10 10" fill="none">
                                                            <circle cx="5" cy="5" r="4.167" stroke="#6B7280" strokeWidth="0.833" />
                                                            <path d="M5 2.5V5L6.667 5.833" stroke="#6B7280" strokeWidth="0.833" strokeLinecap="round" />
                                                        </svg>
                                                        <span className="text-xs font-medium text-[#6B7280]">{card["Time Weeks"]} week</span>
                                                    </div>
                                                </div>

                                                {/* Cost */}
                                                <div className="text-sm font-semibold text-right" style={{
                                                    color: principles?.filter((p: objectType) => {
                                                        return p.id == card["Principle"]
                                                    })[0]?.color
                                                }}>
                                                    {card["Cost Display"]}
                                                </div>
                                            </div>

                                            {/* Main Title */}
                                            <h4 className="text-[15px] sm:text-[20px] font-semibold text-[#111827] leading-tight">
                                                {card["Item Name"]}
                                            </h4>

                                        </div>
                                        <div className="flex items-start gap-1.5">
                                            <Image src="/warning.svg" width={15} height={15} alt="Icon" className="mt-1" />
                                            <div className="flex flex-col gap-3.5 w-full">
                                                <div className="sm:text-[15px] text-[13px] font-semibold text-[#111827]">Why This Matters:</div>
                                                <p className="text-xs sm:text-sm font-medium text-[#6B7280] leading-relaxed">
                                                    {card["Why This Matters"]}
                                                </p>
                                            </div>
                                        </div>
                                        {/* Why This Matters Section */}

                                        {/* What To Look For Section */}
                                        <div className="flex gap-1.5">

                                            <div className="flex items-start gap-1.5">
                                                <Image src="/quesmark.svg" width={15} height={15} alt="Icon" className="mt-1" />
                                                <div className="flex flex-col gap-3.5 w-full">
                                                    <div className="sm:text-[15px] text-[13px] font-semibold text-[#111827]">What To Look For:</div>
                                                    <div className="flex flex-col gap-3">
                                                        {card["What To Look For"]?.split("\\n").map((line: string) => line.replace("• ", "")).map((line: any, idx: number) => (
                                                            <div key={idx} className="flex items-center gap-1.5">
                                                                <div className="w-1 h-1 rounded-full flex-shrink-0" style={{
                                                                    background: principles?.filter((p: objectType) => {
                                                                        return p.id == card["Principle"]
                                                                    })[0]?.color
                                                                }}></div>
                                                                <p className="text-xs sm:text-sm font-medium text-[#6B7280]">
                                                                    {line}
                                                                </p>
                                                            </div>
                                                        ))}

                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Due Diligence Questions Box */}
                                        <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
                                            <div className="space-y-3.5">
                                                <h3 className="sm:text-[15px] text-[13px] font-semibold text-[#111827]">
                                                    Common Due Diligence Questions
                                                </h3>
                                                <div className="flex flex-col gap-3">

                                                    {card["Due Diligence Questions"]?.split("\\n").map((line: string) => line.replace("• ", "")).map((line2: any, idx2: number) => (
                                                        <div key={idx2} className="flex items-center gap-1.5">
                                                            <div className="text-sm font-bold" style={{
                                                                color: principles?.filter((p: objectType) => {
                                                                    return p.id == card["Principle"]
                                                                })[0]?.color
                                                            }}>{idx2 + 1}.</div>
                                                            <p className="text-xs sm:text-sm font-medium text-[#6B7280]">
                                                                {line2}
                                                            </p>
                                                        </div>
                                                    ))}

                                                </div>
                                            </div>
                                        </div>

                                        {/* Red Flags and Green Flags Side by Side */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Red Flags */}
                                            <div className="rounded-md border border-red-500 bg-red-50 p-4">
                                                <div className="space-y-3">
                                                    <h3 className="sm:text-sm text-xs font-semibold text-[#EF4444]">
                                                        Red Flags
                                                    </h3>
                                                    <div className="flex flex-col sm:gap-3 gap-2">

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
                                            </div>

                                            {/* Green Flags */}
                                            <div className="rounded-md border border-emerald-500 bg-emerald-50 p-4">
                                                <div className="space-y-3">
                                                    <h3 className="sm:text-sm text-xs font-semibold text-[#10B981]">
                                                        Green Flags
                                                    </h3>
                                                    <div className="flex flex-col sm:gap-3 gap-2">

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
                                            </div>
                                        </div>

                                        {/* Recommendation Box */}
                                        {card["Investment Recommendation"] ?
                                            <div className="p-3 rounded" style={{
                                                backgroundColor: `${principles?.filter((p: objectType) => {
                                                    return p.id == card["Principle"]
                                                })[0]?.color}1A`
                                            }}>
                                                <p className="sm:text-sm text-xs text-[#111827] leading-relaxed">
                                                    <span className="font-bold" style={{
                                                        color: principles?.filter((p: objectType) => {
                                                            return p.id == card["Principle"]
                                                        })[0]?.color
                                                    }}>Recommendation:</span>{' '}
                                                    {card["Investment Recommendation"]}                </p>
                                            </div> : ""}
                                    </div>
                                </div>

                            </div>
                            <div className="page-break-avoid ">
                                {logoHTML()}
                                <div className="flex-1 space-y-6 pl-4 pt-4 border-l-2 mb-[24px]" style={{
                                    borderColor: principles?.filter((p: objectType) => {
                                        return p.id == card["Principle"]
                                    })[0]?.color
                                }}>
                                    {/* Header */}
                                    <div className="mb-5">
                                        <div className="text-sm font-medium text-gray-500 mb-1.5">
                                            Execution Steps for
                                        </div>
                                        <h1 className="text-[15px] sm:text-[20px] font-semibold text-[#111827] leading-tight">
                                            {card["Item Name"]}
                                        </h1>
                                    </div>

                                    {/* Execution Steps Card */}
                                    <div className="border-2 border-gray-200 rounded-md bg-white overflow-hidden">
                                        {/* Card Header */}
                                        <div className="flex items-center justify-between px-2.5 py-2 border-b border-gray-200">
                                            <div className="text-sm font-semibold text-gray-900">
                                                Execution Steps
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {card["steps"]?.filter((s: objectType) => s.skipped == true)?.length > 0 &&
                                                    <>
                                                        <div className="flex items-center gap-1">
                                                            <svg
                                                                className="w-4 h-4"
                                                                viewBox="0 0 12 12"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    clipRule="evenodd"
                                                                    d="M6 11C3.2385 11 1 8.7615 1 6C1 3.2385 3.2385 1 6 1C8.7615 1 11 3.2385 11 6C11 8.7615 8.7615 11 6 11ZM5.4115 7.07L4.029 5.6865L3.5 6.2155L5.0595 7.776C5.15326 7.86974 5.28042 7.92239 5.413 7.92239C5.54558 7.92239 5.67274 7.86974 5.7665 7.776L8.7425 4.801L8.2115 4.27L5.4115 7.07Z"
                                                                    fill={principles?.filter((p: objectType) => {
                                                                        return p.id == card["Principle"]
                                                                    })[0]?.color}
                                                                />
                                                            </svg>
                                                            <span className="text-sm text-gray-500">
                                                                {card["steps"]?.filter((s: objectType) => s.completed == true)?.length} completed
                                                            </span>

                                                        </div></>}
                                                {card["steps"]?.filter((s: objectType) => s.skipped == true)?.length > 0 &&
                                                    <><div className="w-px h-3 bg-gray-200"></div>
                                                        <div className="flex items-center gap-1">
                                                            <svg className="w-3 h-3" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M5 0C2.239 0 0 2.239 0 5C0 7.761 2.239 10 5 10C7.761 10 10 7.761 10 5C10 2.239 7.761 0 5 0ZM5 9.152C4.21511 9.15169 3.44638 8.92894 2.78292 8.50957C2.11946 8.09021 1.58844 7.49139 1.25142 6.78254C0.914397 6.07369 0.785173 5.28384 0.878726 4.50455C0.972279 3.72526 1.28478 2.98844 1.78 2.3795L7.6205 8.2195C6.88095 8.82379 5.95503 9.15295 5 9.152ZM8.22 7.621L2.3795 1.7805C3.17703 1.13543 4.18509 0.808367 5.20942 0.862344C6.23375 0.91632 7.20185 1.34751 7.92717 2.07283C8.65249 2.79815 9.08368 3.76625 9.13766 4.79058C9.19163 5.81491 8.86457 6.82297 8.2195 7.6205" fill={principles?.filter((p: objectType) => {
                                                                    return p.id == card["Principle"]
                                                                })[0]?.color} />
                                                            </svg>
                                                            <span className="text-sm text-gray-500">
                                                                {card["steps"]?.filter((s: objectType) => s.skipped == true)?.length} skipped
                                                            </span>
                                                        </div></>}
                                                {(card["steps"]?.filter((s: objectType) => s.skipped == true)?.length > 0 ||
                                                    card["steps"]?.filter((s: objectType) => s.completed == true)?.length > 0) &&
                                                    <div className="w-px h-3 bg-gray-200"></div>}
                                                <div className="text-sm text-gray-500">{card["steps"]?.length} total</div>
                                            </div>
                                        </div>
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr>
                                                    <th style={{
                                                        backgroundColor: principles?.filter((p: objectType) => {
                                                            return p.id == card["Principle"]
                                                        })[0]?.color
                                                    }} className="px-2 py-1.5 text-sm font-semibold text-white text-left">
                                                        Action
                                                    </th>
                                                    <th style={{
                                                        backgroundColor: principles?.filter((p: objectType) => {
                                                            return p.id == card["Principle"]
                                                        })[0]?.color
                                                    }} className="px-2.5 py-1.5 text-sm font-semibold text-white text-left w-24">
                                                        Status
                                                    </th>
                                                    <th style={{
                                                        backgroundColor: principles?.filter((p: objectType) => {
                                                            return p.id == card["Principle"]
                                                        })[0]?.color
                                                    }} className="px-2.5 py-1.5 text-sm font-semibold text-white text-left w-52">
                                                        Notes
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {card["steps"].map((step: objectType, index1: number) => (
                                                    <tr key={index1} className="border-b border-gray-100">
                                                        <td className="px-2 py-3 text-sm text-gray-700 leading-[15px]">
                                                            {step.text}
                                                        </td>
                                                        <td className="px-2.5 py-3 text-sm text-gray-700">
                                                            <div className="flex items-center justify-center gap-0.5">
                                                                {step?.completed == true ? <svg
                                                                    className="w-4 h-4"
                                                                    viewBox="0 0 12 12"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        clipRule="evenodd"
                                                                        d="M6 11C3.2385 11 1 8.7615 1 6C1 3.2385 3.2385 1 6 1C8.7615 1 11 3.2385 11 6C11 8.7615 8.7615 11 6 11ZM5.4115 7.07L4.029 5.6865L3.5 6.2155L5.0595 7.776C5.15326 7.86974 5.28042 7.92239 5.413 7.92239C5.54558 7.92239 5.67274 7.86974 5.7665 7.776L8.7425 4.801L8.2115 4.27L5.4115 7.07Z"
                                                                        fill={principles?.filter((p: objectType) => {
                                                                            return p.id == card["Principle"]
                                                                        })[0]?.color}
                                                                    />

                                                                </svg> : step.skipped == true ? <svg className="w-3 h-3" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M5 0C2.239 0 0 2.239 0 5C0 7.761 2.239 10 5 10C7.761 10 10 7.761 10 5C10 2.239 7.761 0 5 0ZM5 9.152C4.21511 9.15169 3.44638 8.92894 2.78292 8.50957C2.11946 8.09021 1.58844 7.49139 1.25142 6.78254C0.914397 6.07369 0.785173 5.28384 0.878726 4.50455C0.972279 3.72526 1.28478 2.98844 1.78 2.3795L7.6205 8.2195C6.88095 8.82379 5.95503 9.15295 5 9.152ZM8.22 7.621L2.3795 1.7805C3.17703 1.13543 4.18509 0.808367 5.20942 0.862344C6.23375 0.91632 7.20185 1.34751 7.92717 2.07283C8.65249 2.79815 9.08368 3.76625 9.13766 4.79058C9.19163 5.81491 8.86457 6.82297 8.2195 7.6205" fill={principles?.filter((p: objectType) => {
                                                                        return p.id == card["Principle"]
                                                                    })[0]?.color} />
                                                                </svg> : ""}



                                                                <span>{step?.completed == true ? "Done" : step.skipped == true ? "Skipped" : "-"}</span>

                                                            </div>
                                                        </td>
                                                        <td className="px-2.5 py-3 text-sm text-gray-500 leading-[12px]">
                                                            {step.note ? step.note : "-"}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {/* Table */}

                                    </div>
                                </div>
                            </div>
                        </Fragment>
                        )
                        ))

                        ))}
                    </Fragment>
                )}
        </main>
    );
} 