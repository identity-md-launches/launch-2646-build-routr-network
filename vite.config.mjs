import { resolve } from "node:path";
const external = process.env.ROUTR_DEPENDENCY_ROOT;
export default {
  base: "./",
  resolve: external
    ? {
        alias: [
          "react-dom",
          "react",
          "wagmi",
          "viem",
          "@tanstack/react-query",
        ].map((name) => ({
          find: new RegExp(`^${name.replace("/", "\\/")}(?=/|$)`),
          replacement: resolve(external, name),
        })),
      }
    : undefined,
  build: {
    target: "es2022",
    sourcemap: false,
    chunkSizeWarningLimit: 700,
    rolldownOptions: {
      onwarn(warning, defaultHandler) {
        if (warning.code !== "MODULE_LEVEL_DIRECTIVE") defaultHandler(warning);
      },
    },
  },
};
