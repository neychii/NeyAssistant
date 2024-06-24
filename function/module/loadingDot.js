var interval;
module.exports = {
    loadingStart: function (text) {
        const dot = ["   ", ".  ", ".. ", "..."];

        i = 0;
        interval = setInterval(function () {
            process.stdout.write("\r" + text + dot[i]);
            i++;
            i == dot.length ? (i = 0) : null;
        }, 400);
    },
    loadingStop: function (text, timer) {
        if (!timer) {
            clearInterval(interval);
            return process.stdout.write("\r" + text + "\n");
        }
        setTimeout(function () {
            clearInterval(interval);
            return process.stdout.write("\r" + text + "\n");
        }, timer);
    }
};
