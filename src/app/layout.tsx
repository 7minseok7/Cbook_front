import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/theme-toggle";

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2"
});

export const metadata: Metadata = {
  title: "StudyMAIT",
  description: "공부의 습관화.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pretendard.className}`}>
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
      >
        {children}
        <ModeToggle />  
      </ThemeProvider>
      </body>
    </html>
  );
}
