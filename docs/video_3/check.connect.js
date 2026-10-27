const mongoose = require('mongoose');
const os = require('os'); //  lấy thông tin hệ điều hành
// process là đối tượng toàn cục của nodeJs
const countConnect = () => {
    const numConnection = mongoose.connection.readyState;
    console.log(`Number of Connections:: ${numConnection}`);
};

const checkOverLoad = () => {
    console.log('checkOverLoad started');

    const logStatus = () => {
        const readyState = mongoose.connection.readyState;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;

        console.log('readyState:', readyState);
        console.log(`Active connections::${readyState}`);
        console.log(`Memory usage::${(memoryUsage / 1024 / 1024).toFixed(2)} MB`);

        if (readyState > numCores * 5) {
            console.log('Connection overload detected');
        }
    };

    logStatus(); // chạy ngay lần đầu
    setInterval(logStatus, 5000);
};

module.exports = {
    countConnect,
    checkOverLoad
};