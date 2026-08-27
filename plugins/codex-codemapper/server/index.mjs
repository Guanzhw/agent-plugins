#!/usr/bin/env node

import readline from "node:readline";
import {
  TOOL_DEFINITIONS,
  executeTool,
  rootFromUri,
} from "./codemapper.mjs";

const SERVER_INFO = { name: "codex-codemapper", version: "0.1.0" };
let activeRoot;
let nextRequestId = 1;
const pendingRequests = new Map();

const input = readline.createInterface({
  input: process.stdin,
  crlfDelay: Infinity,
});

input.on("line", (line) => {
  if (!line.trim()) return;
  let message;
  try {
    message = JSON.parse(line);
  } catch (error) {
    process.stderr.write(`Invalid JSON-RPC message: ${error.message}\n`);
    return;
  }
  void handleMessage(message);
});

async function handleMessage(message) {
  if (message.id !== undefined && !message.method) {
    const pending = pendingRequests.get(message.id);
    if (pending) {
      pendingRequests.delete(message.id);
      if (message.error) pending.reject(new Error(message.error.message));
      else pending.resolve(message.result);
    }
    return;
  }

  if (!message.method) return;

  try {
    switch (message.method) {
      case "initialize":
        respond(message.id, {
          protocolVersion: message.params?.protocolVersion ?? "2025-06-18",
          capabilities: { tools: { listChanged: false } },
          serverInfo: SERVER_INFO,
          instructions:
            "Use CodeMapper for symbol-level exploration, not arbitrary text grep. Pass the active repository as root when possible. Verify static-analysis results in source before editing.",
        });
        break;
      case "notifications/initialized":
        void discoverRoots();
        break;
      case "ping":
        respond(message.id, {});
        break;
      case "tools/list":
        respond(message.id, { tools: TOOL_DEFINITIONS });
        break;
      case "tools/call":
        await callTool(message);
        break;
      default:
        if (message.id !== undefined) {
          respondError(message.id, -32601, `Method not found: ${message.method}`);
        }
    }
  } catch (error) {
    if (message.id !== undefined) {
      respondError(message.id, -32603, error instanceof Error ? error.message : String(error));
    }
  }
}

async function callTool(message) {
  const name = message.params?.name;
  const args = message.params?.arguments ?? {};
  if (typeof name !== "string") {
    respondError(message.id, -32602, "tools/call requires a tool name");
    return;
  }

  try {
    const result = await executeTool(name, args, activeRoot);
    const text = JSON.stringify(result, null, 2);
    respond(message.id, {
      content: [{ type: "text", text }],
      structuredContent: result,
      isError: false,
    });
  } catch (error) {
    const text = error instanceof Error ? error.message : String(error);
    respond(message.id, {
      content: [{ type: "text", text }],
      structuredContent: { error: text },
      isError: true,
    });
  }
}

async function discoverRoots() {
  try {
    const result = await request("roots/list", {});
    const root = result?.roots?.map((item) => rootFromUri(item.uri)).find(Boolean);
    if (root) activeRoot = root;
  } catch {
    // Explicit tool root and environment fallbacks remain available.
  }
}

function request(method, params) {
  const id = `server-${nextRequestId++}`;
  send({ jsonrpc: "2.0", id, method, params });
  return new Promise((resolve, reject) => {
    pendingRequests.set(id, { resolve, reject });
    setTimeout(() => {
      if (!pendingRequests.has(id)) return;
      pendingRequests.delete(id);
      reject(new Error(`${method} timed out`));
    }, 5_000).unref();
  });
}

function respond(id, result) {
  send({ jsonrpc: "2.0", id, result });
}

function respondError(id, code, message) {
  send({ jsonrpc: "2.0", id, error: { code, message } });
}

function send(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}
