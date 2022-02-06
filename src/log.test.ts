import Logs, {
    defaultLogMethod,
    LogMethod,
    logMethodFactory,
    outputCallStack,
} from "src";

test("empty log method", () => {
    let errorThrown = false;
    const def: LogMethod = defaultLogMethod();

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

describe("output call stack", () => {
    test("valid", () => {
        expect(outputCallStack(3)).toBe(
            "at Promise.then.completed (/home/user/build/ts-log/node_modules/jest-circus/build/utils.js:391:28)"
        );
    });

    describe("invalid", () => {
        test("index to large", () => {
            const index = Infinity;
            let errorThrown = false;
            try {
                expect(outputCallStack(index));
            } catch (_e) {
                const { message } = _e as Error;
                expect(message).toBe(`Index ${index} out of bounds`);
                errorThrown = true;
            }
            expect(errorThrown).toBe(true);
        });

        test("stack frame doesnt have any characters", () => {
            let errorThrown = false;
            try {
                expect(outputCallStack(0, 7));
            } catch (_e) {
                const { message } = _e as Error;
                expect(message).toBe(
                    `call stack entry shorter than the trim length`
                );
                errorThrown = true;
            }
            expect(errorThrown).toBe(true);
        });
    });
});

describe("init", () => {
    const logLevel = "69";

    beforeEach(() => {
        jest.resetModules();
        process.env["LOG_LEVEL"] = logLevel;
    });

    test("disabled", async () => {
        const disabled = true;
        Logs.init(disabled);
        expect(Logs.logLevel).toBe(-1);
    });

    test("enabled", async () => {
        const disabled = false;
        Logs.init(disabled);
        expect(Logs.logLevel).toBe(Number(logLevel));
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
});
