import "./globals.css";
import StoreLayout from "@/components/layout/StoreLayout";
import { CartProvider } from "@/context/CartContext";

export const metadata = {
  title: "Shop | E-Commerce Store",
  description: "Browse products and shop with ease.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="business">
      <body>
        <CartProvider>
          <StoreLayout>{children}</StoreLayout>
        </CartProvider>
      </body>
    </html>
  );
}
