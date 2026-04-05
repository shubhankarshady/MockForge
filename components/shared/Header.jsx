"use client"

import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

function Header() {
  const path = usePathname();

  return (
    <div className="flex p-4 items-center justify-between bg-secondary shadow-md">
      <Image src="/logo.svg" width={160} height={100} alt="logo" />

      <ul className="hidden md:flex gap-6">
        <li
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer
          ${path === "/dashboard" ? "text-primary font-bold" : ""}`}
        >
          Dashboard
        </li>

        <li
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer
          ${path === "/dashboard/how-it-works" ? "text-primary font-bold" : ""}`}
        >
          How it works?
        </li>
      </ul>

      <UserButton />
    </div>
  );
}

export default Header;