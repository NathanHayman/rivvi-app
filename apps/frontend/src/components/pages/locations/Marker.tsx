export default function CustomMarker({ index }: { index: number }) {
  return (
    <div className="relative h-8 w-8">
      <svg
        className="relative h-8 w-8 text-white dark:text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="rgb(63 131 248)"
        viewBox="0 0 17 21"
      >
        <g
          stroke="rgb(30 66 159)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
        >
          <span className="sr-only">Location icon</span>
          {/* put a number in the circle if there are multiple locations */}
          <path d="M13.8 12.938h-.01a7 7 0 1 0-11.465.144h-.016l.141.17c.1.128.2.252.3.372L8 20l5.13-6.248c.193-.209.373-.429.54-.66l.13-.154Z" />
        </g>
      </svg>
      <span className="absolute bottom-0 left-0 right-0 top-1.5 w-full pr-0.5 text-center text-xs font-medium tracking-tighter text-white">
        {index + 1}
      </span>
    </div>
  );
}
