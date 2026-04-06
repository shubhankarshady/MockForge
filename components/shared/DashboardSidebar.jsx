"use client";

import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";

import { UserButton, useUser } from "@clerk/nextjs";
import AmbientBackground from "./AmbientBackground";

export default function DashboardSidebar({ children }) {
  const [open, setOpen] = useState(true);
  const { user } = useUser();

  const links = [
    {
      label: "Dashboard" ,
      href: "/dashboard",
      icon: <IconBrandTabler className="h-5 w-5 text-zinc-300" />,
    },
    {
      label: "Profile",
      href: "/dashboard/profile",
      icon: <IconUserBolt className="h-5 w-5 text-zinc-400" />,
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: <IconSettings className="h-5 w-5 text-zinc-400" />,
    },
    {
      label: "Logout",
      href: "/",
      icon: <IconArrowLeft className="h-5 w-5 text-zinc-400" />,
    },
  ];

  return (
    <div className="flex h-screen w-full bg-[#050505]">
      {/* ================= SIDEBAR ================= */}
      <Sidebar
        open={open}
        setOpen={setOpen}
        className="bg-[#0a0a0a] border-r border-white/5"
      >
        <SidebarBody
          className="
            justify-between
            gap-10
            bg-[#0a0a0a]
            text-neutral-200
          "
        >
          {/* ---------- NAV LINKS ---------- */}
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink
                key={idx}
                link={link}
                className="
                     !text-neutral-200
                   hover:!text-white
                     hover:bg-white/5
                      rounded-lg
                    transition-all duration-200
  "
              />
            ))}
          </div>

          {/* ---------- USER PROFILE ---------- */}
          <div
            className="
              border-t border-white/5
              pt-4
              flex items-center gap-3
              p-2
              rounded-lg
              hover:bg-white/5
              transition-all
            "
          >
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox:
                    "h-10 w-10 ring-1 ring-neutral-700 hover:ring-white/50 transition-all",

                  userButtonPopoverCard:
                    "bg-[#0a0a0a] border border-white/10 shadow-xl",

                  userButtonPopoverActionButton:
                    "text-neutral-300 hover:bg-white/10 hover:text-white",

                  userButtonPopoverActionButtonText: "text-neutral-300",

                  userButtonPopoverFooter: "hidden",
                },
              }}
            />

            <div className="flex flex-col overflow-hidden">
              <p className="text-sm text-zinc-200 font-medium truncate">
                {user?.fullName}
              </p>
              <p className="text-xs text-neutral-400 truncate">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        </SidebarBody>
      </Sidebar>

      {/* ================= PAGE CONTENT ================= */}
      <main className="relative flex-1 overflow-y-auto bg-[#050505] p-8 text-[#ececec]">
        <AmbientBackground />
        <div className="relative z-10 h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
