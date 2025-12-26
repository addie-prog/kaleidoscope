"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { FormEvent, useEffect, useState } from "react";
import { signIn } from "next-auth/react";

import { useRouter } from "next/navigation";

type Obj = {
  [key: string]: string
}

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [formValues, setFormValues] = useState<Obj>({});
  const [error, setError] = useState<Obj>({});

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let error: Obj = {};

    setError({});

    if (!formValues?.email?.trim()) {
      error.email = "Email is required";
    }

    if (!formValues?.password?.trim()) {
      error.password = "Password is required";
    }
    setError(error);

    if (formValues?.email?.trim() && formValues?.password?.trim()) {
      const res = await signIn("credentials", {
        redirect: false,
        email: formValues?.email,
        password: formValues?.password,
      });

      if (res?.ok) {
        router.push("/sessions");
      } else {
        setError({["auth"]:"Invalid credentials!"})
      }
    } else {
      return false;
    }

  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
                

            <form onSubmit={handleSubmit}>
              
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <input onFocus={() => setError({ ...error, ["email"]: "", ["auth"]: "" })} placeholder="info@gmail.com" type="email" name="email"
                    className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                    onChange={(e) => setFormValues({ ...formValues, ["email"]: e.target.value })}
                  />
                  {error?.email && <p className="lg:text-sm text-xs text-red-500">{error?.email}</p>}

                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <input
                      onFocus={() => setError({ ...error, ["password"]: "", ["auth"]: "" })}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                      name="password"
                      onChange={(e) => setFormValues({ ...formValues, ["password"]: e.target.value })}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                  {error?.password && <p className="lg:text-sm text-xs text-red-500" >{error?.password}</p>}
                  {error?.auth && <p className="lg:text-sm text-xs text-red-500">{error?.auth}</p>} 
                </div>
                <div>
                  <button type="submit" className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600" >
                    Sign in
                  </button>
                </div>
                                    

              </div>
            </form>

            {/* <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {""}
                <Link
                  href="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
