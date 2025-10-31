"use client";

import { ThemeProvider, ThemeProviderProps } from "next-themes";

export default function ThemeProviderClient({
  children,
  ...props
}: Omit<ThemeProviderProps, "children"> & { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      enableColorScheme
      disableTransitionOnChange
      {...props}>
      {children}
    </ThemeProvider>
  );
}
