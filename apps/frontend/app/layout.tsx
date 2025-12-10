import type { Metadata } from "next";
import { Poppins, Roboto, Inter, Montserrat } from "next/font/google";
import { ThemeToggle } from "../components/ui/theme-toggle";
import { ToastContainer } from "react-toastify";
import StoreProvider from "@/components/providers/store-provider";
import ReactQueryProvider from "@/components/providers/query-provider";
import AuthProvider from "@/components/providers/auth-provider";
import "./globals.css";
import RBACProvider from "@/components/providers/rbac-provider";
import { Suspense } from "react";
import Loading from "./loading";
import ThemeProvider from "@/components/providers/theme-provider";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const montserrat = Montserrat({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "SmartHMM",
  description: "SmartHMM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        className={`
          ${poppins.variable}
          ${roboto.variable}
          ${inter.variable}
          ${montserrat.variable}
          antialiased overflow-x-hidden`}
      >
        <ReactQueryProvider>
          <StoreProvider>
            <AuthProvider>
              <RBACProvider>
                <ThemeProvider>
                  <div className="fixed top-2 right-2 z-4">
                    <ThemeToggle />
                  </div>
                  <Suspense fallback={<Loading />}>{children}</Suspense>
                  <ToastContainer />
                </ThemeProvider>
              </RBACProvider>
            </AuthProvider>
          </StoreProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
