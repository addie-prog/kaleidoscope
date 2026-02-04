"use client";

import { useEffect, useState } from "react";
import { Modal } from "../ui/modal";


interface CopyLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    link?: string;
}

export function CopyLinkModal({
    isOpen,
    onClose,
    link = "https://example.com/share/abc123"
}: CopyLinkModalProps) {
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(link);
            setMessage({ type: 'success', text: 'Link copied to clipboard!' });
            localStorage.removeItem("copyModal");

            // Clear message after 3 seconds
            setTimeout(() => {
                setMessage(null);
            }, 3000);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to copy link' });

            // Clear message after 3 seconds
            setTimeout(() => {
                setMessage(null);
            }, 3000);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[450px] m-4">
            <div
                className="relative w-full bg-white rounded-[20px] p-6"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Icon */}
                <div className="flex justify-center mb-5">
                    <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg">
                        <svg
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
                    Copy Link
                </h2>

                {/* Description */}
                <p className="my-4 text-sm text-gray-600 text-center leading-6  px-2">
                    Please save this link for future access.
                </p>

                {/* <div className="my-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm leading-5 text-center">
                    <strong>Important:</strong> Please save this link. You won’t be able to access your content later without it.
                </div> */}

                {/* Success/Error Message */}
                {message && (
                    <div className={`mb-4 p-3 rounded-lg text-center text-sm font-medium ${message.type === 'success'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* Form */}
                <div className="flex flex-col sm:flex-row gap-2">
                    <input
                        type="text"
                        value={link}
                        readOnly
                        className="flex-1 w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        type="button"
                        onClick={handleCopyLink}
                        className="w-full sm:w-auto px-5 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-semibold text-sm rounded-lg transition-colors"
                    >
                        Copy Link
                    </button>
                </div>
            </div>
        </Modal>
    );
}
