import React from "react";
import { SearchIcon } from "../../public/icons";

export default function SearchBar() {
  return (
    <form className="w-full flex items-center gap-2">
      <div className="px-4 flex gap-3 w-full py-2 rounded-lg border" style={{ borderColor: 'var(--accent)', background: 'var(--secondary)', color: 'var(--foreground)' }}>
        <SearchIcon />
        <input
          type="text"
          placeholder="Procure por pets, raças, localização..."
          className="focus:outline-0 bg-transparent flex-1"
          style={{ color: 'var(--foreground)' }}
        />
      </div>
    </form>
  );
}
