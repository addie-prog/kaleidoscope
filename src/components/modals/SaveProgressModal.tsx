"use client";

import { useState } from "react";
import { Modal } from "../ui/modal";
interface SaveProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SaveProgressModal({ isOpen, onClose }: SaveProgressModalProps) {
  const [email, setEmail] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving progress for:", email);
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-[550px] m-4">

        {/* Modal */}
        <div
          className="relative w-full bg-white rounded-[20px] p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-center mb-8">
            <svg
              width="104"
              height="104"
              viewBox="0 0 104 104"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_745_7794)">
                <path
                  d="M103.086 13.1014L90.8982 0.913859C90.35 0.304688 89.5578 0 88.7656 0H82.4688L52 15.2344L21.5312 0H9.14062C4.08261 0 0 4.08281 0 9.14062V94.8594C0 99.9168 4.08261 104 9.14062 104H21.5312L52 94.8594L82.4688 104H94.8594C99.9174 104 104 99.9168 104 94.8594V15.2344C104 14.4422 103.695 13.65 103.086 13.1014Z"
                  fill="url(#paint0_linear_745_7794)"
                />
                <path
                  d="M76.375 82.6719H27.625C24.2734 82.6719 21.5312 85.4141 21.5312 88.7656V104H82.4688V88.7656C82.4688 85.4141 79.7266 82.6719 76.375 82.6719ZM67.2344 58.0938C67.2344 49.6939 60.4027 42.8594 52 42.8594C43.5973 42.8594 36.7656 49.6939 36.7656 58.0938C36.7656 66.4936 43.5973 73.3281 52 73.3281C60.4027 73.3281 67.2344 66.4936 67.2344 58.0938ZM21.5312 0V27.4219C21.5312 30.7734 24.2734 33.5156 27.625 33.5156H76.375C79.7266 33.5156 82.4688 30.7734 82.4688 27.4219V0H21.5312ZM73.3281 21.3281C73.3281 23.0122 71.9654 24.375 70.2812 24.375C68.5971 24.375 67.2344 23.0122 67.2344 21.3281V15.2344C67.2344 13.5503 68.5971 12.1875 70.2812 12.1875C71.9654 12.1875 73.3281 13.5503 73.3281 15.2344V21.3281Z"
                  fill="url(#paint1_linear_745_7794)"
                />
              </g>
              <defs>
                <linearGradient
                  id="paint0_linear_745_7794"
                  x1="52"
                  y1="104"
                  x2="52"
                  y2="0"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#3B82F6" />
                  <stop offset="1" stopColor="#9FC4FF" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_745_7794"
                  x1="52"
                  y1="104"
                  x2="52"
                  y2="0"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#D0E2FF" />
                  <stop offset="0.997" stopColor="#F4F8FF" />
                </linearGradient>
                <clipPath id="clip0_745_7794">
                  <rect width="104" height="104" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-3">
            Save Your Progress
          </h2>

          {/* Description */}
          <p className="text-base text-gray-600 text-center leading-7 mb-8 px-4">
            Enter your email to save your project. We'll send you a magic link to access it anytime.
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
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-base rounded-lg transition-colors"
            >
              Save Progress
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
}
