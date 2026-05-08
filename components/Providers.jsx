"use client";

import { DataProvider } from "@/contexts/DataContext";

export default function Providers({ children }) {
  return <DataProvider>{children}</DataProvider>;
}
