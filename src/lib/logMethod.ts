export enum LogLevel {
    ERROR,
    TEST,
    WARN,
    DEBUG,
    LOG,
    CMD,
    SQL,
}

/**
 * The prefixes allowed
 */
export type LogLevelKeys = keyof typeof LogLevel;
type Logger = typeof console.log;
export type LogArgs = Parameters<Logger>;
/**
 * The intermediate data structure
 */
export type LogMethod = {
    prefix: string;
    logger: Logger;
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

/**
 * if any parameters are missing, alerts the user
 * @param options detail assignment
 * @returns
 */
export const logMethodFactory = (options?: Partial<LogMethod>): LogMethod =>
    Object.assign(defaultLogMethod(), options);

/**
 * Allowed mapping of options
 */
export const logMethods = Object.keys(LogLevel).reduce((prev, key) => {
    if (isNaN(Number(key))) {
        prev[key as LogLevelKeys] = {
            prefix: `[ ${key} ]:`,
            logger:
                (console[key.toLowerCase() as keyof Console] as Logger) ??
                console.info,
        };
    }
    return prev;
}, {} as { [x in LogLevelKeys]: LogMethod });
