const app = require("./src/app");

const PORT = 2006;

const server = app.listen(PORT, () => {
    console.log(`Wellcome you to eCommerce start width ${PORT}`)
})

process.on(`SIGHT`, () => {
    server.close(() => {
        console.log(`Exit Server express`);
    })
})