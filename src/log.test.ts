import child from "child_process";
import fs from "fs";
import Logs from "src";

const logLevel = "69";

beforeEach(() => {
    jest.resetModules();
    process.env["LOG_LEVEL"] = logLevel;
});

test("invalid log level", () => {
    process.env["LOG_LEVEL"] = "";

    let errorThrown = false;

    try {
        Logs.init();
    } catch (_e) {
        const { message } = _e as Error;
        errorThrown = true;
        expect(message).toBe("log level not set");
    }

    expect(errorThrown).toBe(true);
});

test("no log level", () => {
    delete process.env["LOG_LEVEL"];

    let errorThrown = false;

    try {
        Logs.init();
    } catch (_e) {
        const { message } = _e as Error;
        errorThrown = true;
        expect(message).toBe("log level not set");
    }

    expect(errorThrown).toBe(true);
});

describe("test output", () => {
    const cases = [
        {
            enabled: true,
            errMessage: /^\[ ERROR \]: test/,
            message: "",
            logger: "Error",
        },
        { enabled: false, errMessage: "", message: "", logger: "Error" },
        {
            enabled: true,
            errMessage: "",
            message: /^\[ TEST \]: test/,
            logger: "Test",
        },
        { enabled: false, errMessage: "", message: "", logger: "Test" },
    ];

    test.each(cases)("%p", async ({ enabled, errMessage, message, logger }) => {
        let stdErr = "",
            stdOut = "";

        const fn = "/tmp/test.ts";
        fs.writeFileSync(
            fn,
            `import Logs from '${__dirname}';\nLogs.init();\nLogs.${logger}('test');\n`
        );

        ({ stdout: stdOut, stderr: stdErr } = await new Promise<{
            stdout: string;
            stderr: string;
        }>((res, rej) => {
            child.exec(
                `LOG_LEVEL=${
                    enabled ? 10 : -1
                } ./node_modules/.bin/ts-node ${fn}`,
                (err, stdout, stderr) => {
                    if (err) rej(err);
                    res({ stderr, stdout });
                }
            );
        }));

        fs.unlinkSync(fn);

        expect(stdErr).toMatch(errMessage);
        expect(stdOut).toMatch(message);
    });
});

describe("test valid configurations", () => {
    const cases = [
        { fn: Logs.Error, logLevel: 0 },
        { fn: Logs.Error, logLevel: -1 },
        { fn: Logs.Test, logLevel: 0 },
        { fn: Logs.Test, logLevel: -1 },
        { fn: Logs.Warn, logLevel: 0 },
        { fn: Logs.Warn, logLevel: -1 },
        { fn: Logs.Debug, logLevel: 0 },
        { fn: Logs.Debug, logLevel: -1 },
        { fn: Logs.Log, logLevel: 0 },
        { fn: Logs.Log, logLevel: -1 },
        { fn: Logs.Cmd, logLevel: 0 },
        { fn: Logs.Cmd, logLevel: -1 },
        { fn: Logs.Sql, logLevel: 0 },
        { fn: Logs.Sql, logLevel: -1 },
    ];

    test.each(cases)("%p", ({ logLevel, fn }) => {
        Logs.init(logLevel === 0);
        fn();
    });
});
