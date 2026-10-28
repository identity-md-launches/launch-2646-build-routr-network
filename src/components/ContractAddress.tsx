import { useState } from "react";
import { routrToken } from "../data";
import { Icon } from "./Icon";

export function ContractAddress() {
  const [copyState, setCopyState] = useState<
    "idle" | "copying" | "copied" | "failed"
  >("idle");

  async function copyAddress() {
    if (copyState === "copying") return;
    setCopyState("copying");
    try {
      await navigator.clipboard.writeText(routrToken.contractAddress);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  }

  return (
    <div className="token-contract" role="group" aria-labelledby="token-label">
      <div className="token-contract-header">
        <p id="token-label" className="token-contract-label">
          <strong>{routrToken.symbol}</strong>
          <span>Contract address</span>
        </p>
        <button
          className="button button-secondary token-copy"
          type="button"
          aria-label={copyState === "copying" ? "Copying…" : "Copy address for $ROUTR"}
          aria-disabled={copyState === "copying"}
          aria-busy={copyState === "copying"}
          onClick={copyAddress}
        >
          <Icon name={copyState === "copied" ? "check" : "copy"} />
          {copyState === "copying" ? "Copying…" : "Copy address"}
        </button>
      </div>
      <code className="token-contract-address" dir="ltr">
        {routrToken.contractAddress.slice(0, 22)}
        <wbr />
        {routrToken.contractAddress.slice(22)}
      </code>
      <p className="token-copy-feedback" role="status" aria-atomic="true">
        {copyState === "copied"
          ? "Address copied."
          : copyState === "failed"
            ? "Copy unavailable. Select the address to copy."
            : ""}
      </p>
    </div>
  );
}
