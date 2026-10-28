import { createRequire } from "node:module";
import { join, resolve } from "node:path";
const external = process.env.ROUTR_DEPENDENCY_ROOT;
const require = createRequire(
  external
    ? join(resolve(external), "../package.json")
    : new URL("../package.json", import.meta.url),
);
const ts = require("typescript");
const config = ts.readConfigFile("tsconfig.json", ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(
  config.config,
  ts.sys,
  process.cwd(),
);
if (external) {
  parsed.options.baseUrl = process.cwd();
  parsed.options.paths = {
    react: [join(external, "@types/react")],
    "react/*": [join(external, "@types/react/*")],
    "react-dom/*": [join(external, "@types/react-dom/*")],
    "*": [join(external, "*")],
  };
  parsed.options.typeRoots = [join(external, "@types")];
}
const program = ts.createProgram(parsed.fileNames, parsed.options);
const diagnostics = [...parsed.errors, ...ts.getPreEmitDiagnostics(program)];
if (diagnostics.length) {
  console.error(
    ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCurrentDirectory: () => process.cwd(),
      getCanonicalFileName: (f) => f,
      getNewLine: () => "\n",
    }),
  );
  process.exitCode = 1;
} else console.log("Typecheck passed.");
