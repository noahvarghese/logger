import path from "path";
import { logMethods } from "src";
import { getStackFrame } from "./callstack";

test("valid", () => {
    expect(getStackFrame(3)).toBe(
        `at Promise.then.completed (${path.resolve(
            `${__dirname}/../../node_modules/jest-circus/build/utils.js`
        )}:391:28)`
    );
});

describe("invalid", () => {
    test("index to large", () => {
        const index = Infinity;
        let errorThrown = false;
        try {
            expect(getStackFrame(index));
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
            // The error is prefixed with the error type being thrown in this case 'Error:' which has a length of 7
            expect(getStackFrame(0, 7));
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

test("test", () => {
    console.log(logMethods);
});
