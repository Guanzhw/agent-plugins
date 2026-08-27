import { spawn } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { delimiter, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_TIMEOUT_MS = 60_000;
const MAX_OUTPUT_BYTES = 1_000_000;
const SEARCH_LIMIT = 50;

export const TOOL_DEFINITIONS = [
  {
    name: "codemapper_search",
    description:
      "Search indexed symbol names, Markdown headings, and endpoints. Use one compact term or | separated alternatives. Whitespace-separated identifier lists are normalized to OR. This is not grep and does not search arbitrary source text.",
    inputSchema: objectSchema(
      {
        query: stringSchema(
          "Symbol/concept/route or alternatives, for example auth, Parser, session.agent|session.model, or GET /v1/orders.",
        ),
        path: stringSchema("Optional directory scope relative to root. Defaults to ."),
        root: rootSchema(),
        exact: booleanSchema("Use strict exact matching instead of fuzzy matching."),
      },
      ["query"],
    ),
  },
  {
    name: "codemapper_map",
    description:
      "Get repository or directory statistics and a level-2 file map before choosing files or search terms.",
    inputSchema: objectSchema({
      path: stringSchema("Optional directory scope relative to root. Defaults to ."),
      root: rootSchema(),
    }),
  },
  {
    name: "codemapper_outline",
    description:
      "List symbols in one code file, or headings in one Markdown file, without reading the entire file.",
    inputSchema: objectSchema(
      {
        file: stringSchema("File path relative to root. A leading @ is ignored."),
        root: rootSchema(),
      },
      ["file"],
    ),
  },
  {
    name: "codemapper_expand",
    description:
      "Expand a known symbol into its definition, callers, callees, and detected tests for impact analysis.",
    inputSchema: objectSchema(
      {
        symbol: stringSchema("Indexed symbol name, preferably copied from codemapper_search."),
        path: stringSchema("Optional directory scope relative to root. Defaults to ."),
        root: rootSchema(),
        fuzzy: booleanSchema("Allow partial symbol matching. Defaults to false."),
      },
      ["symbol"],
    ),
  },
  {
    name: "codemapper_path",
    description:
      "Find the shortest detected static call path between two confirmed symbols. An empty result does not prove runtime unreachability.",
    inputSchema: objectSchema(
      {
        from: stringSchema("Source symbol name."),
        to: stringSchema("Target symbol name."),
        path: stringSchema("Optional directory scope relative to root. Defaults to ."),
        root: rootSchema(),
        fuzzy: booleanSchema("Allow partial symbol matching. Defaults to false."),
      },
      ["from", "to"],
    ),
  },
];

export function normalizeSearchQuery(value) {
  const query = requireString(value, "query");
  if (query.includes("|")) {
    return {
      query: query
        .split("|")
        .map((part) => part.trim())
        .filter(Boolean)
        .join("|"),
      normalized: false,
    };
  }

  const terms = query.split(/\s+/).filter(Boolean);
  const endpointQuery =
    terms.length === 2 &&
    /^(?:GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)$/i.test(terms[0]) &&
    terms[1].startsWith("/");
  const identifierLike = terms.every((term) =>
    /^(?:[A-Za-z_$][\w.$:/-]*|\/[\w./:{}-]+)$/.test(term),
  );
  if (terms.length > 1 && terms.length <= 32 && identifierLike && !endpointQuery) {
    return { query: terms.join("|"), normalized: true };
  }
  return { query, normalized: false };
}

export function buildToolCommands(name, input = {}) {
  const path = optionalPath(input.path);

  switch (name) {
    case "codemapper_search": {
      const normalized = normalizeSearchQuery(input.query);
      return {
        normalizedQuery: normalized.normalized ? normalized.query : undefined,
        commands: [
          [
            "query",
            normalized.query,
            path,
            "--format",
            "ai",
            "--context",
            "full",
            "--limit",
            String(SEARCH_LIMIT),
            ...(input.exact === true ? ["--exact"] : []),
          ],
        ],
      };
    }
    case "codemapper_map":
      return {
        commands: [
          ["stats", path, "--format", "ai"],
          ["map", path, "--level", "2", "--format", "ai"],
        ],
      };
    case "codemapper_outline": {
      const file = requireString(input.file, "file").replace(/^@+/, "");
      const markdown = /\.(?:md|markdown)$/i.test(file);
      return {
        commands: [
          markdown
            ? ["inspect", file, "--tree", "--sizes", "--level", "3"]
            : ["inspect", file, "--format", "ai"],
        ],
      };
    }
    case "codemapper_expand": {
      const symbol = requireString(input.symbol, "symbol");
      const fuzzy = input.fuzzy === true ? ["--fuzzy"] : [];
      return {
        commands: [
          [
            "query",
            symbol,
            path,
            "--format",
            "ai",
            "--context",
            "full",
            ...(input.fuzzy === true ? [] : ["--exact"]),
          ],
          ["callers", symbol, path, "--format", "ai", ...fuzzy],
          ["callees", symbol, path, "--format", "ai", ...fuzzy],
          ["tests", symbol, path, "--format", "ai", ...fuzzy],
        ],
      };
    }
    case "codemapper_path":
      return {
        commands: [
          [
            "trace",
            requireString(input.from, "from"),
            requireString(input.to, "to"),
            path,
            "--format",
            "ai",
            ...(input.fuzzy === true ? ["--fuzzy"] : []),
          ],
        ],
      };
    default:
      throw new Error(`Unknown CodeMapper tool: ${name}`);
  }
}

export async function executeTool(name, input, activeRoot) {
  const root = resolveRoot(input?.root, activeRoot);
  const built = buildToolCommands(name, input);
  const runs = await Promise.all(
    built.commands.map((args) => runCm(root, args, DEFAULT_TIMEOUT_MS)),
  );
  return {
    tool: name,
    root,
    ...(built.normalizedQuery ? { normalizedQuery: built.normalizedQuery } : {}),
    runs,
  };
}

export function rootFromUri(uri) {
  if (typeof uri !== "string" || !uri.startsWith("file:")) return undefined;
  try {
    return fileURLToPath(uri);
  } catch {
    return undefined;
  }
}

function resolveRoot(requested, activeRoot) {
  const candidate =
    (typeof requested === "string" && requested.trim()) ||
    activeRoot ||
    process.env.CODEMAPPER_ROOT ||
    process.env.CODEX_WORKSPACE_ROOT ||
    process.cwd();
  const root = resolve(candidate);
  if (!existsSync(root) || !statSync(root).isDirectory()) {
    throw new Error(`CodeMapper root is not a directory: ${root}`);
  }
  return root;
}

function optionalPath(value) {
  if (value === undefined || value === null || value === "") return ".";
  if (typeof value !== "string") throw new Error("path must be a string");
  return value.replace(/^@+/, "").trim() || ".";
}

function requireString(value, field) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${field} must be a non-empty string`);
  }
  return value.trim();
}

async function runCm(cwd, args, timeoutMs) {
  const command = resolveCmBinary();
  const startedAt = Date.now();
  const result = await spawnBounded(command, args, cwd, timeoutMs);
  return {
    command: [command, ...args].map(shellQuote).join(" "),
    durationMs: Date.now() - startedAt,
    stdout: result.stdout,
    ...(result.stderr ? { stderr: result.stderr } : {}),
  };
}

function resolveCmBinary() {
  const configured = process.env.CODEMAPPER_BIN?.trim();
  if (configured) return configured;

  const names = process.platform === "win32" ? ["cm.exe", "cm"] : ["cm"];
  const localCandidates = names.map((name) => join(homedir(), ".local", "bin", name));
  for (const candidate of localCandidates) {
    if (existsSync(candidate)) return candidate;
  }

  for (const directory of (process.env.PATH ?? "").split(delimiter)) {
    if (!directory) continue;
    for (const name of names) {
      const candidate = join(directory, name);
      if (existsSync(candidate)) return candidate;
    }
  }
  return names[0];
}

function spawnBounded(command, args, cwd, timeoutMs) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, {
      cwd,
      env: { ...process.env, NO_COLOR: "1", TERM: "dumb" },
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = Buffer.alloc(0);
    let stderr = Buffer.alloc(0);
    let outputExceeded = false;
    let timedOut = false;

    const append = (current, chunk) => {
      const combined = Buffer.concat([current, chunk]);
      if (combined.length <= MAX_OUTPUT_BYTES) return combined;
      outputExceeded = true;
      child.kill();
      return combined.subarray(0, MAX_OUTPUT_BYTES);
    };

    child.stdout.on("data", (chunk) => {
      stdout = append(stdout, chunk);
    });
    child.stderr.on("data", (chunk) => {
      stderr = append(stderr, chunk);
    });

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill();
    }, timeoutMs);

    child.on("error", (error) => {
      clearTimeout(timer);
      if (error.code === "ENOENT") {
        reject(
          new Error(
            "CodeMapper is unavailable because `cm` was not found. Install it or set CODEMAPPER_BIN to the executable path.",
          ),
        );
        return;
      }
      reject(error);
    });

    child.on("close", (code, signal) => {
      clearTimeout(timer);
      const stdoutText = stdout.toString("utf8").trimEnd();
      const stderrText = stderr.toString("utf8").trimEnd();
      if (timedOut) {
        reject(new Error(`CodeMapper timed out after ${timeoutMs} ms.`));
      } else if (outputExceeded) {
        reject(new Error(`CodeMapper output exceeded ${MAX_OUTPUT_BYTES} bytes.`));
      } else if (code !== 0) {
        reject(
          new Error(
            `CodeMapper exited with ${code ?? signal ?? "unknown"}: ${stderrText || stdoutText || "no output"}`,
          ),
        );
      } else {
        resolvePromise({ stdout: stdoutText, stderr: stderrText });
      }
    });
  });
}

function objectSchema(properties, required = []) {
  return {
    type: "object",
    properties,
    required,
    additionalProperties: false,
  };
}

function stringSchema(description) {
  return { type: "string", description };
}

function booleanSchema(description) {
  return { type: "boolean", description };
}

function rootSchema() {
  return stringSchema(
    "Absolute repository root. Prefer passing Codex's current workspace root; otherwise the server uses the active MCP root.",
  );
}

function shellQuote(value) {
  return /^[A-Za-z0-9_./:@=\\-]+$/.test(value) ? value : JSON.stringify(value);
}
