import { spawn } from "node:child_process";

const packageArgs = process.argv.slice(2);
if (packageArgs.length === 0) {
  console.error("launch-npx requires an npm package and optional arguments");
  process.exit(2);
}

const isWindows = process.platform === "win32";
const command = isWindows ? process.env.ComSpec || "cmd.exe" : "npx";
const args = isWindows
  ? ["/d", "/v:off", "/s", "/c", "npx.cmd", ...packageArgs]
  : packageArgs;

const child = spawn(command, args, {
  stdio: "inherit",
  windowsHide: true,
});

child.on("error", (error) => {
  console.error("failed to start npx: " + error.message);
  process.exitCode = 1;
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => child.kill(signal));
}

child.on("exit", (code) => {
  process.exitCode = code ?? 1;
});
