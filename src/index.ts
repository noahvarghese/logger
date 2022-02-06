import { getStackFrame } from "./lib/callstack";

enum LogLevel {
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
type LogLevelKeys = keyof typeof LogLevel;
type Logger = typeof console.log;
type LogArgs = Parameters<Logger>;
/**
 * The intermediate data structure
 */
type LogMethod = {
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

export default class Logs {
    private static logLevel: LogLevel = 0;

    public static init = (disabled = false) => {
        if (disabled) Logs.logLevel = -1;
        else {
            const level = process.env["LOG_LEVEL"] ?? "";
            if (!level || level.trim() === "" || isNaN(Number(level)))
                throw new Error("log level not set");
            Logs.logLevel = Number(level);
        }
    };

    /**
     *
     * @param logLevel the number, not the key
     * @param args the items to print
     */
    private static add = (
        logLevel: LogLevel,
        ...args: Parameters<typeof console.log>
    ): void => {
        if (logLevel <= Logs.logLevel) {
            if (logLevel >= Object.keys(logMethods).length)
                throw new Error(`no log method for log level ${logLevel}`);

            const { prefix, logger }: LogMethod =
                logMethods[LogLevel[logLevel] as LogLevelKeys] ??
                defaultLogMethod();
            logger(prefix, ...args);
        }
    };

    public static Error = (...args: LogArgs): void =>
        Logs.add(LogLevel.ERROR, ...args, getStackFrame(3));

    public static Test = (...args: LogArgs): void =>
        Logs.add(LogLevel.TEST, ...args, getStackFrame(3));

    public static Warn = (...args: LogArgs): void =>
        Logs.add(LogLevel.WARN, ...args);

    public static Debug = (...args: LogArgs): void =>
        Logs.add(LogLevel.DEBUG, ...args, getStackFrame(3));

    public static Log = (...args: LogArgs): void =>
        Logs.add(LogLevel.LOG, ...args);

    public static Cmd = (...args: LogArgs): void =>
        Logs.add(LogLevel.CMD, ...args);

    public static Sql = (...args: LogArgs): void =>
        Logs.add(LogLevel.SQL, ...args);
}
