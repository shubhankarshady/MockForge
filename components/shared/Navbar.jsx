"use client"
import StaggeredMenu from "@/components/animations/StaggeredMenu";
import React from "react";

const menuItems = [
  { label: "Home", ariaLabel: "Go to home page", link: "/"  },
  { label: "Sign-in", ariaLabel: "Learn about us", link: "/sign-in" },
  { label: "Services", ariaLabel: "View our services", link: "/services" },
  { label: "Contact", ariaLabel: "Get in touch", link: "/contact" },
];

const socialItems = [
  { label: "Twitter", link: "https://twitter.com" },
  { label: "GitHub", link: "https://github.com" },
  { label: "LinkedIn", link: "https://linkedin.com" },
];

function Navbar() {
  return (
    <div className="absolute top-0 left-0 w-full z-20">
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials
        displayItemNumbering={true}
        menuButtonColor="#ffffff"
        openMenuButtonColor="#fff"
        changeMenuColorOnOpen={true}
        colors={["#0a0a0a", "#111111"]}
        logoUrl="/path-to-your-logo.svg"
        accentColor="#ffffff"
        onMenuOpen={() => console.log("Menu opened")}
        onMenuClose={() => console.log("Menu closed")}
      />
    </div>
  );
}

export default Navbar;