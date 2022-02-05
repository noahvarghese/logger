export enum LogLevels {
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

/**
 * get the details from the call stack at the provided index
 * @param index
 * @returns
 */
export const outputCallStack = (index: number): string => {
    const { stack } = new Error();
    const frame = stack?.split("\n")[index] ?? "";
    return frame.substring(4);
};
