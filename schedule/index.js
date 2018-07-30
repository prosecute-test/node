const schedule = require('node-schedule');

const rule = new schedule.RecurrenceRule();
rule.minute = 42;

const scheduleModule = {};

scheduleModule.start = () => {
    // doSomeThing()
    // const j = schedule.scheduleJob(rule, function () {
        // doSomeThing()
    // });
    // j.cancel();
}

module.exports = scheduleModule;