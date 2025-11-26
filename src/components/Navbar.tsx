"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { Logo } from "../../public/icons";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

interface NavbarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export default function Navbar({ searchValue, onSearchChange }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = useMemo(
    () => [
      { label: "Cadastrar pet", href: "/cadastrar-pet" },
      ...(isMounted && user ? [{ label: "Dashboard", href: "/dashboard" }] : []),
    ],
    [user, isMounted],
  );

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`w-full fixed top-0 left-0 z-30 transition-all duration-500 ${
        scrolled
          ? "bg-[#111]/85 backdrop-blur-xl shadow-lg shadow-black/30"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center">
            <Logo className="h-10 w-auto drop-shadow-lg" />
          </Link>
          <div className="hidden md:flex gap-6 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-white/70 hover:text-white transition-colors font-medium tracking-wide"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsOpen((v) => !v)}
            aria-label="Abrir menu"
            aria-expanded={isOpen}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-white/80 hover:text-white bg-transparent"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
              <path
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Mobile menu overlay */}
        {isOpen && (
          <div className="md:hidden fixed inset-0 z-40">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute top-14 right-4 left-4 bg-[#0b0b0d] border border-white/10 rounded-xl p-4 shadow-lg">
              <div className="flex flex-col gap-4">
                <div>
                  {typeof onSearchChange === "function" && (
                    <SearchBar value={searchValue} onChange={onSearchChange} />
                  )}
                </div>
                <nav className="flex flex-col gap-3">
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="text-white/70 hover:text-white font-medium py-2 px-3 rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <div className="pt-2 border-t border-white/6">
                  {isMounted && user ? (
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-sm">
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-xs text-white/60 uppercase">{user.role}</p>
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setIsOpen(false);
                        }}
                        className="px-4 py-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition"
                      >
                        Sair
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      className="block px-4 py-2 rounded-full bg-orange-500 text-black font-semibold text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      Entrar
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 w-full md:max-w-md md:order-none hidden lg:flex">
          {typeof onSearchChange === "function" && (
            <SearchBar value={searchValue} onChange={onSearchChange} />
          )}
        </div>

        <div className="lg:flex items-center justify-between gap-4 text-white hidden">
        {isMounted && user ? (
            <>
              <div className="text-right">
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-xs text-white/60 uppercase tracking-wide">
                  {user.role}
                </p>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition text-sm"
              >
                Sair
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-full bg-orange-500 text-black font-semibold hover:bg-orange-500-dark transition"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
}