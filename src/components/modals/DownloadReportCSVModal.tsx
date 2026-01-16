"use client";

import { useState } from "react";
import { Modal } from "../ui/modal";

interface DownloadReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DownloadReportCSVModal({ isOpen, onClose }: DownloadReportModalProps) {
  const [email, setEmail] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle download report logic here
    console.log("Downloading report for:", email);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
     <Modal isOpen={isOpen} onClose={onClose} className="max-w-[550px] m-4">
        {/* Modal */}
        <div
          className="relative w-full bg-white rounded-[20px] p-6"
          onClick={(e) => e.stopPropagation()}
        >
          

          {/* Cloud Download Icon */}
          <div className="flex justify-center mb-8">
            <svg
              width="115"
              height="115"
              viewBox="0 0 115 115"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M96.2977 22.9692C93.2774 10.3315 81.7421 1.06641 68.5483 1.06641C59.5859 1.06641 51.2749 5.18237 45.8724 12.1839C34.0804 10.1474 22.3147 17.8989 19.2351 29.227C8.55537 30.4015 0 39.476 0 50.4585C0 62.2372 9.80555 71.8184 21.5845 71.8184H50.7617C52.624 71.8184 54.1309 70.3115 54.1309 68.4492V60.0264H60.8691V68.4492C60.8691 70.3115 62.376 71.8184 64.2383 71.8184H89.9082C103.622 71.8184 115 60.6647 115 46.9546C115 35.5639 107.136 25.8282 96.2977 22.9692Z"
                fill="url(#paint0_linear_download)"
              />
              <path
                d="M80.8274 89.0589C80.5727 88.4431 80.141 87.9168 79.5869 87.5466C79.0328 87.1764 78.3813 86.979 77.715 86.9795H67.6075V56.6572C67.6075 54.795 66.1006 53.2881 64.2384 53.2881H50.7618C48.8996 53.2881 47.3927 54.795 47.3927 56.6572V86.9795H37.2853C35.9232 86.9795 34.6926 87.7986 34.1729 89.0589C33.6531 90.3192 33.9426 91.7668 34.9033 92.7308L55.1181 112.946C55.7762 113.604 56.6383 113.933 57.5001 113.933C58.3619 113.933 59.2242 113.604 59.8821 112.946L80.0969 92.7308C80.5673 92.2591 80.8876 91.6587 81.0176 91.0054C81.1475 90.352 81.0814 89.6748 80.8274 89.0589ZM50.7618 46.5498H64.2384C66.1006 46.5498 67.6075 45.0429 67.6075 43.1807C67.6075 41.3184 66.1006 39.8115 64.2384 39.8115H50.7618C48.8996 39.8115 47.3927 41.3184 47.3927 43.1807C47.3927 45.0429 48.8996 46.5498 50.7618 46.5498Z"
                fill="url(#paint1_linear_download)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_download"
                  x1="57.5"
                  y1="71.8184"
                  x2="57.5"
                  y2="1.06641"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#3B82F6" />
                  <stop offset="1" stopColor="#9FC4FF" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_download"
                  x1="57.5001"
                  y1="113.933"
                  x2="57.5001"
                  y2="39.8115"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#D0E2FF" />
                  <stop offset="0.997" stopColor="#F4F8FF" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-3">
            Download Your Report
          </h2>

          {/* Description */}
          <p className="text-base text-gray-600 text-center leading-7 mb-8 px-4">
            Enter your email to download your personalized responsible tech report.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex gap-2.5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
              className="flex-1 px-3 py-3 border border-gray-300 rounded-lg text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-base rounded-lg transition-colors whitespace-nowrap"
            >
              Download CSV
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
}
