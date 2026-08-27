import assert from "node:assert/strict";
import test from "node:test";
import {
  TOOL_DEFINITIONS,
  buildToolCommands,
  normalizeSearchQuery,
  rootFromUri,
} from "../plugins/codex-codemapper/server/codemapper.mjs";

test("normalizes the grep-like query reported in issue #1", () => {
  const input =
    "agent model tokens_input tokens_output tokens_reasoning tokens_cache_read tokens_cache_write cost session.agent session.model";
  assert.deepEqual(normalizeSearchQuery(input), {
    query:
      "agent|model|tokens_input|tokens_output|tokens_reasoning|tokens_cache_read|tokens_cache_write|cost|session.agent|session.model",
    normalized: true,
  });
});

test("preserves explicit OR and natural-language queries", () => {
  assert.deepEqual(normalizeSearchQuery("auth | login | session"), {
    query: "auth|login|session",
    normalized: false,
  });
  assert.deepEqual(normalizeSearchQuery("where is the login handler?"), {
    query: "where is the login handler?",
    normalized: false,
  });
  assert.deepEqual(normalizeSearchQuery("GET /v1/orders"), {
    query: "GET /v1/orders",
    normalized: false,
  });
});

test("builds all five CodeMapper workflows", () => {
  assert.equal(TOOL_DEFINITIONS.length, 5);
  assert.deepEqual(
    buildToolCommands("codemapper_map", { path: "src" }).commands,
    [
      ["stats", "src", "--format", "ai"],
      ["map", "src", "--level", "2", "--format", "ai"],
    ],
  );
  assert.deepEqual(
    buildToolCommands("codemapper_outline", { file: "@README.md" }).commands,
    [["inspect", "README.md", "--tree", "--sizes", "--level", "3"]],
  );
  assert.equal(
    buildToolCommands("codemapper_expand", { symbol: "authenticate" }).commands.length,
    4,
  );
  assert.deepEqual(
    buildToolCommands("codemapper_path", { from: "main", to: "authenticate" }).commands,
    [["trace", "main", "authenticate", ".", "--format", "ai"]],
  );
});

test("converts MCP file roots", () => {
  const root = rootFromUri("file:///D:/WorkSpace/example");
  assert.match(root, /D:[\\/]WorkSpace[\\/]example$/);
});
