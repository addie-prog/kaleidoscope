"use client";

import React, { useState } from "react";
import Image from "next/image";
import CategoryNavbar, { CategoryTab } from "@/components/dashboard/CategoryNavbar";

export default function DashboardPage() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("fairness");

  const categoryTabs: CategoryTab[] = [
    {
      id: "fairness",
      label: "Fairness",
      percentage: 89,
      color: "#895AF6",
    },
    {
      id: "privacy",
      label: "Privacy",
      percentage: 11,
      color: "#3C83F6",
    },
    {
      id: "safety",
      label: "Safety & Security",
      percentage: 0,
      color: "#EF4444",
    },
    {
      id: "transparency",
      label: "Transparency",
      percentage: 0,
      color: "#06B6D4 ",
    },
    {
      id: "accountability",
      label: "Accountability",
      percentage: 0,
      color: "#10B981",
    },
    {
      id: "accessibility",
      label: "Accessibility",
      percentage: 0,
      color: "#F59E0B",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F0F0F0]">
      <header className="h-16 bg-white border-b border-[#E5E5E5] flex items-center px-4 lg:px-8 relative z-50">
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
          width={100}
          height={100}
          alt="The Kaleidoscope Project"
          className="h-6 w-auto"
        />
      </header>

      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex flex-1">
        <aside
          className={`fixed lg:static w-80 bg-white border-r border-[#E5E5E5] flex flex-col z-40 transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="flex-1 flex flex-col justify-between p-6 gap-15">
            <div className="space-y-10">
              <div className="mb-4">
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
                    <div className="flex gap-0 flex-col pb-[5px] border-b mb-0">
                      <div className="text-sm text-[#6B7280]">Project Name</div>
                      <div className="text-[15px] font-semibold text-[#1C202C]">
                        Startup
                      </div>
                    </div>
                    <div className="bg-[#D4D4D4] opacity-50 mb-[5px]" />
                    <div className="flex gap-0 flex-col pb-[5px] border-b mb-0">
                      <div className="text-sm text-[#6B7280]">Tech Type</div>
                      <div className="text-[15px] font-semibold text-[#1C202C]">
                        AI/ML Models
                      </div>
                    </div>
                    <div className="bg-[#D4D4D4] opacity-50 mb-[5px]" />
                    <div className="flex gap-0 flex-col mb-0">
                      <div className="text-sm text-[#6B7280]">Budget</div>
                      <div className="text-2xl font-bold text-[#323743] leading-[normal]">$1.2K</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-[#323743] mb-2">
                  Allocation
                </h2>
                <div className="border border-[#E5E7EB] rounded-xl bg-[#F9FAFB] p-3">
                  <div className="relative w-42 h-42 mx-auto mb-6 mt-2">
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
                  </div>

                  <div className="space-y-0 border-t border-[#E5E7EB] pb-2">
                    <div className="flex justify-between items-center py-2 px-4 border-b border-[#E5E7EB]">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
                        <span className="text-sm font-medium text-[#895AF6]">
                          Fairness
                        </span>
                      </div>
                      <span className="text-[15px] font-medium text-[#323743]">
                        89%
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 px-4 border-b border-[#E5E7EB]">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#3C83F6]" />
                        <span className="text-sm font-medium text-[#3C83F6]">
                          Privacy
                        </span>
                      </div>
                      <span className="text-[15px] font-medium text-[#323743]">
                        11%
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 px-4 border-b border-[#E5E7EB]">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                        <span className="text-sm font-medium text-[#EF4444]">
                          Safety & Security
                        </span>
                      </div>
                      <span className="text-[15px] font-medium text-[#323743]">
                        0%
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 px-4 border-b border-[#E5E7EB]">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#06B6D4]" />
                        <span className="text-sm font-medium text-[#06B6D4]">
                          Transparency
                        </span>
                      </div>
                      <span className="text-[15px] font-medium text-[#323743]">
                        0%
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 px-4 border-b border-[#E5E7EB]">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                        <span className="text-sm font-medium text-[#10B981]">
                          Accountability
                        </span>
                      </div>
                      <span className="text-[15px] font-medium text-[#323743]">
                        0%
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-0 py-2 px-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                        <span className="text-sm font-medium text-[#F59E0B]">
                          Accessibility
                        </span>
                      </div>
                      <span className="text-[15px] font-medium text-[#323743]">
                        0%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 ">
              <div className="flex gap-2.5">
                <button className="flex-1 flex items-center justify-center gap-1 px-2.5 py-3 border border-[#E5E7EB] bg-[#F9FAFB] rounded-xl hover:bg-gray-100 transition-colors">
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
                  <span className="text-base font-semibold text-[#3B82F6]">
                    Edit
                  </span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 px-2.5 py-3 border border-[#E5E7EB] bg-[#F9FAFB] rounded-xl hover:bg-gray-100 transition-colors">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 2C5.6 2 2 5.6 2 10C2 14.4 5.6 18 10 18C14.4 18 18 14.4 18 10C18 5.6 14.4 2 10 2M9 14L5 10.5L5.94 9.56L9 12.5L14.5 6.5L15.44 7.44L9 14Z"
                      fill="#3B82F6"
                    />
                  </svg>
                  <span className="text-base font-semibold text-[#3B82F6]">
                    Save
                  </span>
                </button>
              </div>
              <button className="w-full flex items-center justify-center gap-1 px-2.5 py-3 bg-[#3B82F6] rounded-lg hover:bg-[#2563EB] transition-colors">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.6925 10.97C11.822 10.8665 11.9873 10.8186 12.1521 10.837C12.3169 10.8554 12.4677 10.9384 12.5712 11.068C12.6748 11.1975 12.7226 11.3628 12.7043 11.5276C12.6859 11.6924 12.6028 11.8432 12.4733 11.9467L10.395 13.6092C10.2837 13.7001 10.1445 13.7498 10.0008 13.75H9.99415C9.85307 13.749 9.7165 13.7002 9.60665 13.6117L7.52582 11.9467C7.3963 11.8432 7.31323 11.6924 7.29486 11.5276C7.2765 11.3628 7.32436 11.1975 7.4279 11.068C7.53145 10.9384 7.6822 10.8554 7.847 10.837C8.01179 10.8186 8.17714 10.8665 8.30665 10.97L9.37415 11.825V8.95837C9.37415 8.79261 9.44 8.63364 9.55721 8.51643C9.67442 8.39922 9.83339 8.33337 9.99915 8.33337C10.1649 8.33337 10.3239 8.39922 10.4411 8.51643C10.5583 8.63364 10.6241 8.79261 10.6241 8.95837V11.825L11.6925 10.97Z"
                    fill="white"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.83268 1.875C5.22489 1.875 4.642 2.11644 4.21223 2.54621C3.78246 2.97598 3.54102 3.55888 3.54102 4.16667V15.8333C3.54102 16.4411 3.78246 17.024 4.21223 17.4538C4.642 17.8836 5.22489 18.125 5.83268 18.125H14.166C14.7738 18.125 15.3567 17.8836 15.7865 17.4538C16.2162 17.024 16.4577 16.4411 16.4577 15.8333V6.83167C16.4577 6.52672 16.3621 6.22945 16.1843 5.98167L13.6727 2.48333C13.5378 2.29522 13.36 2.14194 13.1541 2.03616C12.9482 1.93038 12.72 1.87513 12.4885 1.875H5.83268ZM4.79102 4.16667C4.79102 3.59167 5.25768 3.125 5.83268 3.125H11.8743V6.78917C11.8743 7.13417 12.1543 7.41417 12.4993 7.41417H15.2077V15.8333C15.2077 16.4083 14.741 16.875 14.166 16.875H5.83268C5.25768 16.875 4.79102 16.4083 4.79102 15.8333V4.16667Z"
                    fill="white"
                  />
                </svg>
                <span className="text-base font-semibold text-white">
                  Download
                </span>
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col w-full lg:w-auto overflow-x-hidden m-5">
          <div className="flex-1 bg-white flex flex-col">
            <CategoryNavbar
              tabs={categoryTabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            <div className="flex-1 p-4 lg:p-5 overflow-y-auto">
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 border border-[#918D8D] rounded-lg whitespace-nowrap">
                  <span className="text-sm lg:text-base font-medium text-[#918D8D]">
                    Data Quality & Representation
                  </span>
                  <span className="text-sm lg:text-base font-medium text-[#918D8D]">21%</span>
                </div>
                <div className="inline-flex items-center gap-2.5 px-2.5 py-1 bg-[#895AF6] rounded-lg whitespace-nowrap">
                  <span className="text-sm lg:text-base font-medium text-white">
                    Algorithmic Testing
                  </span>
                  <span className="text-sm lg:text-base font-medium text-white">13%</span>
                </div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 border border-[#918D8D] rounded-lg whitespace-nowrap">
                  <span className="text-sm lg:text-base font-medium text-[#918D8D]">
                    Inclusive Design
                  </span>
                  <span className="text-sm lg:text-base font-medium text-[#918D8D]">40%</span>
                </div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 border border-[#918D8D] rounded-lg whitespace-nowrap">
                  <span className="text-sm lg:text-base font-medium text-[#918D8D]">
                    Remediation & Accountability
                  </span>
                  <span className="text-sm lg:text-base font-medium text-[#918D8D]">15%</span>
                </div>
              </div>

              <div className="h-px bg-[#E9E9E9] mb-5" />

              <div className="inline-flex items-center px-3 py-2 bg-[#10B981] rounded-[20px] mb-5">
                <span className="text-sm font-medium text-white">
                  Must Have (1)
                </span>
              </div>
              <div className="flex flex-col gap-5">
              <div className="border border-[#E5E7EB] rounded-xl bg-white">
                <div className="p-4 lg:p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-start gap-2 lg:gap-2.5">
                      <div className="mt-1 cursor-pointer w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0 rounded-[1px] ring flex items-center justify-center hover:opacity-80 transition-colors" />
                      <div>
                        <h3 className="text-base lg:text-lg font-semibold text-[#323743] leading-[normal]">
                          Algorithmic Fairness Testing Suite
                        </h3>
                        <p className="text-sm lg:text-base font-medium text-[#ADADAD]">
                          $8,000 - $25,000
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setExpandedCard(expandedCard === 1 ? null : 1)
                      }
                      className="p-0 hover:opacity-70 transition-opacity"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`transition-transform duration-200 ${
                          expandedCard === 1 ? "rotate-180" : ""
                        }`}
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12.3763 15.3763C12.1888 15.5638 11.9345 15.6691 11.6693 15.6691C11.4041 15.6691 11.1498 15.5638 10.9623 15.3763L5.30529 9.71929C5.20978 9.62704 5.1336 9.5167 5.08119 9.39469C5.02878 9.27269 5.00119 9.14147 5.00004 9.00869C4.99888 8.87591 5.02419 8.74423 5.07447 8.62133C5.12475 8.49844 5.199 8.38679 5.29289 8.29289C5.38679 8.199 5.49844 8.12475 5.62133 8.07447C5.74423 8.02419 5.87591 7.99888 6.00869 8.00004C6.14147 8.00119 6.27269 8.02878 6.39469 8.08119C6.5167 8.1336 6.62704 8.20978 6.71929 8.30529L11.6693 13.2553L16.6193 8.30529C16.8079 8.12313 17.0605 8.02234 17.3227 8.02461C17.5849 8.02689 17.8357 8.13206 18.0211 8.31747C18.2065 8.50288 18.3117 8.75369 18.314 9.01589C18.3162 9.27808 18.2154 9.53069 18.0333 9.71929L12.3763 15.3763Z"
                          fill="#323743"
                        />
                      </svg>
                    </button>
                  </div>

                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-[#ADADAD] mb-2">
                        Step 0 of 5
                      </span>
                      <span className="text-sm font-bold text-[#ADADAD]">0%</span>
                    </div>
                    <div className="h-1.5 bg-[#F0F0F0] rounded-[10px] overflow-hidden">
                      <div
                        className="h-full bg-[#895AF6] rounded-[10px]"
                        style={{ width: "0%" }}
                      />
                    </div>
                  </div>
                </div>
                
              </div>

              <div className="border border-[#E5E7EB] rounded-xl bg-white">
                <div className="p-4 lg:p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-start gap-2 lg:gap-2.5">
                      <button 
                    
                      className="mt-1 cursor-pointer w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0 rounded-[1px] ring flex items-center justify-center hover:opacity-80 transition-colors" />
                      <div>
                        <h3 className="text-base lg:text-lg font-semibold text-[#323743] leading-[normal]">
                          Inclusive Design Workshop Series
                        </h3>
                        <p className="text-sm lg:text-base font-medium text-[#ADADAD]">
                          $8,000 - $25,000
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setExpandedCard(expandedCard === 1 ? null : 1)
                      }
                      className="p-0 hover:opacity-70 transition-opacity"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`transition-transform duration-200 ${
                          expandedCard === 1 ? "rotate-180" : ""
                        }`}
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12.3763 15.3763C12.1888 15.5638 11.9345 15.6691 11.6693 15.6691C11.4041 15.6691 11.1498 15.5638 10.9623 15.3763L5.30529 9.71929C5.20978 9.62704 5.1336 9.5167 5.08119 9.39469C5.02878 9.27269 5.00119 9.14147 5.00004 9.00869C4.99888 8.87591 5.02419 8.74423 5.07447 8.62133C5.12475 8.49844 5.199 8.38679 5.29289 8.29289C5.38679 8.199 5.49844 8.12475 5.62133 8.07447C5.74423 8.02419 5.87591 7.99888 6.00869 8.00004C6.14147 8.00119 6.27269 8.02878 6.39469 8.08119C6.5167 8.1336 6.62704 8.20978 6.71929 8.30529L11.6693 13.2553L16.6193 8.30529C16.8079 8.12313 17.0605 8.02234 17.3227 8.02461C17.5849 8.02689 17.8357 8.13206 18.0211 8.31747C18.2065 8.50288 18.3117 8.75369 18.314 9.01589C18.3162 9.27808 18.2154 9.53069 18.0333 9.71929L12.3763 15.3763Z"
                          fill="#323743"
                        />
                      </svg>
                    </button>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-[#ADADAD]">
                        Step 0 of 6
                      </span>
                      <span className="text-sm font-bold text-[#ADADAD]">0%</span>
                    </div>
                    <div className="h-1.5 bg-[#F0F0F0] rounded-[10px] overflow-hidden">
                      <div
                        className="h-full bg-[#895AF6] rounded-[10px]"
                        style={{ width: "0%" }}
                      />
                    </div>
                  </div>
                </div>
                
              </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
