import { defaultLogMethod, LogMethod } from "src";

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
