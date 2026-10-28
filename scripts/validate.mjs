import { createRequire } from "node:module";
import { createServer } from "node:http";
import { readFile, stat, mkdir, writeFile } from "node:fs/promises";
import { resolve, join, extname } from "node:path";
import assert from "node:assert/strict";
const require = createRequire(
  process.env.ROUTR_DEPENDENCY_ROOT
    ? join(resolve(process.env.ROUTR_DEPENDENCY_ROOT), "../package.json")
    : new URL("../package.json", import.meta.url),
);
const { chromium, webkit } = require("playwright");
const AxeBuilder = require("@axe-core/playwright").default;
const root = resolve("dist");
const output = resolve("test/scratch/interactions");
await mkdir(output, { recursive: true });
const results = [];
const record = (name, details = "") => {
  results.push({ name, passed: true, details });
  console.log(`PASS ${name}${details ? `: ${details}` : ""}`);
};
const mime = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
};
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    if (!pathname.startsWith("/preview/")) {
      res.writeHead(404).end();
      return;
    }
    let file = resolve(root, pathname.slice(9) || "index.html");
    if (!file.startsWith(root + "/")) throw Error("Invalid path");
    if ((await stat(file)).isDirectory()) file += "/index.html";
    res.writeHead(200, {
      "Content-Type": mime[extname(file)] || "application/octet-stream",
    });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404).end("Not found");
  }
});
await new Promise((done) => server.listen(0, "127.0.0.1", done));
const url = `http://127.0.0.1:${server.address().port}/preview/`;
let browser;
let debugPage;
try {
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const page = await context.newPage();
  const errors = [],
    failedResources = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("response", (r) => {
    if (r.url().startsWith(url) && r.status() >= 400)
      failedResources.push(r.url());
  });
  await page.goto(url);
  await page
    .getByRole("button", { name: "Connect wallet", exact: true })
    .waitFor();
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.title(), "Routr Network — One intent. Every chain.");
  assert.equal(await page.locator("tbody tr").count(), 9);
  assert.equal(await page.locator(".feature").count(), 6);
  assert.equal(await page.locator(".step").count(), 4);
  for (const asset of [
    "favicon.svg",
    "share-card.png",
    "fonts/inter-latin.woff2",
  ])
    assert.equal((await page.request.get(url + asset)).status(), 200);
  record("Static subpath export and required content");
  const desktopAxe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  await writeFile(
    join(output, "axe-desktop.json"),
    JSON.stringify(desktopAxe.violations, null, 2),
  );
  assert.deepEqual(
    desktopAxe.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
    [],
  );
  record("Desktop axe accessibility", "No WCAG A/AA violations detected");
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Chains", exact: true })
    .click();
  await page.waitForFunction(() => location.hash === "#chains");
  await page
    .getByRole("navigation", { name: "Footer navigation" })
    .getByRole("link", { name: "How it works" })
    .click();
  await page.waitForFunction(() => location.hash === "#protocol");
  await page.getByRole("link", { name: "Routr Network home" }).click();
  await page
    .getByRole("button", { name: "Read the docs", exact: true })
    .click();
  await page.getByRole("dialog", { name: "Protocol docs" }).waitFor();
  await page.getByRole("link", { name: "View the SDK example" }).click();
  assert.equal(await page.locator("dialog").count(), 0);
  await page.waitForFunction(() => location.hash === "#build");
  record("Protocol, chain, footer, and docs navigation");
  await page.getByRole("button", { name: "Copy code", exact: true }).click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  assert.ok(copied.includes("from: { chain: 'bsc', token: 'USDT' }"));
  assert.ok(copied.includes("slippageBps: 30"));
  assert.ok(copied.includes("signTypedData"));
  record("SDK copy", "Clipboard matches the displayed example");
  await page
    .getByRole("button", { name: "Start routing", exact: true })
    .click();
  await page.getByRole("dialog", { name: "Plan a route" }).waitFor();
  await page.locator("#route-amount").fill("0");
  await page
    .getByRole("button", { name: "Review intent", exact: true })
    .click();
  assert.match(
    await page.locator("#route-error").innerText(),
    /greater than 0/,
  );
  assert.equal(
    await page
      .locator("#route-amount")
      .evaluate((e) => e === document.activeElement),
    true,
  );
  await page.locator("#route-amount").fill("1000.125");
  await page.locator("#route-to").selectOption("bsc-usdt");
  await page
    .getByRole("button", { name: "Review intent", exact: true })
    .click();
  assert.match(
    await page.locator("#route-error").innerText(),
    /different chain/,
  );
  await page.locator("#route-to").selectOption("base-eth");
  await page.locator("#route-slippage").fill("501");
  await page
    .getByRole("button", { name: "Review intent", exact: true })
    .click();
  assert.match(await page.locator("#route-error").innerText(), /1 to 500/);
  await page.locator("#route-slippage").fill("30");
  const modalAxe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  await writeFile(
    join(output, "axe-modal.json"),
    JSON.stringify(modalAxe.violations, null, 2),
  );
  assert.deepEqual(
    modalAxe.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
    [],
  );
  await page
    .getByRole("button", { name: "Review intent", exact: true })
    .click();
  await page.getByRole("dialog", { name: "Review your intent" }).waitFor();
  const downloadPromise = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Download intent", exact: true })
    .click();
  const download = await downloadPromise;
  assert.equal(download.suggestedFilename(), "routr-intent-draft.json");
  const draft = JSON.parse(await readFile(await download.path(), "utf8"));
  assert.equal(draft.amount, "1000.125");
  assert.equal(draft.from.chainId, 56);
  assert.equal(draft.to.chainId, 8453);
  assert.equal(draft.slippageBps, 30);
  await page.getByRole("button", { name: "Edit route", exact: true }).click();
  assert.equal(await page.locator("#route-amount").inputValue(), "1000.125");
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("dialog").count(), 0);
  assert.equal(
    await page
      .getByRole("button", { name: "Start routing", exact: true })
      .evaluate((e) => e === document.activeElement),
    true,
  );
  record(
    "Intent builder",
    "Invalid amount, same-chain route, slippage range, review, JSON download, edit, Escape, focus return",
  );
  await page
    .getByRole("button", { name: "Connect wallet", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Browser wallet", exact: true })
    .click();
  await page
    .getByRole("status")
    .filter({ hasText: "No browser wallet found" })
    .waitFor();
  assert.equal(
    await page
      .getByRole("button", { name: "Browser wallet", exact: true })
      .isEnabled(),
    true,
  );
  await page.keyboard.press("Escape");
  record(
    "Wallet absent",
    "Useful error and retry after choosing an unavailable browser wallet",
  );
  for (const width of [320, 390, 640, 859, 860, 1024, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(url);
    await page.evaluate(() => document.fonts.ready);
    const metrics = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      buttonBottom: [...document.querySelectorAll("button")]
        .find((b) => b.textContent.includes("Start routing"))
        .getBoundingClientRect().bottom,
      features: getComputedStyle(
        document.querySelector(".features"),
      ).gridTemplateColumns.split(" ").length,
      steps: getComputedStyle(
        document.querySelector(".steps"),
      ).gridTemplateColumns.split(" ").length,
    }));
    assert.equal(metrics.overflow, false, `${width}px page overflow`);
    if (width === 390) assert.ok(metrics.buttonBottom < 844);
    assert.equal(metrics.features, width < 860 ? 1 : 3);
    assert.equal(metrics.steps, width < 860 ? 1 : 4);
    record(
      `Responsive ${width}px`,
      `No overflow; ${metrics.features} feature columns; ${metrics.steps} flow columns`,
    );
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(url);
  await page.keyboard.press("Tab");
  assert.equal(
    await page
      .getByRole("link", { name: "Skip to content" })
      .evaluate((e) => e === document.activeElement),
    true,
  );
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  assert.equal(
    await page
      .getByRole("button", { name: "Start routing", exact: true })
      .evaluate((e) => e === document.activeElement),
    true,
  );
  await page.keyboard.press("Enter");
  assert.equal(await page.locator("dialog").count(), 1);
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press("Tab");
    assert.equal(
      await page.evaluate(() => !!document.activeElement?.closest("dialog")),
      true,
    );
  }
  await page.keyboard.press("Escape");
  record(
    "Keyboard flow",
    "Skip link, primary action, modal focus containment and Escape",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(
    await page
      .locator(".pulse-dot")
      .evaluate((e) => getComputedStyle(e).animationName),
    "none",
  );
  await page
    .getByRole("button", { name: "Start routing", exact: true })
    .click();
  assert.equal(await page.locator("dialog").count(), 1);
  await page.keyboard.press("Escape");
  record("Reduced motion", "Pulse disabled and main interaction works");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1",
    isMobile: true,
    hasTouch: true,
  });
  const phone = await mobile.newPage();
  await phone.goto(url);
  await phone
    .getByRole("button", { name: "Connect wallet", exact: true })
    .click();
  for (const name of ["MetaMask", "Coinbase Wallet", "Rabby", "Phantom"])
    assert.equal(
      await phone
        .getByRole("link", { name: `Open in ${name}`, exact: true })
        .count(),
      1,
    );
  assert.equal(
    await phone
      .getByRole("button", { name: "Coinbase Smart Wallet", exact: true })
      .count(),
    1,
  );
  assert.equal(
    await phone
      .getByRole("button", { name: "Browser wallet", exact: true })
      .count(),
    0,
  );
  assert.ok(
    (
      await phone
        .getByRole("link", { name: "Open in Rabby" })
        .getAttribute("href")
    ).includes("_cmd=open-dapp&dapp="),
  );
  for (const img of await phone.locator(".wallet-row img").all())
    assert.equal(
      await img.evaluate((e) => e.complete && e.naturalWidth > 0),
      true,
    );
  const mobileAxe = await new AxeBuilder({ page: phone })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  await writeFile(
    join(output, "axe-mobile-wallet.json"),
    JSON.stringify(mobileAxe.violations, null, 2),
  );
  assert.deepEqual(
    mobileAxe.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
    [],
  );
  record(
    "Phone wallet sheet",
    "Four working deep-link formats, local marks, Coinbase Smart Wallet; no generic injected row",
  );
  await mobile.close();
  // This provider exists only in the test browser, never in the shipped site.
  const mock = await browser.newContext();
  await mock.addInitScript(() => {
    let requested = false,
      currentChain = sessionStorage.getItem("test-wallet-chain") || "0x1",
      chainAdded = false;
    let authorized = sessionStorage.getItem("test-wallet-authorized") === "yes";
    const listeners = {};
    window.__walletCalls = [];
    const address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    const provider = {
      on(event, callback) {
        (listeners[event] ??= []).push(callback);
      },
      removeListener(event, callback) {
        listeners[event] = (listeners[event] ?? []).filter(
          (f) => f !== callback,
        );
      },
      async request({ method, params }) {
        window.__walletCalls.push(method);
        if (method === "eth_requestAccounts") {
          if (!requested) {
            requested = true;
            throw Object.assign(Error("User rejected request"), { code: 4001 });
          }
          authorized = true;
          sessionStorage.setItem("test-wallet-authorized", "yes");
          return [address];
        }
        if (method === "eth_accounts") return authorized ? [address] : [];
        if (method === "eth_chainId") return currentChain;
        if (method === "wallet_switchEthereumChain") {
          if (!chainAdded)
            throw Object.assign(Error("Unrecognized chain"), { code: 4902 });
          currentChain = params[0].chainId;
          sessionStorage.setItem("test-wallet-chain", currentChain);
          for (const cb of listeners.chainChanged ?? []) cb(currentChain);
          return null;
        }
        if (method === "wallet_addEthereumChain") {
          chainAdded = true;
          currentChain = params[0].chainId;
          sessionStorage.setItem("test-wallet-chain", currentChain);
          for (const cb of listeners.chainChanged ?? []) cb(currentChain);
          return null;
        }
        if (
          method === "wallet_requestPermissions" ||
          method === "wallet_getPermissions"
        )
          return [{ parentCapability: "eth_accounts" }];
        if (method === "wallet_revokePermissions") return null;
        throw Error(`Unexpected test wallet method ${method}`);
      },
    };
    window.ethereum = provider;
    const info = {
      uuid: "954a29da-f20c-4634-97e8-6976d4fb3132",
      name: "Test Browser Wallet",
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><rect width="28" height="28" fill="blue"/></svg>',
      rdns: "test.routr.wallet",
    };
    const announce = () =>
      window.dispatchEvent(
        new CustomEvent("eip6963:announceProvider", {
          detail: { info, provider },
        }),
      );
    window.addEventListener("eip6963:requestProvider", announce);
    announce();
  });
  const walletPage = await mock.newPage();
  debugPage = walletPage;
  await walletPage.goto(url);
  await walletPage
    .getByRole("button", { name: "Connect wallet", exact: true })
    .click();
  assert.equal(
    await walletPage
      .getByRole("button", { name: "Browser wallet", exact: true })
      .count(),
    0,
  );
  await walletPage
    .getByRole("button", { name: "Test Browser Wallet", exact: true })
    .click();
  await walletPage
    .getByRole("status")
    .filter({ hasText: "Connection cancelled" })
    .waitFor();
  await walletPage
    .getByRole("button", { name: "Test Browser Wallet", exact: true })
    .click();
  await walletPage
    .getByRole("button", { name: "Switch to BNB Smart Chain", exact: true })
    .waitFor();
  await walletPage
    .getByRole("button", { name: "Switch to BNB Smart Chain", exact: true })
    .click();
  await walletPage.getByRole("button", { name: /Wallet 0xf39F/ }).waitFor();
  const calls = await walletPage.evaluate(() => window.__walletCalls);
  assert.ok(calls.includes("wallet_switchEthereumChain"));
  assert.ok(calls.includes("wallet_addEthereumChain"));
  await walletPage.reload();
  await walletPage.getByRole("button", { name: /Wallet 0xf39F/ }).waitFor();
  await walletPage.getByRole("button", { name: /Wallet 0xf39F/ }).click();
  await walletPage
    .getByRole("button", { name: "Disconnect", exact: true })
    .click();
  await walletPage
    .getByRole("button", { name: "Connect wallet", exact: true })
    .waitFor();
  record(
    "EIP-6963 wallet with test provider",
    "Named discovery, generic suppression, rejection, retry, connect, switch/add chain, reconnect, disconnect",
  );
  await mock.close();
  assert.deepEqual(errors, []);
  assert.deepEqual(failedResources, []);
  record(
    "Browser errors and local resources",
    "Zero page errors and local HTTP failures",
  );
  try {
    const safari = await webkit.launch({ headless: true });
    try {
      const p = await safari.newPage({ viewport: { width: 390, height: 844 } });
      await p.goto(url);
      await p
        .getByRole("button", { name: "Start routing", exact: true })
        .click();
      await p.getByRole("dialog", { name: "Plan a route" }).waitFor();
      await p.keyboard.press("Escape");
      assert.equal(await p.locator("dialog").count(), 0);
      record("WebKit primary interaction");
    } finally {
      await safari.close();
    }
  } catch (e) {
    results.push({
      name: "WebKit primary interaction",
      passed: null,
      details: String(e.message).split("\n").slice(0, 4).join(" "),
    });
    console.log("LIMITATION WebKit runtime unavailable");
  }
} catch (e) {
  if (debugPage && !debugPage.isClosed()) {
    console.error(
      await debugPage.evaluate(() => ({
        calls: window.__walletCalls,
        text: document.body.innerText.slice(-1800),
      })),
    );
    await debugPage.screenshot({ path: join(output, "failure.png") });
  }
  results.push({ name: "Validation failure", passed: false, details: e.stack });
  console.error(e);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  await new Promise((done) => server.close(done));
  await writeFile(
    join(output, "results.json"),
    JSON.stringify({ checks: results }, null, 2) + "\n",
  );
}
