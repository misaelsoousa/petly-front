import React from "react";
import { SearchIcon } from "../../public/icons";

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Procure por pets, raças, localização...",
}: SearchBarProps) {
  return (
    <form className="w-full flex items-center gap-2">
      <div className="px-4 flex gap-3 w-full py-2 rounded-full border border-white/30 bg-white/5 backdrop-blur-sm transition hover:border-orange-500/80" >
        <SearchIcon />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          className="focus:outline-0 bg-transparent flex-1 text-white placeholder:text-white/70"
        />
      </div>
    </form>
  );
}
