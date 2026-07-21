const { spawn } = require("child_process");
const cp = spawn("firebase", ["login:ci", "--no-localhost"], {
  stdio: ["pipe", "pipe", "pipe"],
  env: { ...process.env, CI: "false", FIREBASE_CLI_PREVIEWS: "login" },
  shell: true,
});

let output = "";
cp.stdout.on("data", (d) => (output += d.toString()));
cp.stderr.on("data", (d) => (output += d.toString()));
cp.on("close", () => console.log(output));
cp.on("error", (e) => console.error(e));

// Send a newline to try to trigger interactive mode
setTimeout(() => {
  cp.stdin.write("\n");
  cp.stdin.end();
}, 2000);

setTimeout(() => {
  if (!cp.killed) cp.kill();
  console.log(output);
  process.exit(0);
}, 10000);
