import React from "react";
import SearchBar from "./SearchBar";

const navItems = [
  { label: "Home", href: "#" },
  { label: "Cadastrar Pet", href: "#lares" },
  { label: "Sobre", href: "#sobre" },
  { label: "Login", href: "#login" },
];

export default function Navbar() {
  return (
    <nav className="w-full bg-secondary shadow-md dark:bg-secondary">
      <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold" style={{ color: 'var(--primary)' }}>Petly</span>
        </div>
        <div className="w-full md:w-1/2 order-3 md:order-none">
          <SearchBar />
        </div>
        <ul className="flex gap-4 md:gap-8 items-center justify-center mt-2 md:mt-0">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="font-medium transition-colors"
                style={{ color: 'var(--accent)' }}
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
