import { cn } from "@phunq/utils";
export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="191"
      height="191"
      viewBox="0 0 191 191"
      fill="none"
      className={cn("h-10 w-10 text-black", className)}
    >
      <g clipPath="url(#clip0_71_19)">
        <rect width="191" height="191" rx="95.5" fill="#7C3AED" />
        <path
          d="M50 191.479V50.3366H71.1436V66.9769H72.9539C74.209 64.8384 76.0192 62.3658 78.3846 59.559C80.75 56.7521 84.0327 54.3018 88.2322 52.2078C92.432 50.0693 97.9836 49 104.887 49C113.865 49 121.879 51.094 128.927 55.2819C135.975 59.4699 141.502 65.5067 145.508 73.3925C149.563 81.2782 151.591 90.7679 151.591 101.862C151.591 112.955 149.587 122.467 145.581 130.398C141.574 138.283 136.071 144.365 129.072 148.642C122.072 152.874 114.083 154.991 105.104 154.991C98.3456 154.991 92.8184 153.944 88.522 151.849C84.2741 149.756 80.9431 147.305 78.5294 144.498C76.1158 141.691 74.2573 139.197 72.9539 137.014H71.6505V191.479H50Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_71_19">
          <rect width="191" height="191" rx="95.5" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

// import { cn } from "@phunq/utils";
// export default function Logo({ className }: { className?: string }) {
//   return (
//     <svg
//       width="191"
//       height="191"
//       viewBox="0 0 191 191"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//       className={cn("h-10 w-10 text-black", className)}
//     >
//       <g clipPath="url(#clip0_1301_107)">
//         <path
//           fillRule="evenodd"
//           clipRule="evenodd"
//           d="M122 -14H144 9.17859 129.788 5.96937 122 3.72462V-14ZM122 3.72462C113.586 1.29941 104.695 0 95.5 0C42.7568 0 0 42.7568 0 95.5C0 148.243 42.7568 191 95.5 191C148.243 191 191 148.243 191 95.5C191 60.462 172.131 29.8311 144 13.2146V100V148H122V140.897C114.258 146.018 104.977 149 95 149C67.938 149 46 127.062 46 100C46 72.938 67.938 51 95 51C104.977 51 114.258 53.982 122 59.1034V3.72462Z"
//           fill="currentColor"
//           shapeRendering="geometricPrecision"
//         />
//       </g>
//       <defs>
//         <clipPath id="clip0_1301_107">
//           <rect width="191" height="191" rx="95.5" fill="white" />
//         </clipPath>
//       </defs>
//     </svg>
//   );
// }
