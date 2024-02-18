import BrandLogo from "@/components/BrandLogo/Index";
import React from "react";

export default function AuthenticationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen w-screen justify-center items-center">
      <BrandLogo />
      {children}
    </div>
  );
}
