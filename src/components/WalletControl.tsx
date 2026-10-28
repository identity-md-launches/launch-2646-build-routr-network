import { useState } from "react";
import {
  useConnection,
  useConnect,
  useConnectors,
  useDisconnect,
  useSwitchChain,
  type Connector,
} from "wagmi";
import { getAddress } from "viem";
import { Modal } from "./Modal";
import { Icon } from "./Icon";
import { OPEN_IN, isMobileBrowser } from "../open-in";
const asset = (name: string) =>
  `${import.meta.env.BASE_URL}wallets/${name}.svg`;
export function WalletControl() {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [pendingWallet, setPendingWallet] = useState<string | null>(null);
  const { address, isConnected, chainId } = useConnection();
  const connectors = useConnectors();
  const connect = useConnect();
  const disconnect = useDisconnect();
  const switchChain = useSwitchChain();
  const named = connectors.some(
    (c) => c.type === "injected" && c.id !== "injected",
  );
  const mobile =
    isMobileBrowser() &&
    !named &&
    !(window as Window & { ethereum?: unknown }).ethereum;
  const listed = [
    ...connectors.filter((c) => c.type === "injected"),
    ...connectors.filter((c) => c.type !== "injected"),
  ].filter((c) => !(c.id === "injected" && (named || mobile)));
  const wrongChain = isConnected && chainId !== 56;
  const short = address
    ? `${getAddress(address).slice(0, 6)}…${getAddress(address).slice(-4)}`
    : "";
  function label(c: Connector) {
    return c.id === "injected"
      ? "Browser wallet"
      : c.id === "coinbaseWalletSDK" && mobile
        ? "Coinbase Smart Wallet"
        : c.name;
  }
  async function choose(c: Connector) {
    setNote("");
    setPendingWallet(c.uid);
    try {
      await connect.mutateAsync({ connector: c });
      setOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      setNote(
        /not found|not installed/i.test(message)
          ? "No browser wallet found. Install an extension or choose Coinbase Wallet."
          : /reject|denied|cancel/i.test(message)
            ? "Connection cancelled. Choose a wallet to try again."
            : "Unable to connect. Check your wallet and try again.",
      );
    } finally {
      setPendingWallet(null);
    }
  }
  async function switchNetwork() {
    setNote("");
    try {
      await switchChain.mutateAsync({ chainId: 56 });
    } catch {
      setNote(
        "Network switch cancelled or unavailable. Open your wallet and try again.",
      );
      setOpen(true);
    }
  }
  return (
    <>
      <button
        type="button"
        className="button wallet-control"
        onClick={() => {
          setNote("");
          if (wrongChain) void switchNetwork();
          else setOpen(true);
        }}
        disabled={switchChain.isPending}
        aria-label={
          wrongChain
            ? "Switch to BNB Smart Chain"
            : isConnected
              ? `Wallet ${short}`
              : "Connect wallet"
        }
      >
        <Icon name="wallet" />
        <span>
          {switchChain.isPending
            ? "Switching…"
            : wrongChain
              ? "Switch to BNB"
              : isConnected
                ? short
                : "Connect wallet"}
        </span>
        {isConnected && <Icon name="chevron" />}
      </button>
      {open && (
        <Modal
          title={isConnected ? "Connected wallet" : "Connect a wallet"}
          onClose={() => setOpen(false)}
        >
          {isConnected && address ? (
            <>
              <p className="modal-description">Your public address</p>
              <p className="wallet-address">{getAddress(address)}</p>
              <p className="wallet-network">
                {wrongChain
                  ? "Switch to BNB Smart Chain to prepare a BNB route."
                  : "Connected to BNB Smart Chain"}
              </p>
              {wrongChain && (
                <button
                  className="button button-primary modal-action"
                  type="button"
                  onClick={switchNetwork}
                  disabled={switchChain.isPending}
                >
                  Switch to BNB Smart Chain
                </button>
              )}
              <button
                className="button button-secondary modal-action"
                type="button"
                onClick={() => {
                  disconnect.mutate();
                  setOpen(false);
                }}
              >
                Disconnect
              </button>
            </>
          ) : (
            <>
              <p className="modal-description">
                Connect to Routr with your preferred wallet.
              </p>
              <div className="wallet-list">
                {mobile &&
                  OPEN_IN.map((w) => (
                    <a
                      className="wallet-row"
                      key={w.id}
                      href={w.href(location.href)}
                    >
                      <img src={asset(w.id)} width="28" height="28" alt="" />
                      <span>Open in {w.name}</span>
                      <Icon name="arrow-up" />
                    </a>
                  ))}
                {listed.map((c) => (
                  <button
                    type="button"
                    className="wallet-row"
                    key={c.uid}
                    onClick={() => choose(c)}
                    disabled={connect.isPending}
                  >
                    {c.icon ? (
                      <img src={c.icon} width="28" height="28" alt="" />
                    ) : c.id === "coinbaseWalletSDK" ? (
                      <img
                        src={asset("coinbase")}
                        width="28"
                        height="28"
                        alt=""
                      />
                    ) : (
                      <Icon name="wallet" />
                    )}
                    <span>{label(c)}</span>
                    {connect.isPending && pendingWallet === c.uid ? (
                      <span className="wallet-opening">Opening…</span>
                    ) : (
                      <Icon name="arrow" />
                    )}
                  </button>
                ))}
              </div>
              <p className="wallet-help">
                Connection shares your public address. Routr will not request a
                signature or move funds here.
              </p>
            </>
          )}
          <p className="wallet-error" role="status">
            {note}
          </p>
        </Modal>
      )}
    </>
  );
}
