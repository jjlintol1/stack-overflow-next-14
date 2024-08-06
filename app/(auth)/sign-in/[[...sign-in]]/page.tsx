import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DevFlow - Sign In for a Developer Community",
  description: "Unlock the full potential of DevFlow. Sign in to join a vibrant developer community, ask questions, share knowledge, and grow together.",
  icons: { icon: "/assets/images/site-logo.svg" },
};

 
export default function Page() {
  return <SignIn />;
}