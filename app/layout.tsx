import type React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { App } from "antd";
import ClientLayout from "./ClientLayout";
import { AuthProvider } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <App>
            <ClientLayout>{children}</ClientLayout>
          </App>
        </AuthProvider>
      </body>
    </html>
  );
}

export const metadata = {
  generator: "v0.dev",
};
