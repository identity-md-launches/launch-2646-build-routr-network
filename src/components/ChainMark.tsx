export type ChainKey =
  | "ethereum"
  | "bnb"
  | "base"
  | "arbitrum"
  | "optimism"
  | "polygon"
  | "solana"
  | "avalanche"
  | "linea";
export function ChainMark({
  chain,
  className = "",
}: {
  chain: ChainKey;
  className?: string;
}) {
  return (
    <span
      className={`chain-mark chain-${chain} ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 32 32" fill="none">
        {chain === "ethereum" && (
          <>
            <path d="m16 3-8 13 8 5 8-5L16 3Z" fill="#c5cbe4" />
            <path d="m16 3 8 13-8-3V3Z" fill="#929bbf" />
            <path d="m8 18 8 11 8-11-8 5-8-5Z" fill="#c5cbe4" />
          </>
        )}
        {chain === "bnb" && (
          <g fill="#f3ba2f">
            <path d="m16 3 5 5-3 3-2-2-2 2-3-3 5-5Zm-8 8 3 3-2 2 2 2-3 3-5-5 5-5Zm16 0 5 5-5 5-3-3 2-2-2-2 3-3ZM16 13l3 3-3 3-3-3 3-3Zm-2 8 2 2 2-2 3 3-5 5-5-5 3-3Z" />
          </g>
        )}
        {chain === "base" && (
          <>
            <circle cx="16" cy="16" r="13" fill="#3b6dff" />
            <path d="M3 16h19" stroke="white" strokeWidth="3" />
          </>
        )}
        {chain === "arbitrum" && (
          <>
            <path
              d="m16 2 12 7v14l-12 7-12-7V9l12-7Z"
              fill="#162a42"
              stroke="#8daac1"
              strokeWidth="1.5"
            />
            <path d="m13 9-7 15 4 2L18 9h-5Z" fill="white" />
            <path
              d="m20 10 7 13-4 3-6-10 3-6Zm-5 9 5 9-4 2-3-6 2-5Z"
              fill="#39a3e6"
            />
          </>
        )}
        {chain === "optimism" && (
          <>
            <circle cx="16" cy="16" r="14" fill="#ff3549" />
            <path
              d="M8 12h5v8H8zM18 20v-8h5v4h-5"
              stroke="white"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          </>
        )}
        {chain === "polygon" && (
          <g stroke="#a47cff" strokeWidth="2.7" strokeLinejoin="round">
            <path d="m11 11-5 3v6l5 3 5-3v-6l-5-3Z" />
            <path d="m21 8-5 3v6l5 3 5-3v-6l-5-3Z" />
          </g>
        )}
        {chain === "solana" && (
          <g fill="#8cdef1">
            <path d="m9 6-5 5h20l5-5H9ZM4 14l5 5h20l-5-5H4ZM9 22l-5 5h20l5-5H9Z" />
          </g>
        )}
        {chain === "avalanche" && (
          <>
            <circle cx="16" cy="16" r="14" fill="#e84142" />
            <path d="M15 7 7 22h9l4-7-5-8Zm7 11-3 5h6l-3-5Z" fill="white" />
          </>
        )}
        {chain === "linea" && (
          <>
            <path d="M8 7h6v15h11v5H8V7Z" fill="white" />
            <circle cx="24" cy="9" r="4" fill="#d6ff64" />
          </>
        )}
      </svg>
    </span>
  );
}
