import type { Metadata } from "next";
import "./globals.css";
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";
import { CartDrawer } from "../components/cart/CartDrawer";
import { AuthSessionProvider } from "../components/common/AuthSessionProvider";
import { FloatingContactWidget } from "../components/common/FloatingContactWidget";

export const metadata: Metadata = {
  title: "VFT Farms | Nông sản & Thực phẩm sạch chuẩn VietGAP",
  description:
    "Hệ thống Thương mại Điện tử bán lẻ nông sản / thực phẩm sạch VFT Farms (vftfarms.com). 100% nông sản sạch chuẩn VietGAP & VfSC.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-[#F9FBF9] text-gray-900 antialiased font-sans"
      >
        <AuthSessionProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <FloatingContactWidget />
        </AuthSessionProvider>
      </body>
    </html>
  );
}
