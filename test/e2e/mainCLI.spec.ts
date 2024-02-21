import {expect} from "chai";
import {exec, spawn} from "child_process";
import * as path from "path";
import split from "split2";

// Helper function to run the CLI and capture output
function runCLI(args: string): Promise<string> {
    return new Promise((resolve, reject) => {
        exec(`ts-node src/Main.ts ${args}`, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve(stdout || stderr);
            }
        });
    });
}

describe("REPL Mode Tests", function () {
    this.timeout(10000); // Extend timeout for async operations

    it("should start and exit correctly", (done) => {
        const repl = spawn("yarn", ["start"]);
        repl.stdout.pipe(split()).on("data", (line: string) => {
            console.log("REPL Output:", line); // log the output line
        });

        repl.stdin.write("exit\n");

        repl.on("close", (code) => {
            expect(code).to.equal(0);
            done();
        });

        repl.stderr.on("data", (data) => {
            console.error("REPL Error:", data.toString());
            done(new Error(`REPL stderr output: ${data}`));
        });
    });

    it("should correctly process the command 1+1", (done) => {
        const repl = spawn("yarn", ["start"]);
        let commandSent = false;
        let commandOutputReceived = false;

        repl.stdout.pipe(split()).on("data", (line: string) => {
            console.log("REPL Output:", line);
            // Once the REPL is ready, send the command 1+1
            if (!commandSent) {
                repl.stdin.write("1+1;\n");
                commandSent = true;
            }

            // Check for the expected output from the command 1+1
            if (commandSent && line.includes("2")) {
                commandOutputReceived = true;
                // After verifying the command's output, send the exit command
                repl.stdin.write("exit\n");
            }
        });

        repl.on("close", (code) => {
            // Ensure the REPL exited cleanly and the expected output was received
            if (code === 0 && commandOutputReceived) {
                done();
            } else {
                done(new Error(`Test failed: Unexpected REPL exit code ${code} or command output not received`));
            }
        });

        repl.stderr.on("data", (data) => {
            console.error("REPL Error:", data.toString());
            done(new Error(`REPL stderr output: ${data}`));
        });
    });
});

describe("Farm DSL CLI", function () {
    this.timeout(5000);

    it("executes a file with valid DSL code", async () => {
        const filePath = path.join(__dirname, "..", "..", "examples", "ex4.frm");
        const result = await runCLI(`--file "${filePath}"`);
        expect(result).to.include("");
    });

    it("provides verbose output when requested", async () => {
        const filePath = path.join(__dirname, "..", "..", "examples", "ex4.frm");
        const result = await runCLI(`--file "${filePath}" --verbose`);
        console.log(result);
        expect(result).to.include(
            `(decl_stmt (type Farm) farm = (pairs [ (pair Name : (expr "myFarm")) , (pair Height : (expr 10)) , (pair Width : (expr 10)) , (pair Polyculture : (expr true)) , (pair MaxWaterUsage : (expr 1500)) , (pair Season : (expr "Summer")) ]) ;)`,
        );
    });
});
