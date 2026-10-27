const app = require("./src/app");

const PORT = process.env.PORT || 2006

const server = app.listen(PORT, () => {
    console.log(`Wellcome you to eCommerce start width ${PORT}`)
})

process.on(`SIGINT`, () => {
    server.close(() => {
        console.log(`Exit Server express`);
    })
})