import Image from "next/image";

interface ToastModalProps {
  message: string | Array<string>;
  open: boolean;
  onClose: () => void;
}

const ToastModal = ({ message, open, onClose }: ToastModalProps) => {
 
  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300
        ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
      `}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300
          ${open ? "opacity-100" : "opacity-0"}
        `}
      />

      <div
        className={`absolute lg:w-[400px] w-[340px] lg:top-6 top-4 lg:right-6 right-3 transform transition-all duration-300 ease-out
          ${open ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
        `}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-[#EF4444] text-white p-3 rounded-lg shadow-lg"
        >
          <div className="flex items-start gap-[7px]">
            <Image
              src="/validIcon.png"
              width={15}
              height={15}
              alt="ICON"
              className="mt-[4px]"
            />

            <div className="flex-1">
              <h4 className="text-sm font-semibold">Validation Error</h4>
              {(typeof message == "object") ? 
              <ul className="list-disc pl-3 text-sm">
                {message?.map((m, i)=>
                   <li key={i}>{m}</li>
                )}               
              </ul>
              :<p className="sm:text-sm text-xs">{message}</p>

              }
              
            </div>

            <button
              onClick={onClose}
              className="ml-2 text-white cursor-pointer"
            >
              ✖
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToastModal;
