import Header from "./Header";
import Footer from "./Footer";

export default function StoreLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
