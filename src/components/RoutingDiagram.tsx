import { ChainMark, type ChainKey } from "./ChainMark";
const nodes: { chain: ChainKey; label: string; position: string }[] = [
  { chain: "ethereum", label: "Ethereum", position: "n1" },
  { chain: "arbitrum", label: "Arbitrum", position: "n2" },
  { chain: "bnb", label: "BNB Chain", position: "n3" },
  { chain: "base", label: "Base", position: "n4" },
  { chain: "solana", label: "Solana", position: "n5" },
  { chain: "optimism", label: "Optimism", position: "n6" },
];
export function RoutingDiagram() {
  return (
    <figure
      className="routing-diagram"
      aria-label="Illustration: a single intent routes through Routr to multiple chains"
    >
      <div className="diagram-grid" />
      <svg
        className="diagram-lines"
        viewBox="0 0 600 420"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="route-line"
            x1="100"
            y1="0"
            x2="500"
            y2="420"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#6ee7b7" stopOpacity=".6" />
            <stop offset="1" stopColor="#3b82f6" stopOpacity=".45" />
          </linearGradient>
        </defs>
        <circle
          cx="300"
          cy="210"
          r="106"
          stroke="#26342f"
          strokeDasharray="3 6"
        />
        <circle cx="300" cy="210" r="164" stroke="#1b2526" />
        <path
          d="M300 210H196a44 44 0 0 1-44-44V89H111M300 210V113a39 39 0 0 0-39-39h-5M300 210v89a45 45 0 0 1-45 45H126M300 210h104a38 38 0 0 0 38-38V96h47M300 210h190M300 210v91a38 38 0 0 0 38 38h141"
          stroke="url(#route-line)"
          strokeWidth="1.4"
        />
        <path
          d="M177 89h22M300 143v21M160 344h23M447 142v21M425 210h21M395 339h20"
          stroke="#6ee7b7"
          strokeWidth="2.5"
        />
        <circle cx="152" cy="89" r="3" fill="#6ee7b7" />
        <circle cx="442" cy="96" r="3" fill="#6ee7b7" />
        <circle cx="300" cy="339" r="3" fill="#6ee7b7" />
        <path
          d="M33 31h9M37.5 26.5v9M558 385h9M562.5 380.5v9M30 385h9M34.5 380.5v9M560 30h9M564.5 25.5v9"
          stroke="#40514c"
        />
      </svg>
      <div className="router-core">
        <span className="core-bracket">[</span>
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <path
            d="M12 35V13h12m-12 11h23M24 13l12 11-12 11"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
        <span className="core-bracket">]</span>
        <span className="core-name">routr</span>
      </div>
      {nodes.map((n) => (
        <div className={`diagram-node ${n.position}`} key={n.chain}>
          <ChainMark chain={n.chain} />
          <span>{n.label}</span>
        </div>
      ))}
      <div className="diagram-caption">
        <span className="diagram-dot" /> A single intent across ecosystems
        <span className="diagram-version">Intent layer / 01</span>
      </div>
    </figure>
  );
}
