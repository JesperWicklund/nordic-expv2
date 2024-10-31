import React from "react";
import AlgLogo from "@/components/ui/AlgLogo";

export default function Header() {
  return (
    <div className="bg-[#FFF2E5] flex items-center gap-4 p-4 sm:hidden">
      <AlgLogo />
      <div className="flex flex-col">
        <p className="font-bold text-lg">Nordic</p>
        <p className="font-bold text-lg">Experiences</p>
      </div>
    </div>
  );
}
