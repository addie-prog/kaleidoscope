'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ExecutionLayer {
  id: string;
  name: string;
  percentage: number;
  checked: boolean;
}

interface Principle {
  id: string;
  name: string;
  description: string;
  color: string;
  bgcolor: string;
  percentage: number;
  checked: boolean;
  layersVisible: boolean;
  layers: ExecutionLayer[];
}

export default function AllocatePage() {
  const totalBudget = 26000;
  
 const [principles, setPrinciples] = useState<Principle[]>([
    {
      id: 'fairness',
      name: 'Fairness',
      description: 'Ensuring equitable outcomes across all user groups',
      color: '#8B5CF6',
      bgcolor: '#F9F7FE',
      percentage: 0,
      checked: false,
      layersVisible: false,
      layers: [
        {
          id: 'data-quality',
          name: 'Data Quality & Representation',
          percentage: 0,
          checked: false,
        },
        {
          id: 'algorithmic-testing',
          name: 'Algorithmic Testing',
          percentage: 0,
          checked: false,
        },
        {
          id: 'inclusive-design',
          name: 'Inclusive Design',
          percentage: 0,
          checked: false,
        },
        {
          id: 'remediation',
          name: 'Remediation & Accountability',
          percentage: 0,
          checked: false,
        },
      ],
    },
    {
      id: 'privacy',
      name: 'Privacy',
      description: 'Protecting user data and maintaining confidentiality',
      color: '#3B82F6',
      bgcolor: '#F7FBFE',
      percentage: 0,
      checked: false,
      layersVisible: false,
      layers: [
        {
          id: 'data-minimization',
          name: 'Data Minimization',
          percentage: 0,
          checked: false,
        },
        {
          id: 'encryption',
          name: 'Encryption & Security',
          percentage: 0,
          checked: false,
        },
        {
          id: 'consent',
          name: 'Consent Management',
          percentage: 0,
          checked: false,
        },
        {
          id: 'audit',
          name: 'Privacy Audit',
          percentage: 0,
          checked: false,
        },
      ],
    },
    {
      id: 'safety',
      name: 'Safety & Security',
      description: 'Preventing harm and protecting against threats',
      color: '#EF4444',
      bgcolor: '#FFFDFD',
      percentage: 0,
      checked: false,
      layersVisible: false,
      layers: [
        {
          id: 'content-moderation',
          name: 'Content Moderation',
          percentage: 0,
          checked: false,
        },
        {
          id: 'security-testing',
          name: 'Security Testing',
          percentage: 0,
          checked: false,
        },
        {
          id: 'incident-response',
          name: 'Incident Response',
          percentage: 0,
          checked: false,
        },
        {
          id: 'user-protection',
          name: 'User Protection',
          percentage: 0,
          checked: false,
        },
      ],
    },
    {
      id: 'transparency',
      name: 'Transparency',
      description: 'Clear communication about how systems work',
      color: '#06B6D4',
      bgcolor: '#FDFFFF',
      percentage: 0,
      checked: false,
      layersVisible: false,
      layers: [
        {
          id: 'explainability',
          name: 'Explainability',
          percentage: 0,
          checked: false,
        },
        {
          id: 'documentation',
          name: 'Documentation',
          percentage: 0,
          checked: false,
        },
        {
          id: 'user-disclosure',
          name: 'User Disclosure',
          percentage: 0,
          checked: false,
        },
        {
          id: 'reporting',
          name: 'Reporting',
          percentage: 0,
          checked: false,
        },
      ],
    },
     {
      id: 'accountability',
      name: 'Accountability',
      description: 'Taking responsibility for system outcomes',
      color: '#10B981',
      bgcolor: '#F7FEFA',
      percentage: 0,
      checked: false,
      layersVisible: false,
      layers: [
        {
          id: 'governance-framework',
          name: 'Governance Framework',
          percentage: 0,
          checked: false,
        },
        {
          id: 'monitoring-metrics',
          name: 'Monitoring & Metrics',
          percentage: 0,
          checked: false,
        },
        {
          id: 'compliance',
          name: 'Compliance',
          percentage: 0,
          checked: false,
        },
        {
          id: 'stakeholder-engagement',
          name: 'Stakeholder Engagement',
          percentage: 0,
          checked: false,
        },
      ],
    },
     {
      id: 'accessibility',
      name: 'Accessibility',
      description: 'Ensuring systems work for everyone',
      color: '#F59E0B',
      bgcolor: '#FEFCF7',
      percentage: 0,
      checked: false,
      layersVisible: false,
      layers: [
        {
          id: 'wcag-compliance',
          name: 'WCAG Compliance',
          percentage: 0,
          checked: false,
        },
        {
          id: 'assistive-technology-support',
          name: 'Assistive Technology Support',
          percentage: 0,
          checked: false,
        },
        {
          id: 'accessible-design',
          name: 'Accessible Design',
          percentage: 0,
          checked: false,
        },
        {
          id: 'accessibility-testing',
          name: 'Accessibility Testing',
          percentage: 0,
          checked: false,
        },
      ],
    },
  ]);

  const togglePrincipleChecked = (principleId: string) => {
    setPrinciples((prev) =>
      prev.map((p) =>
        p.id === principleId ? { ...p, checked: !p.checked } : p
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
                layer.id === layerId ? { ...layer, checked: !layer.checked } : layer
              ),
            }
          : p
      )
    );
  };

  const handlePrincipleSlider = (principleId: string, value: number) => {
    setPrinciples((prev) =>
      prev.map((p) =>
        p.id === principleId
          ? { ...p, percentage: Math.min(Math.max(value, 0), 100) }
          : p
      )
    );
  };

  const handleLayerSlider = (principleId: string, layerId: string, value: number) => {
    setPrinciples((prev) =>
      prev.map((p) =>
        p.id === principleId
          ? {
              ...p,
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
    const principle = principles.find((p) => p.id === principleId);
    if (!principle) return '0';
    return (principle.percentage / 100 * 9.3).toFixed(1);
  };

  

  const totalRemaining = 100;
  const totalRemainingDollar = 6.4;

  

  
  const calculateRemaining = () => {
    const totalAllocated = principles.reduce((sum, p) => sum + p.percentage, 0);
    return 100 - totalAllocated;
  };

  const calculateDollarAmount = (percentage: number) => {
    return ((percentage / 100) * totalBudget).toFixed(1);
  };

  const remainingPercentage = calculateRemaining();
  const remainingDollars = calculateDollarAmount(remainingPercentage);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-22 items-center justify-center py-8">
            <Link href="/budget-tool">
              <Image
                src="/logo.svg"
                width={100}
                height={100}
                alt="The Kaleidoscope Project"
                className="h-6 w-auto"
              />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Title Section */}
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
          <div className="px-7 py-5 inline-block m-auto rounded-xl border text-center border-gray-200 bg-[#F9FAFB] max-w-100">
            <div className="sm:text-base text-sm text-[#323152]">
              <span className="font-semibold">Remaining: </span>
              <span className="font-normal">
                {remainingPercentage}% (${remainingDollars}K)
              </span>
            </div>
          </div>

           <div className="flex flex-col gap-6 sm:gap-7">
          {/* Principles Cards */}
          {principles.map((principle) => (
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
                          ${getPrincipalDollarAmount(principle.id)}K
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
                        className={`sm:w-6 w-4 sm:h-6 h-4 transition-transform ${
                          principle.layersVisible ? '' : 'rotate-180'
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
                              Allocate within {principle.name} (must total 1%)
                            </h4>
                            <span className="sm:text-sm text-xs text-gray-500">
                              Remaining: 100% ($6.4K)
                            </span>
                          </div>

                          {/* Execution Layers Items */}
                          <div className="flex flex-col gap-3">
                            {principle.layers.map((layer) => (
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
                                  <span className="text-xs sm:text-sm font-medium text-gray-900">
                                    {layer.percentage}%
                                  </span>
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
                                        handleLayerSlider(
                                          principle.id,
                                          layer.id,
                                          Number(e.target.value)
                                        )
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

         
        </div>

          {/* Generate Report Button */}
          <Link href="/report" className="w-full px-10 sm:py-4 py-3 rounded-lg bg-[#3B82F6] text-center">
            <span className="text-base font-semibold text-white">
              Generate Report
            </span>
          </Link>
        </div>
      </main>
    </div>
  );
}
