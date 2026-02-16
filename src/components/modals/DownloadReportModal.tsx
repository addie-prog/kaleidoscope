"use client";

import { useEffect, useState } from "react";
import { Modal } from "../ui/modal";

interface DownloadReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEmail: string;
  downloadPDf: () => void;
  saveProgess: (val: string, type: number) => Promise<void>;
  pdfLoader: boolean,
  successMessage: boolean;
  linkSent: boolean;

}

export default function DownloadReportModal({ linkSent, saveProgess, successMessage, isOpen, onClose, selectedEmail, downloadPDf, pdfLoader }: DownloadReportModalProps) {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const [type, setType] = useState<number>(1);

  useEffect(() => {
    setEmail(selectedEmail);
  }, [selectedEmail]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    type === 1 ? setIsSending(true) : setIsDownloading(true);

    try {
      await saveProgess(email, type);
      if (type == 2) {
        await downloadPDf();
        onClose();
      }

    } finally {
      setIsSending(false);
      setIsDownloading(false);
    }

  };

  return (
    <>
      {/* Backdrop */}
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-[550px] m-4">
        {/* Modal */}
        <div
          className="relative w-full bg-white rounded-[20px] p-6 sm:p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Cloud Download Icon */}
          <div className="flex justify-center mb-6 sm:mb-8">
            {!successMessage ? <svg
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
            </svg> : <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>}

          </div>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 text-center mb-3">
            {successMessage ? "Email sent!" : "Download Your Report"}
          </h2>

          {/* Description */}
          {!successMessage ? (
            <p className="text-sm sm:text-base text-gray-600 text-center leading-6 sm:leading-7 mb-6 sm:mb-8 px-2 sm:px-4">
              {linkSent ? "Your project is already linked to this email, you can download your personalized responsible tech report." : "Enter your email to download your personalized responsible tech report."}
            </p>)
            : (
              <p className="text-sm text-gray-600 text-center leading-6 max-w-sm mx-auto">
                We've sent a secure magic link to
                <span className="block font-medium text-gray-900 mt-1">
                  {email}
                </span>
                <span className="block text-xs text-gray-500 mt-2">
                  Check your inbox (and spam folder).
                </span>
              </p>
            )}

          {/* Form */}
          {!successMessage && (
            <form
              onSubmit={(e) => handleSubmit(e)}
               className="space-y-3"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
              <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                 <button
                type="submit"
                onClick={() => setType(2)}
                disabled={isDownloading}
                className="whitespace-nowrap px-5 py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {isDownloading ? "Downloading..." : "Download PDF"}
              </button>
              <button
                type="submit"
                disabled={isSending}
                onClick={() => setType(1)}
                className="whitespace-nowrap px-5 py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {isSending
                  ? "Sending..."
                  : linkSent
                    ? "Resend Magic Link"
                    : "Send Magic Link"}
              </button>
             </div>
            </form>)}
        </div>
      </Modal>
    </>
  );
}
