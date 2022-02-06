import child from "child_process";
import fs from "fs";
import Logs, { defaultLogMethod, logMethodFactory } from "src";

test("empty log method", () => {
    let errorThrown = false;
    const def = defaultLogMethod();

    expect(def.prefix).toBe("NOT IMPLEMENTED");

    try {
        def.logger();
    } catch (_e) {
        errorThrown = true;
        const { message } = _e as Error;
        expect(message).toBe("log method not implemented");
    }

    expect(errorThrown).toBe(true);
});

test("log factory", () => {
    const prefix = "CUSTOM";
    let called = false;

    const logger = () => {
        called = true;
    };

    const logMethod = logMethodFactory({ prefix, logger });

    logMethod.logger();

    expect(called).toBe(true);
    expect(logMethod.prefix).toBe(prefix);
});

describe("init", () => {
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

        test.each(cases)(
            "%p",
            async ({ enabled, errMessage, message, logger }) => {
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
            }
        );
    });
});
