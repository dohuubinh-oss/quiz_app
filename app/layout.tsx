import type React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { AuthProvider } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}

export const metadata = {
  generator: "v0.dev",
};
