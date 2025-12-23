'use client';

import { useEffect, useState } from 'react';
import ToastModal from '../CustomToast';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

type PrincipleProps = {
    id: string;
    name: string;
    description: string;
    color: string;
    bgcolor: string;
    percentage: number;
    checked: boolean;
    layersVisible: boolean;
    layers: any[];
}

type objectType = {
    [key: string | number]: any
}

type props = {
    onNext: (value: number) => void;
    selectedValues: (value: any) => void;
    Principles: (value: PrincipleProps) => void;
    ResetPrinciples: (value: PrincipleProps) => void;
    allValues: objectType;
    utmSource: string;
}

type TierObject = {
    id: string;
    createdTime: string;
    fields: {
        "Tier ID": string;
        "Display Name": string;
        "Budget Min": number;
        "Budget Max": number;
        "Display Order": number;
    };
};


export default function BudgetTool({ onNext, selectedValues, Principles, allValues, utmSource,ResetPrinciples }: props) {
    const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);
    const [budgetTier, setBudgetTier] = useState<TierObject[]>([]);
    const [showStage, setShowStage] = useState<string>(allValues?.stage ?? "");
    const [loader, setLoader] = useState<boolean>(false);
    const [formValues, setFormValues] = useState<objectType>(allValues ? { ...allValues, ["tier"]: allValues?.tier } : {});
    const [error, setError] = useState<string | Array<string>>("");
    const [budgetError, setBudgetError] = useState<string>("");
    const [showToast, setShowToast] = useState<boolean>(false);
    const utm_source = utmSource;



    const categories = [
        {
            id: 'ai-ml',
            tag: "ai_ml",
            disabled: false,
            name: 'AI/ML Models',
            icon: (
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="mask0_328_141" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="8" y="8" width="42" height="40">
                        <path d="M35.0007 44.3333C37.8007 35.7513 40.8947 32.655 49.0007 30.3333C40.8947 28.0116 37.8007 24.9153 35.0007 16.3333C32.2007 24.9153 29.1067 28.0116 21.0007 30.3333C29.1067 32.655 32.2007 35.7513 35.0007 44.3333ZM16.334 23.3333C17.734 19.04 19.281 17.493 23.334 16.3333C19.281 15.1736 17.734 13.6266 16.334 9.33331C14.934 13.6266 13.387 15.1736 9.33398 16.3333C13.387 17.493 14.934 19.04 16.334 23.3333ZM19.834 46.6666C20.534 44.52 21.3063 43.7476 23.334 43.1666C21.3063 42.5856 20.534 41.8133 19.834 39.6666C19.134 41.8133 18.3617 42.5856 16.334 43.1666C18.3617 43.7476 19.134 44.52 19.834 46.6666Z" className="stroke-[#3B82F6] group-hover:stroke-white" strokeWidth="2" strokeLinejoin="round" />
                    </mask>
                    <g mask="url(#mask0_328_141)">
                        <rect x="-29.166" y="-28" width="116.667" height="116.667" className={`${formValues?.category == 'ai-ml' ? "fill-white" : "fill-[#6B7280]"} group-hover:fill-white`} />
                        <rect x="7" y="7" width="18.6667" height="18.6667" className={`${formValues?.category == 'ai-ml' ? "fill-none" : "fill-[#3B82F6]"} group-hover:fill-none`} />
                    </g>
                </svg>
            ),
            hoverText: "Algorithms that learn from data to make predictions."
        },
        {
            id: 'chatbot',
            name: 'Chatbot / Conversational AI',
            disabled: true,
            icon: (
                <>


                    <svg className={`block transition-colors duration-500`} width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M44.3327 37.3333H38.441C38.0932 37.3336 37.7499 37.4125 37.4368 37.564C37.1236 37.7155 36.8488 37.9357 36.6327 38.2083L29.8077 46.725C29.5891 46.9984 29.3118 47.219 28.9963 47.3707C28.6809 47.5223 28.3354 47.6011 27.9854 47.6011C27.6353 47.6011 27.2898 47.5223 26.9744 47.3707C26.6589 47.219 26.3816 46.9984 26.163 46.725L19.338 38.2083C19.1217 37.9354 18.8464 37.715 18.5329 37.5635C18.2193 37.4119 17.8756 37.3333 17.5274 37.3333H11.666C7.78802 37.3333 4.66602 34.2113 4.66602 30.3333V14C4.66602 10.122 7.78802 7 11.666 7H44.3327C48.213 7 51.3327 10.122 51.3327 14V30.3333C51.3327 34.2113 48.213 37.3333 44.3327 37.3333Z" stroke="#6B7280" strokeWidth="2.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        <mask id="mask0_328_95" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="14" y="13" width="28" height="19">
                            <path d="M19.6699 23.996L20.5472 20.4773C20.6639 20.006 21.3359 20.006 21.4525 20.4773L22.3322 23.996C22.3528 24.0777 22.3951 24.1523 22.4547 24.2118C22.5143 24.2714 22.5888 24.3137 22.6705 24.3343L26.1892 25.214C26.6605 25.3307 26.6605 26.0027 26.1892 26.1193L22.6705 26.999C22.5888 27.0196 22.5143 27.0619 22.4547 27.1215C22.3951 27.1811 22.3528 27.2557 22.3322 27.3373L21.4525 30.856C21.3359 31.3273 20.6639 31.3273 20.5472 30.856L19.6675 27.3373C19.6469 27.2557 19.6046 27.1811 19.545 27.1215C19.4855 27.0619 19.4109 27.0196 19.3292 26.999L15.8105 26.1193C15.3392 26.0027 15.3392 25.3307 15.8105 25.214L19.3292 24.3343C19.4109 24.3137 19.4855 24.2714 19.545 24.2118C19.6046 24.1523 19.6469 24.0777 19.6675 23.996M35.2332 17.7333L36.1665 14L37.0999 17.7333L40.8332 18.6667L37.0999 19.6L36.1665 23.3333L35.2332 19.6L31.4999 18.6667L35.2332 17.7333Z" stroke="#6B7280" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        </mask>
                        <g mask="url(#mask0_328_95)">
                            <rect x="29.166" y="11.6667" width="14" height="14" fill="#6B7280" />
                            <rect x="11.666" y="15.1667" width="16.3333" height="18.6667" fill="#EF4444" />
                        </g>
                    </svg>


                    <svg className={`hidden transition-colors duration-500`} width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M44.3333 37.3333H38.4416C38.0938 37.3336 37.7505 37.4125 37.4374 37.564C37.1242 37.7155 36.8494 37.9357 36.6333 38.2083L29.8083 46.725C29.5897 46.9984 29.3124 47.219 28.997 47.3707C28.6815 47.5223 28.336 47.6011 27.986 47.6011C27.6359 47.6011 27.2904 47.5223 26.975 47.3707C26.6595 47.219 26.3822 46.9984 26.1636 46.725L19.3386 38.2083C19.1223 37.9354 18.8471 37.715 18.5335 37.5635C18.22 37.4119 17.8762 37.3333 17.528 37.3333H11.6666C7.78863 37.3333 4.66663 34.2113 4.66663 30.3333V14C4.66663 10.122 7.78863 7 11.6666 7H44.3333C48.2136 7 51.3333 10.122 51.3333 14V30.3333C51.3333 34.2113 48.2136 37.3333 44.3333 37.3333Z" stroke="white" strokeWidth="2.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        <mask id="mask0_115_693" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="14" y="13" width="28" height="19">
                            <path d="M19.67 23.996L20.5473 20.4773C20.664 20.006 21.336 20.006 21.4527 20.4773L22.3323 23.996C22.3529 24.0777 22.3953 24.1523 22.4548 24.2118C22.5144 24.2714 22.589 24.3137 22.6707 24.3343L26.1893 25.214C26.6607 25.3307 26.6607 26.0027 26.1893 26.1193L22.6707 26.999C22.589 27.0196 22.5144 27.0619 22.4548 27.1215C22.3953 27.1811 22.3529 27.2557 22.3323 27.3373L21.4527 30.856C21.336 31.3273 20.664 31.3273 20.5473 30.856L19.6677 27.3373C19.647 27.2557 19.6047 27.1811 19.5451 27.1215C19.4856 27.0619 19.411 27.0196 19.3293 26.999L15.8107 26.1193C15.3393 26.0027 15.3393 25.3307 15.8107 25.214L19.3293 24.3343C19.411 24.3137 19.4856 24.2714 19.5451 24.2118C19.6047 24.1523 19.647 24.0777 19.6677 23.996M35.2333 17.7333L36.1667 14L37.1 17.7333L40.8333 18.6667L37.1 19.6L36.1667 23.3333L35.2333 19.6L31.5 18.6667L35.2333 17.7333Z" stroke="#6B7280" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        </mask>
                        <g mask="url(#mask0_115_693)">
                            <rect x="29.1666" y="11.6667" width="14" height="14" fill="white" />
                            <rect x="11.6666" y="15.1667" width="16.3333" height="18.6667" fill="white" />
                        </g>
                    </svg></>


            ),
            hoverText: "Interfaces that simulate human conversation."
        },
        {
            id: 'social',
            name: 'Social Platform',
            disabled: true,
            icon: (
                <svg className="w-14 h-14" viewBox="0 0 56 56" fill="none">
                    <path
                        d="M32.7734 6.59162C19.9708 -0.784488 3.98707 8.46368 4.00001 23.2375C4.01079 35.6625 15.6465 44.8029 27.7201 41.8718M5.07192 29.6085H25.8696M5.07192 16.8146H25.8696"
                        className={`stroke-[#6B7280]`}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        fill="none"
                    />
                    <path
                        d="M19.0289 4.46942C15.583 16.8961 16.0903 30.0873 20.4804 42.2127M27.3087 4.46942C28.0183 7.01871 28.5639 9.61113 28.9414 12.2294M51.9583 52H4.51172M32.7653 51.9979H51.9605V21.8248C51.9498 21.5508 51.8319 21.2919 51.6323 21.104C51.4326 20.916 51.1671 20.8139 50.8929 20.8198H33.8329C33.5589 20.8139 33.2937 20.9161 33.0943 21.1041C32.895 21.2921 32.7776 21.551 32.7675 21.8248L32.7653 51.9979Z"
                        className={`stroke-[#6B7280]`}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        fill="none"
                    />
                    <path
                        d="M42.363 13.6162V5.93811M45.5615 28.2023H39.1624M45.5615 35.9537H39.1624M45.5615 43.7288H39.1624M37.5664 14.9339C37.6062 14.5481 37.7966 14.1936 38.0962 13.9473C38.3958 13.701 38.7805 13.5828 39.1667 13.6183H45.5637C45.9496 13.5834 46.3337 13.7018 46.6328 13.9481C46.9319 14.1943 47.122 14.5485 47.1618 14.9339V20.8197H37.5664V14.9339Z"
                        className={`stroke-[#6B7280]`}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        fill="none"
                    />
                </svg>
            ),
            hoverText: "Community-driven content platforms."
        },
        {
            id: 'fintech',
            name: 'Fintech / Payments',
            disabled: true,
            icon: (
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="mask0_328_245" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="3" y="10" width="50" height="36">
                        <path d="M36.75 35C36.2859 35 35.8408 35.1844 35.5126 35.5126C35.1844 35.8407 35 36.2859 35 36.75C35 37.2141 35.1844 37.6593 35.5126 37.9874C35.8408 38.3156 36.2859 38.5 36.75 38.5H43.75C44.2141 38.5 44.6592 38.3156 44.9874 37.9874C45.3156 37.6593 45.5 37.2141 45.5 36.75C45.5 36.2859 45.3156 35.8407 44.9874 35.5126C44.6592 35.1844 44.2141 35 43.75 35H36.75ZM3.5 19.25C3.5 16.9294 4.42187 14.7038 6.06282 13.0628C7.70376 11.4219 9.92936 10.5 12.25 10.5H43.75C46.0706 10.5 48.2962 11.4219 49.9372 13.0628C51.5781 14.7038 52.5 16.9294 52.5 19.25V36.75C52.5 39.0706 51.5781 41.2962 49.9372 42.9372C48.2962 44.5781 46.0706 45.5 43.75 45.5H12.25C9.92936 45.5 7.70376 44.5781 6.06282 42.9372C4.42187 41.2962 3.5 39.0706 3.5 36.75V19.25ZM49 21V19.25C49 17.8576 48.4469 16.5223 47.4623 15.5377C46.4777 14.5531 45.1424 14 43.75 14H12.25C10.8576 14 9.52226 14.5531 8.53769 15.5377C7.55312 16.5223 7 17.8576 7 19.25V21H49ZM7 24.5V36.75C7 38.1424 7.55312 39.4777 8.53769 40.4623C9.52226 41.4469 10.8576 42 12.25 42H43.75C45.1424 42 46.4777 41.4469 47.4623 40.4623C48.4469 39.4777 49 38.1424 49 36.75V24.5H7Z" className="fill-[#3B82F6] " />
                    </mask>
                    <g mask="url(#mask0_328_245)">
                        <rect x="-40.834" y="-36.1667" width="116.667" height="116.667" className={`fill-[#6B7280]`} />
                        <rect x="33.834" y="33.8333" width="12.8333" height="5.83333" className={`fill-[#10B981]`} />
                    </g>
                </svg>
            ),
            hoverText: "Digital financial products and services."
        },
        {
            id: 'health',
            name: 'Health Tech',
            disabled: true,
            icon: (
                <>
                    <svg className={`block w-14 h-14 text-[#6B7280] transition-colors duration-500`} viewBox="0 0 56 56" fill="none">
                        <path
                            d="M43.1654 21H38.4987M38.4987 21H33.832M38.4987 21V16.3333M38.4987 21V25.6666"
                            className="stroke-[#F59E0B] transition-colors duration-500"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                        <path className=""
                            d="M27.9994 13.006L26.7207 14.2007C26.8844 14.3759 27.0824 14.5156 27.3023 14.6111C27.5223 14.7066 27.7596 14.7559 27.9994 14.7559C28.2392 14.7559 28.4764 14.7066 28.6964 14.6111C28.9163 14.5156 29.1143 14.3759 29.278 14.2007L27.9994 13.006ZM6.18735 31.9247C6.3028 32.1281 6.45785 32.3063 6.64336 32.4488C6.82886 32.5913 7.04104 32.6951 7.26736 32.7542C7.49368 32.8133 7.72955 32.8264 7.96102 32.7927C8.19249 32.7591 8.41487 32.6794 8.61502 32.5583C8.81516 32.4373 8.989 32.2773 9.12627 32.0879C9.26354 31.8985 9.36146 31.6836 9.41422 31.4557C9.46699 31.2278 9.47354 30.9917 9.43348 30.7612C9.39343 30.5308 9.30758 30.3107 9.18102 30.114L6.18735 31.9247ZM15.2523 37.7323C15.0942 37.559 14.9029 37.4192 14.6896 37.3213C14.4764 37.2234 14.2457 37.1694 14.0111 37.1624C13.7766 37.1555 13.5431 37.1958 13.3244 37.2809C13.1058 37.366 12.9065 37.4943 12.7384 37.658C12.5703 37.8217 12.4369 38.0175 12.346 38.2338C12.2551 38.4502 12.2087 38.6825 12.2094 38.9172C12.2102 39.1518 12.2581 39.3839 12.3503 39.5996C12.4426 39.8154 12.5772 40.0104 12.7463 40.173L15.2523 37.7323ZM6.41602 21.742C6.41602 14.9637 9.37468 10.7753 13.0333 9.34033C16.685 7.91 21.7927 8.932 26.7207 14.2007L29.278 11.8113C23.706 5.852 17.147 3.97133 11.757 6.08066C6.37402 8.19 2.91602 13.9813 2.91602 21.742H6.41602ZM36.1894 46.5733C39.673 43.7477 43.845 39.9607 47.163 35.7303C50.446 31.5443 53.0827 26.6793 53.0827 21.7373H49.5827C49.5827 25.4987 47.5294 29.5867 44.4074 33.5697C41.318 37.5107 37.37 41.111 33.9867 43.855L36.1894 46.5733ZM53.0827 21.7373C53.0827 13.979 49.6247 8.18766 44.2393 6.08066C38.8493 3.969 32.2927 5.84733 26.7207 11.809L29.278 14.2007C34.206 8.932 39.3137 7.90766 42.9654 9.338C46.624 10.7707 49.5827 14.9613 49.5827 21.7373H53.0827ZM19.8093 46.5757C22.7727 48.9837 24.8307 50.75 27.9994 50.75V47.25C26.3124 47.25 25.2624 46.494 22.012 43.8573L19.8093 46.5757ZM33.9867 43.855C30.7364 46.4917 29.6863 47.25 27.9994 47.25V50.75C31.168 50.75 33.2283 48.9837 36.1917 46.5757L33.9867 43.855ZM9.18335 30.114C7.43568 27.23 6.41602 24.395 6.41602 21.742H2.91602C2.91602 25.27 4.26002 28.742 6.18735 31.9247L9.18335 30.114ZM22.012 43.8573C19.6432 41.947 17.3862 39.902 15.2523 37.7323L12.7463 40.173C14.9732 42.4429 17.3332 44.5807 19.8093 46.5757L22.012 43.8573Z"
                            fill="#6B7280"
                        />
                    </svg>
                    <svg className={`hidden transition-colors duration-500`} width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M43.1668 21H38.5002M38.5002 21H33.8335M38.5002 21V16.3333M38.5002 21V25.6667" stroke="white" strokeWidth="3" strokeLinecap="round" />
                        <path d="M28.0001 13.006L26.7214 14.2007C26.8851 14.3759 27.0831 14.5156 27.3031 14.6111C27.523 14.7066 27.7603 14.7559 28.0001 14.7559C28.2399 14.7559 28.4771 14.7066 28.6971 14.6111C28.917 14.5156 29.115 14.3759 29.2788 14.2007L28.0001 13.006ZM6.18808 31.9247C6.30353 32.1281 6.45859 32.3063 6.64409 32.4488C6.82959 32.5913 7.04177 32.6951 7.26809 32.7542C7.49442 32.8133 7.73028 32.8264 7.96175 32.7927C8.19323 32.7591 8.4156 32.6794 8.61575 32.5583C8.81589 32.4373 8.98973 32.2773 9.12701 32.0879C9.26428 31.8985 9.36219 31.6836 9.41495 31.4557C9.46772 31.2278 9.47427 30.9917 9.43421 30.7612C9.39416 30.5308 9.30831 30.3107 9.18175 30.114L6.18808 31.9247ZM15.2531 37.7323C15.095 37.559 14.9036 37.4192 14.6904 37.3213C14.4771 37.2234 14.2464 37.1694 14.0119 37.1624C13.7773 37.1555 13.5438 37.1958 13.3252 37.2809C13.1065 37.366 12.9072 37.4943 12.7392 37.658C12.5711 37.8217 12.4376 38.0175 12.3467 38.2338C12.2559 38.4502 12.2094 38.6825 12.2101 38.9172C12.2109 39.1518 12.2588 39.3839 12.351 39.5996C12.4433 39.8154 12.578 40.0104 12.7471 40.173L15.2531 37.7323ZM6.41675 21.742C6.41675 14.9637 9.37542 10.7753 13.0341 9.34033C16.6857 7.91 21.7934 8.932 26.7214 14.2007L29.2788 11.8113C23.7068 5.852 17.1477 3.97133 11.7577 6.08066C6.37475 8.19 2.91675 13.9813 2.91675 21.742H6.41675ZM36.1901 46.5733C39.6738 43.7477 43.8457 39.9607 47.1637 35.7303C50.4468 31.5443 53.0834 26.6793 53.0834 21.7373H49.5834C49.5834 25.4987 47.5301 29.5867 44.4081 33.5697C41.3187 37.5107 37.3708 41.111 33.9874 43.855L36.1901 46.5733ZM53.0834 21.7373C53.0834 13.979 49.6254 8.18766 44.2401 6.08066C38.8501 3.969 32.2934 5.84733 26.7214 11.809L29.2788 14.2007C34.2068 8.932 39.3144 7.90766 42.9661 9.338C46.6247 10.7707 49.5834 14.9613 49.5834 21.7373H53.0834ZM19.8101 46.5757C22.7734 48.9837 24.8314 50.75 28.0001 50.75V47.25C26.3131 47.25 25.2631 46.494 22.0127 43.8573L19.8101 46.5757ZM33.9874 43.855C30.7371 46.4917 29.6871 47.25 28.0001 47.25V50.75C31.1688 50.75 33.2291 48.9837 36.1924 46.5757L33.9874 43.855ZM9.18408 30.114C7.43642 27.23 6.41675 24.395 6.41675 21.742H2.91675C2.91675 25.27 4.26075 28.742 6.18808 31.9247L9.18408 30.114ZM22.0127 43.8573C19.6439 41.947 17.387 39.902 15.2531 37.7323L12.7471 40.173C14.974 42.4429 17.3339 44.5807 19.8101 46.5757L22.0127 43.8573Z" fill="white" />
                    </svg>
                </>
            ),
            hoverText: "Medical and health-related technology."
        },
        {
            id: 'other',
            name: 'Other / General',
            disabled: true,
            icon: (
                <>
                    <svg className={`block w-14 h-14`} viewBox="0 0 56 56" fill="none">
                        <circle cx="14" cy="28" r="3.5" fill="#6B7280" />
                        <circle cx="28" cy="28" r="3.5" fill="#6B7280" />
                        <circle cx="42" cy="28" r="3.5" fill="#8B5CF6" />
                    </svg>
                    <svg className={`hidden`} width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 24.5C13.0717 24.5 12.1815 24.8687 11.5251 25.5251C10.8687 26.1815 10.5 27.0717 10.5 28C10.5 28.9283 10.8687 29.8185 11.5251 30.4749C12.1815 31.1313 13.0717 31.5 14 31.5C14.9283 31.5 15.8185 31.1313 16.4749 30.4749C17.1313 29.8185 17.5 28.9283 17.5 28C17.5 27.0717 17.1313 26.1815 16.4749 25.5251C15.8185 24.8687 14.9283 24.5 14 24.5ZM24.5 28C24.5 27.0717 24.8687 26.1815 25.5251 25.5251C26.1815 24.8687 27.0717 24.5 28 24.5C28.9283 24.5 29.8185 24.8687 30.4749 25.5251C31.1313 26.1815 31.5 27.0717 31.5 28C31.5 28.9283 31.1313 29.8185 30.4749 30.4749C29.8185 31.1313 28.9283 31.5 28 31.5C27.0717 31.5 26.1815 31.1313 25.5251 30.4749C24.8687 29.8185 24.5 28.9283 24.5 28ZM38.5 28C38.5 27.0717 38.8687 26.1815 39.5251 25.5251C40.1815 24.8687 41.0717 24.5 42 24.5C42.9283 24.5 43.8185 24.8687 44.4749 25.5251C45.1312 26.1815 45.5 27.0717 45.5 28C45.5 28.9283 45.1312 29.8185 44.4749 30.4749C43.8185 31.1313 42.9283 31.5 42 31.5C41.0717 31.5 40.1815 31.1313 39.5251 30.4749C38.8687 29.8185 38.5 28.9283 38.5 28Z" fill="white" />
                        <path d="M38.5 28C38.5 27.0717 38.8688 26.1815 39.5251 25.5251C40.1815 24.8687 41.0717 24.5 42 24.5C42.9283 24.5 43.8185 24.8687 44.4749 25.5251C45.1312 26.1815 45.5 27.0717 45.5 28C45.5 28.9283 45.1312 29.8185 44.4749 30.4749C43.8185 31.1313 42.9283 31.5 42 31.5C41.0717 31.5 40.1815 31.1313 39.5251 30.4749C38.8688 29.8185 38.5 28.9283 38.5 28Z" fill="white" />
                    </svg>
                </>
            ),
            hoverText: "General responsible tech assessment"
        },
    ];

    useEffect(() => {
        if (!localStorage.getItem("kaleido_sessionId")) {
            localStorage.setItem("kaleido_sessionId", `guest_${Date.now()}`);
             storeSession();
        }
    }, []);

    const storeSession = async () => {

        const res = await fetch("/api/user-session/store-session", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sessionId: localStorage.getItem("kaleido_sessionId"),
                recordId: localStorage.getItem("sessionId") ?? "",
                userType: 'Anonymous Guest',
                DateJoined: new Date().toISOString().split("T")[0],
                UTCSource: utm_source,
                Email: formValues?.email,
                reportId: localStorage.getItem("reportId") ? localStorage.getItem("reportId") : ""
            })
        });
        const data = await res.json();

        if (data && data?.records && data?.records?.length > 0) {
            const newId = data?.records[0].id;
            localStorage.setItem("sessionId", newId);
        }

    }
    const createReport = async () => {

        const res = await fetch("/api/user-session/store-report", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                reportName: `Report_${Date.now()}`,
                sessionId: [localStorage.getItem("sessionId")],
                techType: formValues?.categoryName,
                initialBudget: Number(formValues.budget.replace(/,/g, "")),
                projectName: formValues?.projectName ?? "",
                email: formValues?.email,
                status: "Draft"
            })
        });
        const data = await res.json();

        if (data && data?.records && data?.records?.length > 0) {

            const newId = data?.records[0].id;

            const existing = localStorage.getItem("reportId");

            if (existing) {
                const ids = existing.split(",");

                if (!ids.includes(newId)) {
                    ids.push(newId);
                    localStorage.setItem("reportId", ids.join(","));
                }
            } else {
                localStorage.setItem("reportId", newId);
            }
             storeSession();
        }

    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const rawValue = e.target.value.replace(/,/g, ""); // remove commas
        const maxDigits = Math.max(
            ...budgetTier
                .filter(t => t?.fields?.["Budget Max"] != null)
                .map(t => t.fields["Budget Max"])
        )

        if(rawValue!="" && Number(rawValue) == 0){
            return
        }
        
        if (Number(rawValue) > maxDigits) {
            setBudgetError(`Maximum limit: ${toMillion(maxDigits)}`);
            return
        };

        const formatted = formatNumber(e.target.value);
        setFormValues({ ...formValues, ["budget"]: formatted, ["tier"]: "" });
    }

    function isValidEmail(value: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
    const formatNumber = (value: string) => {
        const numeric = value.replace(/\D/g, "");
        let SelectedTier: any = {};
        // add commas

        const matched = budgetTier?.find((item: any) => {
            const min = item.fields["Budget Min"];
            const max = item.fields["Budget Max"];
            const updatedBudgetTier = budgetTier.map((item: any) => {
                const min = Number(item.fields["Budget Min"]);
                const max = Number(item.fields["Budget Max"]);
                const value = Number(numeric);

                return {
                    ...item,
                    fields: {
                        ...item.fields,
                        checked: value >= min && value <= max,
                    },
                };
            });
            setBudgetTier(updatedBudgetTier);

            return Number(numeric) >= min && Number(numeric) <= max;
        });

        const lastTierMaxBudget = Math.max(
            ...budgetTier
                .filter(t => t?.fields?.["Budget Max"] != null)
                .map(t => t.fields["Budget Max"])
        );
        if (Number(numeric) > 0 && matched) {
            setBudgetError("");
            setShowStage(`${matched.fields["Display Name"]} ($${formatBudget(matched.fields["Budget Min"])}-${formatBudget(matched.fields["Budget Max"])})`);
        } else if (Number(numeric) > 0 && !matched) {
            setBudgetError(`Max. limit reached ${toMillion(lastTierMaxBudget)}`);
        } else {
            setBudgetError("");
            setShowStage("");
        }

        return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    function toMillion(value: number) {
        const m = Math.floor((value / 1_000_000) * 100) / 100;
        return `${m}${m % 1 === 0 ? "" : ""}M`;
    }
    const getBudgetTier = async () => {
        const res = await fetch("/api/budget-tier");
        const data = await res.json();
        setBudgetTier(data.records);
    }

    const getPrinciples = async () => {

        
        if ((typeof allValues?.principles == "undefined" && !allValues?.principles) || allValues?.principles?.length == 0) {
            
            setLoader(true);
            const res = await fetch("/api/principles");
            const data = await res.json();
            createReport();
            setLoader(false);
            const principles = data?.records?.map((prin: any) => ({
                    id: prin.fields["Principle ID"],
                    name: prin.fields["Display Name"],
                    description: prin.fields["Description"],
                    color: prin.fields["Color"],
                    bgcolor: "#FFFDFD",
                    percentage: 0,
                    budget: 0,
                    checked: false,
                    layersVisible: false,
                    layers: prin?.subPrinciples.map((sp: any) => ({
                        id: sp.executionLayerId,
                        budget: 0,
                        name: sp.displayName,
                        description: sp.description,
                        percentage: 0,
                        checked: false
                    }))
                }))
            Principles(principles);
            ResetPrinciples(principles);
        } else {
            createReport();
            Principles(allValues?.principles);
        }

        
        selectedValues({
            budget: formValues?.budget,
            categoryName: formValues?.categoryName,
            projectName: formValues?.projectName,
            stage: showStage?.toUpperCase(),
            category: formValues?.category ? formValues?.category : "",
            tier: formValues?.tier ? formValues.tier : budgetTier.find(
                (item: any) => item.fields.checked === true
            )?.fields["Tier ID"] ?? null,
            email: formValues?.email,
            principles: allValues?.principles?.length > 0 ? allValues?.principles : [],
            notes: allValues?.notes,
        });
    }


    useEffect(() => {
        if (budgetTier?.length == 0) { getBudgetTier(); }
    }, [budgetTier]);


    function formatBudget(num: number) {
        if (num >= 1_000_000) {
            return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
        }
        if (num >= 1_000) {
            return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
        }
        return num.toString();
    }

    return (
        <>
            <div className='w-full flex justify-end sm:px-15 px-[16px] pt-10'>
                <button className="sm:px-10 px-6 cursor-pointer flex items-center gap-[5px] text-white border-2 bg-[#3B82F6] px-5 sm:py-3 py-2 rounded-lg text-center" onClick={() => { setFormValues({}), setShowStage(""), selectedValues({}) }}>
                    <span>Reset</span>
                </button>
            </div>
            {/* Main Content */}
            <main className="mx-auto max-w-4xl px-4  lg:px-8 py-8 sm:py-12 lg:py-16">
                <ToastModal
                    open={showToast}
                    message={error}
                    onClose={() => setShowToast(false)}
                />


                {/* Title Section */}
                <div className="mb-8 sm:mb-12 text-center">
                    <h1 className="text-xl sm:text-[45px] font-bold text-gray-900 mb-3 sm:mb-4 leading-tight tracking-tight">
                        Responsible Tech Budget Evaluator
                    </h1>
                    <p className="text-sm sm:text-lg text-[#6B7280]">
                        Optimize your spending to maximize positive impact across privacy, fairness, and sustainability.
                    </p>
                </div>

                {/* Form Container */}
                <div className="flex flex-col gap-6 sm:gap-7">
                    {/* Project Name */}
                    <div
                        className="p-6 sm:p-8 rounded-xl bg-gray-50 flex flex-col gap-5"
                        style={{
                            border: '2.5px solid transparent',
                            backgroundImage: 'linear-gradient(#FFFFFF, #FFFFFF), linear-gradient(135deg, #8B5CF5 0%, #EF4444 50%, #05B5D4 75%, #0C9668 87.5%, #D68908 93.75%, #3B81F5 100%)',
                            backgroundOrigin: 'border-box',
                            backgroundClip: 'padding-box, border-box',
                        }}
                    >
                        <div className="flex flex-col gap-2">
                            <label htmlFor="projectName" className="sm:text-base text-sm font-semibold text-[#323152]">
                                Project Name
                            </label>
                            <div className="flex items-center gap-1.5 px-5 py-3.5 rounded-md border border-gray-100 bg-white">
                                <input
                                    type="text"
                                    id="projectName"
                                    value={formValues?.projectName ?? ""}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value.length === 1 && value === " ") return;
                                        setFormValues({ ...formValues, ["projectName"]: value });
                                    }}
                                    className="flex-1 text-sm font-medium text-[#323152] outline-none bg-transparent"
                                    placeholder="Enter project name"
                                />

                            </div>

                        </div>
                            <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="sm:text-base text-sm font-semibold text-[#323152]">
                                Email <span className='text-xs'>(Optional)</span>
                            </label>
                            <div className="flex items-center gap-1.5 px-5 py-3.5 rounded-md border border-gray-100 bg-white">
                                <input
                                    type="text"
                                    id="email"
                                    value={formValues?.email ?? ""}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value.length === 1 && value === " ") return;
                                        setFormValues({ ...formValues, ["email"]: value });
                                    }}
                                    className="flex-1 text-sm font-medium text-[#323152] outline-none bg-transparent"
                                    placeholder="Enter your email address"
                                />

                            </div>

                        </div>

                    </div>

                    {/* Budget Input Card */}
                    <div
                        className="p-6 sm:p-8 rounded-xl bg-gray-50"
                        style={{
                            border: '2.5px solid transparent',
                            backgroundImage: 'linear-gradient(#FFFFFF, #FFFFFF), linear-gradient(135deg, #8B5CF5 0%, #EF4444 50%, #05B5D4 75%, #0C9668 87.5%, #D68908 93.75%, #3B81F5 100%)',
                            backgroundOrigin: 'border-box',
                            backgroundClip: 'padding-box, border-box',
                        }}
                    >
                        <div className="flex flex-col gap-5">
                            <div>
                                <div className='flex flex-col gap-5'>
                            <label htmlFor="budget" className="sm:text-base text-sm font-semibold text-[#323152]">
                                What&apos;s your responsible tech budget?
                            </label>
                            <div className="flex items-center gap-1.5 px-5 py-3.5 rounded-md border border-gray-100 bg-white">
                                <span className="text-sm font-medium text-gray-900">$</span>
                                <input
                                    type="text"
                                    id="budget"
                                    value={formValues?.budget ? formValues.budget : ""}
                                    onChange={(e) => {
                                       
                                                 
                                                        handleChange(e);
                                                                                           
                                    }}
                                    className="flex-1 text-sm font-medium text-[#323152] outline-none bg-transparent"
                                    placeholder="50,000"
                                />
                                </div>
                            </div>
                            {budgetError ?

                                    <div className="mt-2 text-[#EF4444] text-xs font-semibold leading-[normal]">
                                        {budgetError}
                                    </div>

                                    : ""}
                            </div>
                            
                            {showStage ? <div className="inline-block">
                                <div className="inline-flex w-[fit-content] max-w-max items-center px-4 py-3 rounded-full bg-[#10B981]">
                                    <span className="sm:text-[15px] text-[11px] font-semibold text-white leading-[normal]">
                                        {showStage?.toUpperCase()}
                                    </span>
                                </div>
                            </div> : ""}
                        </div>
                    </div>


                    {/* Tech Categories Card */}
                    <div
                        className="p-6 sm:p-8 rounded-xl bg-gray-50 relative"
                        style={{
                            border: '2.5px solid transparent',
                            backgroundImage: 'linear-gradient(#F9FAFB, #F9FAFB), linear-gradient(135deg, #8B5CF5 0%, #EF4444 50%, #05B5D4 75%, #0C9668 87.5%, #D68908 93.75%, #3B81F5 100%)',
                            backgroundOrigin: 'border-box',
                            backgroundClip: 'padding-box, border-box',
                        }}
                    >
                        <h2 className="sm:text-base text-sm font-semibold text-[#323152] mb-6 sm:mb-7">
                            What type of tech are you building?
                        </h2>

                        {/* Categories Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    onClick={() => {
                                        if(category.disabled == false){
                                            setFormValues({ ...formValues, ['category']: category.id, ['categoryName']: category.name })
                                        }
                                        
                                    }}
                                    style={{
                                        border: category.disabled == true ? "1px solid #babcc1a1" : "",
                                        background: (formValues?.category == category.id && category.disabled == false) ? "bg-[#3B82F6]" : ""
                                    }}
                                    className={`${category.disabled == true ? "bg-gray-100 cursor-not-allowed border border-[#babcc1a1]" : "cursor-pointer hover:bg-[#3B82F6]"} ${(formValues?.category == category.id && category.disabled == false) ? "bg-[#3B82F6]" : ""} relative p-4 sm:p-5 rounded-md border-2 relative transition-all text-left group  transition-colors duration-600  border-gray-100`
                                    }
                                >
                                    {category.disabled == true && <div className="absolute top-0 left-0 flex items-center"><svg width="106" height="19" viewBox="0 0 106 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 0H106L97.5 9.5L106 19H0V0Z" fill="#EF4444"></path></svg><div className="absolute top-0 left-0 w-full h-full flex items-center justify-start pl-3"><span className="text-white text-[10px] font-semibold tracking-wide leading-none">COMING SOON</span></div></div>}


                                    <div className="flex flex-col gap-3.5 sm:gap-4 relative">
                                        <div className=" flex items-start justify-center sm:justify-between">

                                            <div className="flex-shrink-0">{category.icon}</div>

                                            <div
                                                className="absolute top-[1px] right-[1px] sm:top-[-8px] sm:right-[-8px] flex-shrink-0 w-3.5 h-3.5 rounded-full flex items-center justify-center "
                                                role="button"
                                                tabIndex={0}
                                                onMouseEnter={() => setHoveredTooltip(category.id)}
                                                onMouseLeave={() => setHoveredTooltip(null)}
                                                aria-label="More information"
                                            >
                                                <svg className={`${(formValues?.category == category.id && category.disabled == false) ? "text-white" : ""} ${category.disabled == false && "group-hover:text-white"} transition-colors duration-500  w-3.5 h-3.5`} viewBox="0 0 14 14" fill="none">
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M7 4.59381C6.39625 4.59381 5.90625 5.08381 5.90625 5.68756C5.90625 5.86161 5.83711 6.02853 5.71404 6.1516C5.59097 6.27467 5.42405 6.34381 5.25 6.34381C5.07595 6.34381 4.90903 6.27467 4.78596 6.1516C4.66289 6.02853 4.59375 5.86161 4.59375 5.68756C4.59397 5.25009 4.71345 4.82096 4.93934 4.44632C5.16523 4.07168 5.48897 3.76571 5.87576 3.56131C6.26254 3.35692 6.69773 3.26184 7.13452 3.2863C7.5713 3.31075 7.99316 3.45382 8.35471 3.70011C8.71626 3.94641 9.00383 4.28661 9.18648 4.68412C9.36913 5.08163 9.43996 5.52142 9.39135 5.95618C9.34273 6.39094 9.17651 6.80422 8.91057 7.15157C8.64463 7.49893 8.28902 7.76721 7.882 7.92756C7.80732 7.95515 7.73975 7.99909 7.68425 8.05618C7.67253 8.06777 7.66304 8.08142 7.65625 8.09643C7.6559 8.27048 7.58643 8.43726 7.46311 8.56009C7.33979 8.68291 7.17274 8.75172 6.99869 8.75137C6.82464 8.75102 6.65786 8.68155 6.53503 8.55823C6.41221 8.43491 6.3434 8.26786 6.34375 8.09381C6.34375 7.33693 6.95275 6.88193 7.40075 6.70606C7.63827 6.61309 7.83582 6.44003 7.95924 6.21681C8.08267 5.9936 8.1242 5.73427 8.07665 5.48368C8.02911 5.23309 7.89548 5.00699 7.69888 4.84449C7.50228 4.682 7.25506 4.59332 7 4.59381Z"
                                                        fill="currentColor"
                                                    />
                                                    <path
                                                        d="M7 10.9375C7.23206 10.9375 7.45462 10.8453 7.61872 10.6812C7.78281 10.5171 7.875 10.2946 7.875 10.0625C7.875 9.83044 7.78281 9.60788 7.61872 9.44378C7.45462 9.27969 7.23206 9.1875 7 9.1875C6.76794 9.1875 6.54538 9.27969 6.38128 9.44378C6.21719 9.60788 6.125 9.83044 6.125 10.0625C6.125 10.2946 6.21719 10.5171 6.38128 10.6812C6.54538 10.8453 6.76794 10.9375 7 10.9375Z"
                                                        fill="currentColor"
                                                    />
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M7 14C7.91925 14 8.8295 13.8189 9.67878 13.4672C10.5281 13.1154 11.2997 12.5998 11.9497 11.9497C12.5998 11.2997 13.1154 10.5281 13.4672 9.67878C13.8189 8.8295 14 7.91925 14 7C14 6.08075 13.8189 5.1705 13.4672 4.32122C13.1154 3.47194 12.5998 2.70026 11.9497 2.05025C11.2997 1.40024 10.5281 0.884626 9.67878 0.532843C8.8295 0.18106 7.91925 -1.36979e-08 7 0C5.14348 2.76642e-08 3.36301 0.737498 2.05025 2.05025C0.737498 3.36301 0 5.14348 0 7C0 8.85652 0.737498 10.637 2.05025 11.9497C3.36301 13.2625 5.14348 14 7 14ZM7 12.5C8.45869 12.5 9.85764 11.9205 10.8891 10.8891C11.9205 9.85764 12.5 8.45869 12.5 7C12.5 5.54131 11.9205 4.14236 10.8891 3.11091C9.85764 2.07946 8.45869 1.5 7 1.5C5.54131 1.5 4.14236 2.07946 3.11091 3.11091C2.07946 4.14236 1.5 5.54131 1.5 7C1.5 8.45869 2.07946 9.85764 3.11091 10.8891C4.14236 11.9205 5.54131 12.5 7 12.5Z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                            </div>
                                        </div>



                                        <div className={`${formValues?.category == category.id && category.disabled == false ? "text-white" : "text-[#6B7280]"} ${category.disabled == false && "group-hover:text-white"} sm:text-left text-center text-sm font-medium`}>{category.name}</div>

                                        {hoveredTooltip === category.id && (
                                            <div className="absolute sm:-right-7 -right-5 sm:top-6 top-8 mt-0 w-72 sm:w-80 z-50 opacity-0 animate-fadeIn pointer-events-none">
                                                <div className="relative bg-white rounded-md border border-gray-200 shadow-lg pt-5">


                                                    {/* Gray thin border */}
                                                    <div
                                                        className="absolute -top-[13px] right-[13px] w-0 h-0
                            border-l-[14px] border-r-[14px] border-b-[14px]
                            border-l-transparent border-r-transparent border-b-gray-200">
                                                    </div>

                                                    {/* White inner arrow */}
                                                    <div
                                                        className="absolute -top-[12px] right-[14px] w-0 h-0
                            border-l-[13px] border-r-[13px] border-b-[13px]
                            border-l-transparent border-r-transparent border-b-white">
                                                    </div>


                                                    <div className="px-4 pb-4">
                                                        <h3 className="font-semibold text-gray-900 text-base leading-snug mb-1">
                                                            {category.name}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 leading-relaxed">
                                                            {category.hoverText}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Continue Button */}
                    <button onClick={() => {
                        
                        if (formValues?.budget && formValues?.category && (typeof formValues?.email!="undefined" && formValues?.email && isValidEmail(formValues?.email) || !formValues?.email) && !loader) {
                            getPrinciples();
                        } else if (formValues?.email && !isValidEmail(formValues?.email)) {
                            setError("Please enter valid email address");
                            setShowToast(true);
                        } else if (!formValues?.budget && !formValues?.category) {
                            setError([
                                "Please select tech budget",
                                "What type of tech are you building?"
                                ]);
                            setShowToast(true);
                        } else if (!formValues?.budget && formValues?.category) {
                            setError("Please select tech budget");
                            setShowToast(true);
                        } else if (formValues?.budget && !formValues?.category) {
                            setError("What type of tech are you building?");
                            setShowToast(true);
                        } else {
                            setError([
                                    "Please select tech budget",
                                    "What type of tech are you building?"
                                    ]);
                            setShowToast(true);
                        }
                       
                    }
                    } className={`cursor-pointer flex items-center justify-center gap-2.5 px-10 sm:py-4 py-3 rounded-lg bg-[#3B82F6]`}>
                        {!loader ? <>
                            <span className="text-base font-semibold text-white">Continue</span>
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M15.4286 16.5714L20 12M20 12L15.4286 7.39539M20 12H5.14286"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </>
                            : <span className="text-base font-semibold text-white">Processing...</span>
                        }

                    </button>
                </div>
            </main>
            <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 300ms ease-in-out forwards;
        }
      `}</style>
        </>
    );
}
