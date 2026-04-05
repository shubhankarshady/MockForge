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
    <div className="flex h-screen w-full bg-black">
      {/* ================= SIDEBAR ================= */}
      <Sidebar
        open={open}
        setOpen={setOpen}
        className="bg-neutral-950 border-r border-neutral-800"
      >
        <SidebarBody
          className="
            justify-between
            gap-10
            bg-neutral-950
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
                     hover:bg-neutral-800
                      rounded-lg
                    transition-all duration-200
  "
              />
            ))}
          </div>

          {/* ---------- USER PROFILE ---------- */}
          <div
            className="
              border-t border-neutral-800
              pt-4
              flex items-center gap-3
              p-2
              rounded-lg
              hover:bg-neutral-900
              transition-all
            "
          >
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox:
                    "h-10 w-10 ring-1 ring-neutral-700 hover:ring-[#5227FF] transition-all",

                  userButtonPopoverCard:
                    "bg-neutral-900 border border-neutral-800 shadow-xl",

                  userButtonPopoverActionButton:
                    "text-neutral-300 hover:bg-neutral-800 hover:text-white",

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
      <main className="flex-1 overflow-y-auto bg-black p-8">{children}</main>
    </div>
  );
}
