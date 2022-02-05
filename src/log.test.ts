import { defaultLogMethod, LogMethod, logMethodFactory } from "src";

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

test.todo("output call stack");
