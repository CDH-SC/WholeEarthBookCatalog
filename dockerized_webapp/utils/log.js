/**
 * log.js
 * -----------------------------------------------------------------------------
 * a utility for use in keeping track of runtime events
 */
class LogTool {
    /**
     * create a new LogTool
     */
    constructor(level = 2) {
        this.level = level;
        this.printer = function (logType, logItem) {
            var dateTime = new Date();
            var logItemHeader = "[" + logType + " (" + dateTime.toLocaleTimeString() + ")";
            switch (typeof logItem) {
                case "string":
                    if (logItem.includes('\n')) {
                        console.log(logItemHeader + "] \n" + logItem);
                    } else {
                        console.log(logItemHeader + "] > " + logItem);
                    }
                    break;
                case "object":
                    console.log(logItemHeader + "] \n" + JSON.stringify(logItem, null, 2));
                    break;
                default:
                    console.log(logItemHeader + "] \n" + logItem);
                    break;
            }
        };
    }

    /**
     * information pertaining to passed parameters
     * @param {any} message the message to log
     */
    debug(message) {
        if (this.level >= 4) {
            this.printer("debug", message);
        }
    }

    /**
     * information pertaining to runtime events
     * @param {any} message the message to log
     */
    info(message) {
        if (this.level >= 3) {
            this.printer("info ", message);
        }
    }

    /**
     * information pertaining to failures and exceptions
     * @param {any} message the message to log
     */
    error(message) {
        if (this.level >= 2) {
            this.printer("error", message);
        }
    }

    /**
     * major events causing the failure of the entire system
     * @param {any} message the message to log
     */
    fatal(message) {
        if (this.level >= 1) {
            this.printer("fatal", message);
        }
    }
}

var log = new LogTool();

module.exports = log;