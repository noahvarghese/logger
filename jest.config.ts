import Logs from "./src/util/logs";

if (process.argv.includes("--listTests") === false) {
    Logs.Event("Jest config loaded");
}

export default {
    bail: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    collectCoverageFrom: ["src/**/*.ts", "!src/**/*.test.ts"],
    coverageReporters: ["json", "json-summary", "lcov", "text"],
    detectOpenHandles: true,
    errorOnDeprecated: true,
    forceExit: true,
    maxConcurrency: 1,
    maxWorkers: 1,
    moduleDirectories: ["node_modules", "./"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    setupFiles: ["dotenv/config"],
    setupFilesAfterEnv: ["./jest.setup.ts"],
    reporters: [
        "default",
        [
            "./node_modules/jest-html-reporter",
            {
                dateFormat: "yyyy-mm-dd HH:MM:ss",
                includeConsoleLog: true,
                includeFailureMsg: true,
                includeSuiteFailure: true,
                outputPath: "./test-report.html",
                pageTitle: "Test Report",
            },
        ],
    ],
    roots: ["src"],
    testEnvironment: "node",
    testRegex: "/src/.*\\.(test|spec)?\\.(ts|tsx)$",
    transform: {
        "^.+\\.ts?$": "ts-jest",
    },
    verbose: false,
};
