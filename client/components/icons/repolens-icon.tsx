import type { SVGProps } from "react";

export function RepoLensIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M4 5.5A2.5 2.5 0 0 1 6.5 3H17a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6.5A2.5 2.5 0 0 1 4 18.5v-13Z"
        fill="currentColor"
        opacity=".15"
      />
      <path
        d="M7 7h7M7 11h5M7 15h3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle
        cx="16.5"
        cy="15.5"
        r="3.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="m19 18 2 2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}