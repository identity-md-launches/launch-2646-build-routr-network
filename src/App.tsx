import { lazy, Suspense, useState } from "react";
import { Icon } from "./components/Icon";
import { RoutingDiagram } from "./components/RoutingDiagram";
import { ChainMark } from "./components/ChainMark";
import { CodeBlock } from "./components/CodeBlock";
import { RouteBuilder } from "./components/RouteBuilder";
import { Docs } from "./components/Docs";
import { ContractAddress } from "./components/ContractAddress";
import { chains, steps, features } from "./data";
const Wallet = lazy(() => import("./WalletProvider"));
export default function App() {
  const [modal, setModal] = useState<"route" | "docs" | null>(null);
  const docs = () => setModal("docs");
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="container header-inner">
          <a className="wordmark" href="#" aria-label="Routr Network home">
            routr<span className="wordmark-slash">/</span>
            <span className="wordmark-network">NETWORK</span>
          </a>
          <nav aria-label="Main navigation">
            <a href="#protocol">Protocol</a>
            <a href="#chains">Chains</a>
            <button type="button" onClick={docs}>
              Docs <Icon name="arrow-up" />
            </button>
          </nav>
          <Suspense
            fallback={
              <button className="button wallet-control" type="button" disabled>
                <Icon name="wallet" />
                Loading wallet…
              </button>
            }
          >
            <Wallet />
          </Suspense>
        </div>
      </header>
      <main id="main">
        <section className="hero container" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div
              className="live-pill"
              title="Supplied protocol snapshot; live telemetry is not connected."
            >
              <span className="status-dot pulse-dot" /> LIVE ON 9 CHAINS
            </div>
            <h1 id="hero-title">
              One intent.
              <br />
              <span>Every chain.</span>
            </h1>
            <p className="hero-description">
              One signature routes liquidity across chains.
              <br className="desktop-break" /> An intent routing protocol for
              cross-chain liquidity.
            </p>
            <div className="hero-actions">
              <button
                type="button"
                className="button button-primary"
                onClick={() => setModal("route")}
              >
                Start routing <Icon name="arrow" />
              </button>
              <button
                type="button"
                className="button button-secondary"
                onClick={docs}
              >
                Read the docs <Icon name="arrow-up" />
              </button>
            </div>
            <p className="hero-footnote">
              <Icon name="shield" /> Non-custodial by design
            </p>
            <ContractAddress />
          </div>
          <RoutingDiagram />
        </section>
        <section className="stats container" aria-label="Protocol snapshot">
          <div className="stat">
            <strong>
              $184<span>M</span>
            </strong>
            <span>Volume routed</span>
          </div>
          <div className="stat">
            <strong>9</strong>
            <span>Connected chains</span>
          </div>
          <div className="stat">
            <strong>
              1.4<span>s</span>
            </strong>
            <span>Median settlement</span>
          </div>
          <div className="stat">
            <strong>
              0.02<span>%</span>
            </strong>
            <span>Average slippage</span>
          </div>
        </section>
        <section
          id="protocol"
          className="section container"
          aria-labelledby="protocol-title"
        >
          <div className="section-heading">
            <div>
              <h2 id="protocol-title">The shortest path to settled.</h2>
              <p>Choose the outcome and let the network handle execution.</p>
            </div>
            <span className="section-index">01 / Protocol</span>
          </div>
          <div className="steps">
            {steps.map((s, i) => (
              <div className="step-wrap" key={s.title}>
                <article className="step">
                  <div className="step-top">
                    <span className="step-number">0{i + 1}</span>
                    <Icon name={s.icon} />
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.detail}</p>
                  <span className="step-meta">{s.meta}</span>
                </article>
                {i < 3 && <Icon name="arrow" className="flow-arrow" />}
              </div>
            ))}
          </div>
        </section>
        <section
          className="section why-section container"
          aria-labelledby="why-title"
        >
          <div className="section-heading">
            <div>
              <h2 id="why-title">Built for the whole route.</h2>
              <p>Reliable execution from signature to settlement.</p>
            </div>
            <span className="section-index">02 / Why Routr</span>
          </div>
          <div className="features">
            {features.map((f) => (
              <article className="feature" key={f.title}>
                <span className="icon-chip">
                  <Icon name={f.icon} />
                </span>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </article>
            ))}
          </div>
        </section>
        <section
          id="chains"
          className="section chains-section container"
          aria-labelledby="chains-title"
        >
          <div className="section-heading">
            <div>
              <h2 id="chains-title">Connected across nine chains.</h2>
              <p>One intent layer connects different ecosystems.</p>
            </div>
            <span className="network-status">
              <span className="status-dot" /> 9 supported chains
            </span>
          </div>
          <div className="chain-table-wrap">
            <table className="chain-table">
              <caption className="sr-only">
                Supported chains and supplied median settlement times. Per-chain
                solver depth is not published.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Chain</th>
                  <th scope="col">Native</th>
                  <th scope="col">Solver depth</th>
                  <th scope="col">Median settle</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {chains.map((c) => (
                  <tr key={c.key}>
                    <th scope="row">
                      <ChainMark chain={c.key} />
                      <span>{c.name}</span>
                    </th>
                    <td data-label="Native">
                      <span className="native-token">{c.native}</span>
                    </td>
                    <td data-label="Solver depth" className="solver-depth">
                      Not published
                    </td>
                    <td data-label="Median settle" className="settle-time">
                      {c.settle}
                    </td>
                    <td data-label="Status">
                      <span className="chain-status">
                        <span className="status-dot" /> Live
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="snapshot-note">
            <Icon name="activity" /> Supplied protocol snapshot; live telemetry
            is not connected.
          </p>
        </section>
        <section
          id="build"
          className="section build-section container"
          aria-labelledby="build-title"
        >
          <div className="build-copy">
            <span className="code-symbol" aria-hidden="true">
              &lt;/&gt;
            </span>
            <h2 id="build-title">Build with intent.</h2>
            <p>
              Add cross-chain routing to your app with a single interface for
              quotes, signatures and settlement.
            </p>
            <ul className="build-points">
              <li>
                <Icon name="check" /> One interface across chains
              </li>
              <li>
                <Icon name="check" /> Typed from quote to settlement
              </li>
              <li>
                <Icon name="check" /> Designed for your existing stack
              </li>
            </ul>
            <button
              type="button"
              className="button button-secondary"
              onClick={docs}
            >
              Explore the docs <Icon name="arrow-up" />
            </button>
            <p className="sdk-note">
              Read the integration notes for this SDK preview.
            </p>
          </div>
          <CodeBlock />
        </section>
      </main>
      <footer className="site-footer container">
        <div>
          <a className="footer-logo" href="#" aria-label="Routr home">
            routr<span>/</span>
          </a>
          <span>© 2026 Routr Network</span>
        </div>
        <nav aria-label="Footer navigation">
          <button type="button" onClick={docs}>
            Docs <Icon name="arrow-up" />
          </button>
          <a href="#chains">Chains</a>
          <a href="#protocol">How it works</a>
        </nav>
      </footer>
      {modal === "route" && <RouteBuilder onClose={() => setModal(null)} />}
      {modal === "docs" && <Docs onClose={() => setModal(null)} />}
    </>
  );
}
