![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
<br />
![npm](https://badges.aleen42.com/src/npm.svg)
<br />
<br />
![Continuous Deployment](https://github.com/noahvarghese/logger/actions/workflows/cd.yaml/badge.svg)
<br />
![Continuous Integration](https://github.com/noahvarghese/logger/actions/workflows/ci.yaml/badge.svg)
<br />
<br />
![Statements](https://img.shields.io/badge/statements-96.77%25-brightgreen.svg?style=flat)
<br/>
![Lines](https://img.shields.io/badge/lines-98.18%25-brightgreen.svg?style=flat)
<br/>
![Functions](https://img.shields.io/badge/functions-100%25-brightgreen.svg?style=flat)
<br/>
![Branches](https://img.shields.io/badge/branches-89.28%25-yellow.svg?style=flat)
<br/>
<br/>
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
<br />
<br />

<img src="https://raw.githubusercontent.com/noahvarghese/logger/main/assets/log.png" width="100" alt="log" />

# Logger

Javascript/Typescript logger. Basic right now, just used to share implementation across projects. At some point may be able to store logs instead of just outputting to std{err,out}.

## Installation

```bash
npm i @noahvarghese/logger
```

## Usage

```typescript
import Logger from "@noahvarghese/logger";

// Typically set in a .env file, on deployment, or within CI
process.env["LOG_LEVEL"] = 7;

/**
 * Setting the environment variable LOG_LEVEL dictates which logging calls will be output
 * The numbers are the environment variable options
 * -1 to disable all
 *
 * enum LogLevel {
 * ERROR=0,
 * TEST=1,
 * WARN=2,
 * DEBUG=3,
 * LOG=4,
 * CMD=5,
 * SQL=6
 * }
 *
 */

// Can override environment and turn off all logs by passing true to the init function
const disableLogs = false;

// Required to load environment variable into class
Logs.init(disableLogs);

// Sample calls and output
Logs.Error("error"); // [ ERROR ]: error [path to function where error ocurred]

Logs.Test("test"); // [ TEST ]: test [path to function where error ocurred]

Logs.Warn("warn"); // [ WARN ]: warn [path to function where error ocurred]

Logs.Debug("debug"); // [ DEBUG ]: debug [path to function where error ocurred]

Logs.Log("log"); // [ LOG ]: log

Logs.Cmd("cmd"); // [ CMD ]: cmd

Logs.Sql("sql"); // [ SQL ]: sql
```

## Development - Getting Started

```bash
git clone https://github.com/noahvarghese/logger
cd ./logger
npm i
npm run init
```
