//Create an express application
const express = require('express');
const app = express();

//Test routing
app.get('/', (request, response) => {
    response.json({
        message: "Hello World"
    });
    response.end();
});

app.listen(8000, () => { console.log("App is running") });