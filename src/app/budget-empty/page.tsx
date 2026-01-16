"use client";

import { useState } from "react";
import Image from "next/image";

const tabs = [
  { id: "security", label: "Security Testing & Penetration", active: true },
  { id: "threat", label: "Threat Monitoring", active: false },
  { id: "content", label: "Content Moderation", active: false },
  { id: "incident", label: "Incident Response Planning", active: false },
];

export default function BudgetEmptyPage() {
  const [activeTab, setActiveTab] = useState("security");

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Card Container */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="p-5 border-b border-gray-200">
            <div className="flex flex-wrap items-center gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-lg font-medium text-base transition-all ${
                    activeTab === tab.id
                      ? "bg-red-500 text-white"
                      : "border border-gray-400 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Empty State Content */}
          <div className="py-16 px-6 flex flex-col items-center justify-center">
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
              No Budget Allocated to Safety & Security
            </h1>

            {/* Description */}
            <p className="text-base text-gray-600 text-center max-w-md leading-6 mb-8">
              You haven't allocated any budget to this principle. Without
              investment here, you may be at risk of gaps in your responsible
              tech strategy.
            </p>

            {/* Action Button */}
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-base rounded-lg transition-colors">
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
        </div>
      </div>
    </div>
  );
}
