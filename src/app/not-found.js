import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-4xl font-bold text-slate-900">404</h1>
      <p className="text-slate-600">This page could not be found.</p>
      <Link
        href="/"
        className="inline-flex rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-blue-700"
      >
        Go home
      </Link>
    </div>
  );
}
