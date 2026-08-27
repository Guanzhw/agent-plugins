import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { fileURLToPath } from "node:url";
import readline from "node:readline";
import test from "node:test";

const serverPath = fileURLToPath(
  new URL("../plugins/codex-codemapper/server/index.mjs", import.meta.url),
);

test("serves MCP initialize and tool discovery over stdio", async (t) => {
  const child = spawn(process.execPath, [serverPath], {
    stdio: ["pipe", "pipe", "pipe"],
  });
  t.after(() => child.kill());

  const lines = readline.createInterface({ input: child.stdout });
  const messages = [];
  lines.on("line", (line) => messages.push(JSON.parse(line)));

  child.stdin.write(
    `${JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: { protocolVersion: "2025-06-18", capabilities: {} },
    })}\n`,
  );
  child.stdin.write(
    `${JSON.stringify({ jsonrpc: "2.0", id: 2, method: "tools/list", params: {} })}\n`,
  );

  await waitFor(() => messages.length >= 2);
  assert.equal(messages[0].result.serverInfo.name, "codex-codemapper");
  assert.equal(messages[1].result.tools.length, 5);

  child.stdin.end();
  await once(child, "close");
});

async function waitFor(predicate) {
  const deadline = Date.now() + 5_000;
  while (!predicate()) {
    if (Date.now() > deadline) throw new Error("Timed out waiting for MCP response");
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
}
