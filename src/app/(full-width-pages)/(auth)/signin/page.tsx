import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Next.js SignIn Page | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Signin Page TailAdmin Dashboard Template",
};

export default async function SignIn() {
  const session = await getServerSession(authOptions);

  //  If user is already logged in
  if (session) {
    redirect("/sessions"); // or /sessions
  }
  return <SignInForm />;
}
