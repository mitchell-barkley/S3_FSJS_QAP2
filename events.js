const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
const { format, getYear } = require("date-fns");
const { v4: uuid } = require("uuid");
const EventEmitter = require("events");
class MyEmitter extends EventEmitter {}
const myEmitter = new EventEmitter();
const DEBUG = true;

myEmitter.on("route", (url) => {
    const d = new Date();
    if (DEBUG) console.log(`Route Event on: ${url} at ${d}`);
    if (!fs.existsSync(path.join(__dirname, "logs"))) {
        fs.mkdirSync(path.join(__dirname, "logs"));
    }
    fs.appendFile(
        path.join(__dirname, "logs", "route.log"),
        `Route Event on: ${url} at ${d}\n`,
        (err) => {
        if (err) throw err;
        }
    );
    });

myEmitter.on("error", (message) => {
    const d = new Date();
    if (DEBUG) console.log(`Error: ${message} at ${d}`);
    if (!fs.existsSync(path.join(__dirname, "logs"))) {
        fs.mkdirSync(path.join(__dirname, "logs"));
    }
    fs.appendFile(
        path.join(__dirname, "logs", "error.log"),
        `Error: ${message} at ${d}\n`,
        (err) => {
        if (err) throw err;
        }
    );
    });

myEmitter.on("event", async (event, level, message) => {
    if(DEBUG) console.log(`Event: ${event} - ${level} - ${message}`);
    const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
    const logItem = `${dateTime}\t${level}\t${event}\t${message}\t${uuid()}`;
    try {
        const currFolder = "logs/" + getYear(new Date());
        if (!fs.existsSync(path.join(__dirname, "logs/"))) {
            await fsPromises.mkdir(path.join(__dirname, "logs/"));
            if (!fs.existsSync(path.join(__dirname, currFolder))) {
                await fsPromises.mkdir(path.join(__dirname, currFolder));
            }
        } else {
            if (!fs.existsSync(path.join(__dirname, currFolder))) {
                await fsPromises.mkdir(path.join(__dirname, currFolder));
            }
        }
        if (DEBUG) console.log(logItem);
        const fileName = `${format(new Date(), "yyyyMMdd")}` + "_http_events.log";
        await fsPromises.appendFile(
        path.join(__dirname, currFolder, fileName),
        logItem + "\n"
        );
    } catch (err) {
        console.log(err);
    }
    });

module.exports = myEmitter;
