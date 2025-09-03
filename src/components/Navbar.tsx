"use client" // Adicione essa linha para que o componente possa usar Hooks do React
import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import { Logo } from "../../public/icons";

const navItems = [
  { label: "Home", href: "#" },
  { label: "Cadastrar Pet", href: "#lares" },
  { label: "Sobre", href: "#sobre" },
  { label: "Login", href: "#login" },
];

export default function Navbar() {
  // 1. Crie um estado para controlar o fundo da navbar
  const [scrolled, setScrolled] = useState(false);

  // 2. Use useEffect para adicionar e remover o listener de scroll
  useEffect(() => {
    const handleScroll = () => {
      // Verifique se a página foi rolada mais do que 20 pixels
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    // Adiciona o listener quando o componente é montado
    window.addEventListener("scroll", handleScroll);

    // Remove o listener quando o componente é desmontado para evitar vazamento de memória
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]); // A dependência `scrolled` garante que o efeito só seja executado quando necessário

  // 3. Use uma classe condicional para aplicar o estilo de acordo com o estado
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
              <a
                href={item.href}
                className="font-medium transition-colors text-white"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}