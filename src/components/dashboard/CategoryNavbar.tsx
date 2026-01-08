"use client";

import React from "react";

export interface CategoryTab {
  id: string;
  label: string;
  percentage?: number;
  color: string;
  isActive?: boolean;
}

interface CategoryNavbarProps {
  tabs: CategoryTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function CategoryNavbar({
  tabs,
  activeTab,
  onTabChange,
}: CategoryNavbarProps) {
  return (
    <nav className="w-full bg-white flex items-end overflow-x-auto no-scrollbar ">
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 relative flex flex-col px-6 py-[12px] justify-center items-center gap-1.5 transition-colors  border-r border-[#EDEDED] flex-shrink-0 ${
              isActive
                ? "bg-white border-0"
                : "bg-[#FCFCFC]  hover:bg-gray-50 border-b"
            } ${index === 0 && !isActive ? "border-l" : ""}`}
          >
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                {/* Color indicator dot */}
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: tab.color
                  }}
                />
                
                {/* Tab label */}
                <span
                  className={`text-base whitespace-nowrap ${
                    isActive
                      ? "font-semibold"
                      : tab.percentage
                      ? "font-semibold"
                      : "font-medium text-[#BEBEBE]"
                  }`}
                  style={{
                    color: tab.color
                  }}
                >
                  {tab.label}
                </span>
              </div>

              {/* Percentage */}
              {tab.percentage !== undefined && (
                <span className="text-sm font-medium text-[#323743]">
                  {tab.percentage}%
                </span>
              )}
            </div>

            {/* Active indicator line */}
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
  );
}
