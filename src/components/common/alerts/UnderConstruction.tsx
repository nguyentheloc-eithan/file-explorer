const UnderConstruction = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      {/* Custom SVG illustration */}
      <svg
        className="w-32 h-32 mb-4"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        {/* Background shape */}
        <rect
          x="20"
          y="25"
          width="60"
          height="50"
          fill="#E5E7EB"
          rx="4"
        />
        <path
          d="M30 35 H70 M30 45 H65 M30 55 H50"
          stroke="#9CA3AF"
          strokeWidth="2"
        />

        {/* Wrench icon */}
        <circle
          cx="50"
          cy="50"
          r="12"
          stroke="#FDB913"
          strokeWidth="3"
        />
        <path
          d="M45 55 L55 45"
          stroke="#FDB913"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Orange progress bar */}
        <rect
          x="25"
          y="75"
          width="50"
          height="5"
          fill="#FB923C"
          rx="2"
        />
      </svg>

      {/* Text */}
      <h2 className="text-lg font-semibold text-gray-800">
        This page is under construction
      </h2>
      <p className="text-sm text-gray-600">
        We’re working hard to bring you something awesome. Stay tuned!
      </p>
    </div>
  );
};

export default UnderConstruction;
