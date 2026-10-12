import type { Metadata } from 'next';
import './globals.css';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';

export const metadata: Metadata = {
  title: 'VFT Farms | Nông sản & Thực phẩm sạch chuẩn VietGAP',
  description: 'Hệ thống Thương mại Điện tử bán lẻ nông sản / thực phẩm sạch VFT Farms (vftfarms.com). 100% nông sản sạch chuẩn VietGAP & VfSC.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="h-full">
      <body className="min-h-full flex flex-col bg-[#F9FBF9] text-gray-900 antialiased font-sans">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
