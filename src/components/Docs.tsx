import { Modal } from "./Modal";
export function Docs({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Protocol docs" onClose={onClose} wide>
      <div className="docs-content">
        <p>
          Routr is a cross-chain intent routing protocol. You describe the asset
          you want to receive; solvers compete to deliver it.
        </p>
        <h3>The intent lifecycle</h3>
        <ol>
          <li>
            <strong>Sign intent.</strong> Define source, destination, amount and
            maximum slippage in EIP-712 typed data.
          </li>
          <li>
            <strong>Solver auction.</strong> Solvers evaluate available
            liquidity and compete on the effective output.
          </li>
          <li>
            <strong>Route split.</strong> The selected route can split across
            liquidity sources.
          </li>
          <li>
            <strong>Atomic settle.</strong> The route completes in full or
            reverts.
          </li>
        </ol>
        <h3>Try the intent builder</h3>
        <p>
          Start routing opens a local draft builder. Choose two chains, enter an
          amount, set slippage and download the unsigned JSON. 30 basis points
          equals 0.30%.
        </p>
        <h3>SDK integration</h3>
        <p>
          The TypeScript snippet is an illustrative API preview. A published
          SDK, solver endpoint and settlement contracts were not provided for
          this site. The example is not an installed or executable integration.
        </p>
        <p>
          Production integration requires the verified SDK, quote service,
          chain-specific token addresses, EIP-712 domain and settlement
          contracts. The site does not request approvals, signatures or
          transactions.
        </p>
        <h3>Wallets and network data</h3>
        <p>
          Connect using a browser wallet or Coinbase Wallet. On a phone, open
          this page inside a supported wallet browser. Connection only shares
          your public address.
        </p>
        <p>
          Volume, latency and Live labels reproduce the supplied protocol
          snapshot. They are not monitored telemetry. Per-chain solver depth was
          not supplied and is marked “Not published”.
        </p>
        <a className="button button-secondary" href="#build" onClick={onClose}>
          View the SDK example
        </a>
      </div>
    </Modal>
  );
}
