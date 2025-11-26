"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function ClientNavWrapper() {
  const pathname = usePathname();

  // Hide navbar on login route or any nested login route
  if (!pathname) return null;
  if (pathname.startsWith("/login")) return null;
  return <Navbar />;
}
