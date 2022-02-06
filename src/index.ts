export enum LogLevel {
    ERROR,
    TEST,
    WARN,
    DEBUG,
    LOG,
    SQL,
}

/**
 * The only good thing of console.log is the accumulator for the arguments
 */
export type LogMethod = {
    prefix: string;
    logger: typeof console.log;
};

/**
 * Strictly exists as a base case to tell the caller that they made an error
 * @returns An error
 */
export const defaultLogMethod = (): LogMethod => ({
    prefix: "NOT IMPLEMENTED",
    logger: () => {
        throw new Error("log method not implemented");
    },
});

export const logMethodFactory = (options?: Partial<LogMethod>): LogMethod =>
    Object.assign(defaultLogMethod(), options);

export const logMethods = Object.entries(LogLevel).reduce(
    (prev, [currKey, currVal]) => {
        if (isNaN(Number(currKey))) {
            prev[currKey as unknown as LogLevel] = {
                prefix: `[ ${currKey} ]`,
                logger: console[
                    currVal as keyof typeof console
                ] as typeof console.log,
            };
        }
        return prev;
    },
    [] as { prefix: string; logger: typeof console.log }[]
);

/**
 * get the details from the call stack at the provided index
 * @param index
 * @returns
 */
export const outputCallStack = (index: number, frontTrimLength = 4): string => {
    const { stack } = new Error();
    if (!stack) throw new Error("No call stack provided");

    const frames = stack.split("\n");

    const f = frames[index];

    if (!f) throw new Error(`Index ${index} out of bounds`);

    // tab width is 4 characters, we are trimming the tab
    if (f.length <= frontTrimLength)
        throw new Error("call stack entry shorter than the trim length");
    return f.substring(frontTrimLength);
};

export default class Logs {
    public static logLevel: LogLevel = 0;

    public static init = (disabled = false) => {
        if (disabled) Logs.logLevel = -1;
        else {
            const level = process.env["LOG_LEVEL"] ?? "";
            if (!level || level.trim() === "" || isNaN(Number(level)))
                throw new Error("log level not set");
            Logs.logLevel = Number(level);
        }
    };
}
