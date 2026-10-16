import assert from "node:assert/strict";
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const expectedPlugins = ["codefacts", "repo-ai-discipline", "agentsession"];
const expectedMcpPackages = {
  codefacts: "codefacts@0.2.1",
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

    if (entry.name === "codefacts") {
      assert.equal(manifest.mcpServers, "./.claude-mcp.json");
      const mcp = JSON.parse(await readFile(path.join(pluginRoot, manifest.mcpServers), "utf8"));
      assert.equal(mcp.mcpServers.codefacts.command, "node");
      assert.equal(mcp.mcpServers.codefacts.args[0], "${CLAUDE_PLUGIN_ROOT}/scripts/launch-npx.mjs");
      assert.ok(mcp.mcpServers.codefacts.args.includes(expectedMcpPackages.codefacts));
      assert.equal(mcp.mcpServers.codefacts.cwd, undefined);
      assert.equal(mcp.mcpServers.codefacts.startup_timeout_sec, undefined);
    }
  }
});

test("CodeFacts host-resolved launchers work outside a plugin root containing spaces", async () => {
  const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), "codefacts host launch "));
  try {
    const pluginRoot = path.join(temporaryRoot, "plugin root");
    const unrelatedCwd = path.join(temporaryRoot, "unrelated working directory");
    const stubBin = path.join(temporaryRoot, "stub bin");
    await Promise.all([
      mkdir(path.join(pluginRoot, "scripts"), { recursive: true }),
      mkdir(unrelatedCwd),
      mkdir(stubBin),
    ]);
    await copyFile(
      path.join(root, "plugins/codefacts/scripts/launch-npx.mjs"),
      path.join(pluginRoot, "scripts/launch-npx.mjs"),
    );
    const isWindows = process.platform === "win32";
    await writeFile(
      path.join(stubBin, isWindows ? "npx.cmd" : "npx"),
      isWindows ? "@echo off\r\necho %*\r\nexit /b 7\r\n" : '#!/bin/sh\nprintf "%s\\n" "$*"\nexit 7\n',
      { mode: 0o755 },
    );
    const defaults = JSON.parse(await readFile(path.join(root, "plugins/codefacts/.mcp.json"), "utf8"));
    const claudeManifest = JSON.parse(await readFile(path.join(root, "plugins/codefacts/.claude-plugin/plugin.json"), "utf8"));
    const claudeOverride = JSON.parse(await readFile(path.join(root, "plugins/codefacts", claudeManifest.mcpServers), "utf8"));
    // Codex resolves cwd against the plugin root. Claude merges its manifest
    // override after .mcp.json, expands args, and inherits the host cwd.
    const claudeServers = { ...defaults.mcpServers, ...claudeOverride.mcpServers };
    const cases = [
      { host: "Codex", server: defaults.mcpServers.codefacts, cwd: path.resolve(pluginRoot, defaults.mcpServers.codefacts.cwd) },
      { host: "Claude", server: claudeServers.codefacts, cwd: unrelatedCwd },
    ];
    for (const { host, server, cwd } of cases) {
      const args = server.args.map((arg) => arg.replaceAll("${CLAUDE_PLUGIN_ROOT}", pluginRoot));
      const result = spawnSync(process.execPath, args, {
        cwd,
        env: { ...process.env, PATH: `${stubBin}${path.delimiter}${process.env.PATH}` },
        encoding: "utf8",
        windowsHide: true,
      });
      assert.ifError(result.error);
      assert.equal(result.status, 7, `${host}: ${result.stderr}`);
      assert.equal(result.stdout.trim(), "--yes codefacts@0.2.1 mcp", host);
    }
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
});
