import { Metadata } from "next";
import { SignUpForm } from "@/features/auth/components/sign-up-form";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign Up | Mzansi Footwear Admin",
  description: "Create your Mzansi Footwear admin account.",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
