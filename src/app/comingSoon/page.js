export default function ComingSoon() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white bg-opacity-80 rounded-xl shadow-lg px-10 py-14 flex flex-col items-center">
        <svg
          className="w-20 h-20 text-blue-500 mb-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 48 48"
        >
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="#dbeafe"
          />
          <path
            d="M24 14v10l6 6"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-700 text-center mb-4 tracking-tight">
          Coming Soon!!
        </h1>
        <p className="text-lg text-blue-800 text-center  max-w-md">
          Please check again after{" "}
          <span className="text-red-500 font-bold">
            24th May 2026, 11:59 pm
          </span>
          .
          {/* <br />
          <br />
          Stay tuned for updates! */}
        </p>
      </div>
    </div>
  );
}
