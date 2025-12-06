import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/context/theme-context";
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HealthVault Pro - AI-Powered Personal Health Record",
  description: "Secure personal health records and telemedicine platform powered by AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
