import { useState, useRef, type FormEvent } from "react";
import { Modal } from "./Modal";
import { Icon } from "./Icon";
import { ChainMark } from "./ChainMark";
const routeAssets = [
  {
    id: "bsc-usdt",
    chain: "BNB Smart Chain",
    chainId: 56,
    token: "USDT",
    decimals: 18,
    key: "bnb",
  },
  {
    id: "base-eth",
    chain: "Base",
    chainId: 8453,
    token: "ETH",
    decimals: 18,
    key: "base",
  },
  {
    id: "ethereum-eth",
    chain: "Ethereum",
    chainId: 1,
    token: "ETH",
    decimals: 18,
    key: "ethereum",
  },
  {
    id: "arbitrum-eth",
    chain: "Arbitrum One",
    chainId: 42161,
    token: "ETH",
    decimals: 18,
    key: "arbitrum",
  },
] as const;
export function RouteBuilder({ onClose }: { onClose: () => void }) {
  const [amount, setAmount] = useState("1000");
  const [from, setFrom] = useState("bsc-usdt");
  const [to, setTo] = useState("base-eth");
  const [slippage, setSlippage] = useState("30");
  const [error, setError] = useState("");
  const [reviewed, setReviewed] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const amountRef = useRef<HTMLInputElement>(null);
  const toRef = useRef<HTMLSelectElement>(null);
  const slipRef = useRef<HTMLInputElement>(null);
  const source = routeAssets.find((a) => a.id === from)!;
  const destination = routeAssets.find((a) => a.id === to)!;
  const draft = {
    kind: "routr-route-draft",
    version: 1,
    from: { chainId: source.chainId, token: source.token },
    to: { chainId: destination.chainId, token: destination.token },
    amount,
    slippageBps: Number(slippage),
  };
  function review(e: FormEvent) {
    e.preventDefault();
    if (
      !/^(?:0|[1-9]\d*)(?:\.\d{1,18})?$/.test(amount) ||
      !/[1-9]/.test(amount) ||
      amount.length > 40
    ) {
      setError("Enter an amount greater than 0, with up to 18 decimal places.");
      amountRef.current?.focus();
      return;
    }
    if (source.chainId === destination.chainId) {
      setError("Choose a destination on a different chain.");
      toRef.current?.focus();
      return;
    }
    if (
      !/^\d+$/.test(slippage) ||
      Number(slippage) < 1 ||
      Number(slippage) > 500
    ) {
      setError("Enter slippage from 1 to 500 basis points.");
      slipRef.current?.focus();
      return;
    }
    setError("");
    setReviewed(true);
  }
  function download() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(draft, null, 2) + "\n"], {
        type: "application/json",
      }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "routr-intent-draft.json";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDownloaded(true);
  }
  return (
    <Modal
      title={reviewed ? "Review your intent" : "Plan a route"}
      onClose={onClose}
    >
      <p className="modal-description">
        {reviewed
          ? "Your desired outcome, ready to export."
          : "Choose what to send and where to receive it."}
      </p>
      <div className="preview-notice">
        <Icon name="code" />
        <p>
          Intent preview. Live quotes and settlement are not connected. No funds
          move.
        </p>
      </div>
      {!reviewed ? (
        <form onSubmit={review} noValidate>
          <div className="field">
            <label htmlFor="route-from">From</label>
            <select
              id="route-from"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                setError("");
              }}
            >
              {routeAssets.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.token} · {a.chain}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="route-amount">
              Amount to send <span>{source.token}</span>
            </label>
            <input
              ref={amountRef}
              id="route-amount"
              name="amount"
              inputMode="decimal"
              autoComplete="off"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError("");
              }}
              aria-invalid={!!error && error.startsWith("Enter an amount")}
              aria-describedby="route-error"
            />
          </div>
          <div className="field">
            <label htmlFor="route-to">To</label>
            <select
              ref={toRef}
              id="route-to"
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                setError("");
              }}
              aria-invalid={!!error && error.startsWith("Choose")}
              aria-describedby="route-error"
            >
              {routeAssets.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.token} · {a.chain}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="route-slippage">
              Slippage tolerance <span>30 bps = 0.30%</span>
            </label>
            <div className="input-with-unit">
              <input
                ref={slipRef}
                id="route-slippage"
                name="slippage"
                inputMode="numeric"
                value={slippage}
                onChange={(e) => {
                  setSlippage(e.target.value);
                  setError("");
                }}
                aria-invalid={!!error && error.startsWith("Enter slippage")}
                aria-describedby="route-error"
              />
              <span>bps</span>
            </div>
          </div>
          <p id="route-error" className="form-error" role="status">
            {error}
          </p>
          <button className="button button-primary modal-action" type="submit">
            Review intent <Icon name="arrow" />
          </button>
        </form>
      ) : (
        <div className="intent-review">
          <div className="review-route">
            <div>
              <ChainMark chain={source.key} />
              <strong>
                {amount} {source.token}
              </strong>
              <span>{source.chain}</span>
            </div>
            <Icon name="arrow" />
            <div>
              <ChainMark chain={destination.key} />
              <strong>{destination.token}</strong>
              <span>{destination.chain}</span>
            </div>
          </div>
          <dl className="intent-details">
            <div>
              <dt>Slippage limit</dt>
              <dd>
                {slippage} bps ({(Number(slippage) / 100).toFixed(2)}%)
              </dd>
            </div>
            <div>
              <dt>Amount received</dt>
              <dd>Requires a live quote</dd>
            </div>
            <div>
              <dt>Settlement</dt>
              <dd>Not connected</dd>
            </div>
          </dl>
          <button
            type="button"
            className="button button-primary modal-action"
            onClick={download}
          >
            <Icon name="download" /> Download intent
          </button>
          <p className="download-status" role="status">
            {downloaded
              ? "Intent draft downloaded as JSON."
              : "An unsigned draft. No wallet signature required."}
          </p>
          <button
            type="button"
            className="button button-secondary modal-action"
            onClick={() => {
              setReviewed(false);
              setDownloaded(false);
            }}
          >
            Edit route
          </button>
        </div>
      )}
    </Modal>
  );
}
