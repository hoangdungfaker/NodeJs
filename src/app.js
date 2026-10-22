const compression = require("compression");
const express = require("express");
const {
    default: helmet
} = require("helmet");
const morgan = require("morgan");
const app = express()

// init middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression())
// init db


// innit route
app.get(`/`, (req, res, next) => {
    const strCompress = "Hello Compress"
    res.status(500).json({
        message: "Welcome Morgan",
        metadata: strCompress.repeat(100000)
    })
})

// handling error






module.exports = app;