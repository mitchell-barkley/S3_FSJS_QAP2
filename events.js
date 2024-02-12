const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
const { format, getYear } = require("date-fns");
const { v4: uuid } = require("uuid");
const EventEmitter = require("events");
const { get } = require("http");
class MyEmitter extends EventEmitter {}
const myEmitter = new EventEmitter();
const DEBUG = true;

myEmitter.on("route", async (url) => {
    const currentDate = new Date();
    const year = getYear(currentDate);
    const month = format(currentDate, "MM");
    const day = format(currentDate, "dd");
    const logFolder = path.join(__dirname, "logs", String(year), String(month), String(day));
    try {
        await fsPromises.mkdir(logFolder, { recursive: true });
        const d = format(currentDate, "yyyyMMdd\tHH:mm:ss");
        if (DEBUG) console.log(`Route Event on: ${url} at ${d}`);
        const logItem = `Route Event on: ${url} at ${d}`;
        const fileName = `${format(currentDate, "yyyyMMdd")}_route.log`;
        await fsPromises.appendFile(
            path.join(String(logFolder), String(fileName)),
            logItem + "\n"
        );
    } catch (err) {
        console.log(err);
}

    // fs.appendFile(
    //     path.join(__dirname, "logs", "route.log"),
    //     `Route Event on: ${url} at ${d}\n`,
    //     (err) => {
    //         if (err) throw err;
    //     }
    // );
});

myEmitter.on("error", async (message) => {
    const currentDate = new Date();
    const year = getYear(currentDate);
    const month = format(currentDate, "MM");
    const day = format(currentDate, "dd");
    const logFolder = path.join(__dirname, "logs", year, month, day);
    try {
        await fsPromises.mkdir(logFolder, { recursive: true });
        const d = format(currentDate, "yyyyMMdd\tHH:mm:ss");
        if (DEBUG) console.log(`Error: ${message} at ${d}`);
        const logItem = `Error: ${message} at ${d}\n`;
        const fileName = `${format(currentDate, "yyyyMMdd")}_error.log`;
        await fsPromises.appendFile(
            path.join(String(logFolder), String(fileName)),
            logItem
        );
    } catch (err) {
        console.log(err);
    }

    // if (DEBUG) console.log(`Error: ${message} at ${d}`);
    // if (!fs.existsSync(path.join(__dirname, "logs"))) {
    //     fs.mkdirSync(path.join(__dirname, "logs"));
    // }
    // fs.appendFile(
    //     path.join(__dirname, "logs", "error.log"),
    //     `Error: ${message} at ${d}\n`,
    //     (err) => {
    //         if (err) throw err;
    //     }
    // );
});

myEmitter.on("event", async (event, level, message) => {
    if(DEBUG) console.log(`Event: ${event} - ${level} - ${message}`);
    const currentDate = new Date();
    const year = getYear(currentDate);
    const month = format(currentDate, "MM");
    const day = format(currentDate, "dd");
    const logFolder = path.join(__dirname, "logs", year, month, day);

    // try {
    //     const currFolder = "logs/" + getYear(new Date());
    //     if (!fs.existsSync(path.join(__dirname, "logs/"))) {
    //         await fsPromises.mkdir(path.join(__dirname, "logs/"));
    //         if (!fs.existsSync(path.join(__dirname, currFolder))) {
    //             await fsPromises.mkdir(path.join(__dirname, currFolder));
    //         }
    //     } else {
    //         if (!fs.existsSync(path.join(__dirname, currFolder))) {
    //             await fsPromises.mkdir(path.join(__dirname, currFolder));
    //         }
    //     }
    // } catch (err) {
    //     console.log(err);
    // }

    try {
        await fsPromises.mkdir(logFolder, { recursive: true });
        const dateTime = format(currentDate, "yyyyMMdd\tHH:mm:ss");
        const logItem = `${dateTime}\t${level}\t${event}\t${message}\t${uuid()}`;
        if (DEBUG) console.log(logItem);
        const fileName = `${format(currentDate, "yyyyMMdd")}` + "_http_events.log";
        await fsPromises.appendFile(
            path.join(String(logFolder), String(fileName)),
            logItem + "\n"
        );
    } catch (err) {
        console.log(err);
    }
});

module.exports = myEmitter;
