import { getStackFrame } from "./lib/callstack";
import {
    LogLevel,
    logMethods,
    defaultLogMethod,
    LogArgs,
    LogLevelKeys,
    LogMethod,
} from "./lib/logMethod";

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
