import { createRequire } from "node:module";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

// An external dependency directory is optional; normal npm installs need no setting.
const require = createRequire(
  process.env.ROUTR_DEPENDENCY_ROOT
    ? join(resolve(process.env.ROUTR_DEPENDENCY_ROOT), "../package.json")
    : new URL("../package.json", import.meta.url),
);
const { build, createServer, preview } = await import(
  pathToFileURL(require.resolve("vite")).href
);
const command = process.argv[2] ?? "dev";
if (command === "build") await build();
else if (command === "preview") {
  const server = await preview({ preview: { host: "0.0.0.0" } });
  server.printUrls();
} else {
  const server = await createServer({ server: { host: "0.0.0.0" } });
  await server.listen();
  server.printUrls();
}
