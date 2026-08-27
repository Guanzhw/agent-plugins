import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("marketplace entries resolve to matching plugin manifests", async () => {
  const marketplace = JSON.parse(
    await readFile(path.join(root, ".agents", "plugins", "marketplace.json"), "utf8"),
  );

  assert.equal(marketplace.name, "guanzhw");
  assert.ok(marketplace.plugins.length > 0);

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
  }
});
