const mongoose = require(`mongoose`);
const connectString = `mongodb://localhost:27017/ecommerce`;

mongoose.connect(connectString, {
        maxPoolSize: 50
    })
    .then(_ => {
        console.log(`connected Mongodb Success`)

    })
    .catch(error => {
        console.log(`Error Connect`)
    })

// dev
if (1 === 1) {
    mongoose.set(`debug`, true)
    mongoose.set(`debug`, {
        color: true
    })
}

module.exports = mongoose;