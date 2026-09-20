import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const expectedPlugins = ["codefacts", "repo-ai-discipline", "agentsession"];
const expectedMcpPackages = {
  codefacts: "codefacts@0.1.15",
  agentsession: "@acetamido/agentsession-mcp@1.9.2",
};

test("Pi package exposes only the host-neutral repository discipline skill", async () => {
  const manifest = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));

  assert.ok(manifest.keywords.includes("pi-package"));
  assert.deepEqual(manifest.pi, {
    skills: ["./plugins/repo-ai-discipline/skills"],
  });
});

test("Codex marketplace entries resolve to matching plugin manifests", async () => {
  const marketplace = JSON.parse(
    await readFile(path.join(root, ".agents", "plugins", "marketplace.json"), "utf8"),
  );

  assert.equal(marketplace.name, "guanzhw");
  assert.deepEqual(
    marketplace.plugins.map((entry) => entry.name),
    expectedPlugins,
  );

  for (const entry of marketplace.plugins) {
    assert.equal(entry.source.source, "local");
    assert.match(entry.source.path, /^\.\/plugins\//);
    assert.ok(entry.policy?.installation);
    assert.ok(entry.policy?.authentication);
    assert.ok(entry.category);

    const pluginRoot = path.resolve(root, entry.source.path);
    const manifest = JSON.parse(
      await readFile(path.join(pluginRoot, ".codex-plugin", "plugin.json"), "utf8"),
    );
    assert.equal(manifest.name, entry.name);
    assert.match(manifest.version, /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/);

    if (manifest.mcpServers) {
      assert.equal(manifest.mcpServers, "./.mcp.json");
      const mcp = JSON.parse(await readFile(path.join(pluginRoot, ".mcp.json"), "utf8"));
      const servers = Object.values(mcp.mcpServers);
      assert.equal(servers.length, 1);
      assert.equal(servers[0].command, "node");
      assert.equal(servers[0].cwd, ".");
      assert.equal(servers[0].args[0], "./scripts/launch-npx.mjs");
      assert.ok(servers[0].args.includes(expectedMcpPackages[entry.name]));
      assert.equal(servers[0].startup_timeout_sec, 120);
      await readFile(path.join(pluginRoot, "scripts", "launch-npx.mjs"), "utf8");
    }
  }
});

test("Claude marketplace entries resolve to matching plugin manifests", async () => {
  const marketplace = JSON.parse(
    await readFile(path.join(root, ".claude-plugin", "marketplace.json"), "utf8"),
  );

  assert.equal(marketplace.name, "guanzhw");
  assert.deepEqual(
    marketplace.plugins.map((entry) => entry.name),
    expectedPlugins,
  );

  for (const entry of marketplace.plugins) {
    assert.match(entry.source, /^\.\/plugins\//);
    const pluginRoot = path.resolve(root, entry.source);
    const manifest = JSON.parse(
      await readFile(path.join(pluginRoot, ".claude-plugin", "plugin.json"), "utf8"),
    );
    assert.equal(manifest.name, entry.name);
    assert.equal(manifest.version, entry.version);
  }
});
