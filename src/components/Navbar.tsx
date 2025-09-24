"use client" // Adicione essa linha para que o componente possa usar Hooks do React
import React, { useState, useEffect } from "react";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { Logo } from "../../public/icons";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Cadastrar Pet", href: "/cadastrar-pet" },
  { label: "Sobre", href: "#sobre" },
  { label: "Login", href: "/login" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const navClass = `w-full fixed top-0 left-0 z-20 transition-colors duration-300 ${
    scrolled ? 'bg-purple-700' : 'bg-transparent'
  }`;

  return (
    <nav className={navClass}>
      <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between">
          <Logo className="h-16"/>
        </div>
        <div className="w-full md:w-1/2 order-3 md:order-none">
          <SearchBar />
        </div>
        <ul className="flex gap-4 md:gap-8 items-center justify-center mt-2 md:mt-0">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="font-medium transition-colors text-white hover:text-primary"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}