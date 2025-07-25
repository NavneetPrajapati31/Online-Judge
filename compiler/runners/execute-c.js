const fs = require("fs");
const path = require("path");
const { exec, spawn } = require("child_process");

const outputPath = path.join(__dirname, "../outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeC = async (filePath, input = "") => {
  const outputId = path.basename(filePath).split(".")[0];
  const isWindows = process.platform === "win32";
  const outputExtension = isWindows ? ".exe" : ".out";
  const outputFilename = `${outputId}${outputExtension}`;
  const outPath = path.join(outputPath, outputFilename);

  return new Promise((resolve, reject) => {
    const compileCommand = isWindows
      ? `gcc "${filePath}" -o "${outPath}"`
      : `gcc "${filePath}" -o "${outPath}"`;
    // Compile first
    exec(compileCommand, (compileError, _, compileStderr) => {
      if (compileError) {
        reject({ error: compileError, stderr: compileStderr });
        return;
      }
      // Run the executable
      const runCommand = isWindows
        ? `${outputFilename}`
        : `./${outputFilename}`;
      const runOptions = { cwd: outputPath };
      const child = spawn(runCommand, [], runOptions);
      let stdout = "";
      let stderr = "";
      child.stdin.write(input);
      child.stdin.end();
      child.stdout.on("data", (data) => {
        stdout += data;
      });
      child.stderr.on("data", (data) => {
        stderr += data;
      });
      child.on("close", (code) => {
        if (code !== 0) {
          reject({ error: `Process exited with code ${code}`, stderr });
        } else {
          resolve({ stdout, stderr });
        }
      });
      child.on("error", (err) => {
        reject({ error: err, stderr });
      });
    });
  });
};

module.exports = { executeC };
