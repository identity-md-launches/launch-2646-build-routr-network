import { useState } from "react";
import { Icon } from "./Icon";
import { sdkExample } from "../data";
function highlight(line: string) {
  if (line.trim().startsWith("//"))
    return <span className="syntax-comment">{line}</span>;
  return line
    .split(/('[^']*'|\b(?:import|from|const|await|new)\b|\b\d+\b)/g)
    .map((part, i) => (
      <span
        key={i}
        className={
          part.startsWith("'")
            ? "syntax-string"
            : /^(import|from|const|await|new)$/.test(part)
              ? "syntax-keyword"
              : /^\d+$/.test(part)
                ? "syntax-number"
                : undefined
        }
      >
        {part}
      </span>
    ));
}
export function CodeBlock() {
  const [copyState, setCopyState] = useState("Copy code");
  async function copy() {
    try {
      await navigator.clipboard.writeText(sdkExample);
      setCopyState("Copied");
    } catch {
      setCopyState("Select code to copy");
    }
  }
  return (
    <div className="code-window">
      <div className="code-toolbar">
        <span className="code-filename">
          <Icon name="code" /> intent.ts
        </span>
        <button className="copy-button" type="button" onClick={copy}>
          <Icon name={copyState === "Copied" ? "check" : "copy"} />{" "}
          <span aria-live="polite">{copyState}</span>
        </button>
      </div>
      <pre aria-label="Illustrative TypeScript SDK example">
        <code>
          {sdkExample.split("\n").map((line, i) => (
            <span className="code-line" key={i}>
              <span className="line-number" aria-hidden="true">
                {i + 1}
              </span>
              <span>{highlight(line)}</span>
              {"\n"}
            </span>
          ))}
        </code>
      </pre>
      <div className="code-bottom">
        <span className="status-dot" /> TypeScript{" "}
        <span className="code-preview-note">
          API preview · Illustrative example
        </span>
      </div>
    </div>
  );
}
