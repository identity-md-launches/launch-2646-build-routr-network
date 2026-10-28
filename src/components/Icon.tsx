import type { CSSProperties } from "react";

export type IconName =
  | "arrow"
  | "arrow-up"
  | "check"
  | "close"
  | "copy"
  | "code"
  | "signature"
  | "shield"
  | "route"
  | "layers"
  | "activity"
  | "wallet"
  | "chevron"
  | "download"
  | "external";
const paths: Record<IconName, string[]> = {
  arrow: ["M4 12h15", "m13 6 6 6-6 6"],
  "arrow-up": ["M6 18 18 6", "M6 6h12v12"],
  check: ["m5 12 4 4L19 6"],
  close: ["m6 6 12 12", "M18 6 6 18"],
  copy: ["M9 9h11v12H9z", "M15 5V3H3v12h2"],
  code: ["m8 7-5 5 5 5", "m16 7 5 5-5 5", "m14 4-4 16"],
  signature: ["m16 3 5 5-11 11-6 1 1-6L16 3Z", "m13 6 5 5", "M14 21h7"],
  shield: ["m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z", "m8 12 3 3 5-6"],
  route: [
    "M5 5h4a7 7 0 0 1 7 7v7",
    "M5 19h4a7 7 0 0 0 7-7V5",
    "m13 8 3-3 3 3",
    "m13 16 3 3 3-3",
  ],
  layers: ["m12 3 10 6-10 6L2 9l10-6Z", "m2 13 10 6 10-6", "m2 17 10 6 10-6"],
  activity: ["M2 12h5l3-8 4 16 3-8h5"],
  wallet: ["M3 6h16v14H3z", "M3 6V4h13v2", "M15 11h7v5h-7z", "M18 13.5h.01"],
  chevron: ["m6 9 6 6 6-6"],
  download: ["M12 3v12", "m7 10 5 5 5-5", "M4 16v5h16v-5"],
  external: ["M14 3h7v7", "m10 14 11-11", "M10 3H3v18h18v-7"],
};
export function Icon({
  name,
  className = "",
  style,
}: {
  name: IconName;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      className={`icon ${className}`}
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name].map((d, i) => (
        <path d={d} key={i} />
      ))}
    </svg>
  );
}
