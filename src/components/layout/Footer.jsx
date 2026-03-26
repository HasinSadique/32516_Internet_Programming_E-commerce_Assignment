import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto bg-gradient-to-b from-blue-800 via-blue-700 to-blue-600 py-10 border-t border-blue-900 shadow-xl">
      <aside className="container mx-auto px-4 flex flex-col items-center text-center text-slate-100">
        <div className="flex items-center gap-2 mb-2">
          <svg
            className="w-8 h-8 text-blue-300"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <rect width="32" height="32" rx="8" fill="#3B82F6" />
            <path
              d="M8 18l4.5-6L18 22l6-10"
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-2xl font-bold tracking-tight text-white">
            AutoTech Solutions
          </span>
        </div>
        <p className="opacity-80 text-slate-100 mb-3">
          Empowering the automotive industry with leading tech solutions.
        </p>
        <div className="flex flex-wrap justify-center gap-6 mt-2 mb-6">
          <Link
            href="/"
            className="text-sky-200 hover:text-white transition font-semibold"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="text-sky-200 hover:text-white transition font-semibold"
          >
            Products
          </Link>
          <Link
            href="/cart"
            className="text-sky-200 hover:text-white transition font-semibold"
          >
            Cart
          </Link>
          <Link
            href="/order_status"
            className="text-sky-200 hover:text-white transition font-semibold"
          >
            Order Status
          </Link>
        </div>
        <div className="mt-2 flex justify-center">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 shadow transition-all focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.1}
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
              />
            </svg>
            Login as Admin
          </Link>
        </div>
        <p className="mt-6 text-xs opacity-60 text-slate-200">
          © {new Date().getFullYear()} AutoTech Solutions. All rights reserved.
        </p>
      </aside>
    </footer>
  );
}
