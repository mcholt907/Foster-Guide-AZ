// PostToolUse hook: run `tsc --noEmit` in web/ when an Edit/Write touches a TS file there.
// Stays silent on success, prints the first 30 lines of tsc output on failure.
// Reads tool_input JSON from stdin (no jq dependency).

let buf = "";
process.stdin.on("data", c => (buf += c));
process.stdin.on("end", () => {
  let filePath = "";
  try {
    filePath = (JSON.parse(buf)?.tool_input?.file_path || "").replace(/\\/g, "/");
  } catch {
    return;
  }
  if (!/(^|\/)web\/.*\.(ts|tsx)$/.test(filePath)) return;

  const { execSync } = require("child_process");
  try {
    execSync("npx tsc --noEmit", { cwd: "web", stdio: "pipe" });
  } catch (e) {
    const out =
      (e.stdout?.toString() || "") + (e.stderr?.toString() || "");
    console.error(out.split("\n").slice(0, 30).join("\n"));
    process.exit(1);
  }
});