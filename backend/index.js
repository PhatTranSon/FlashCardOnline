//Create an express application
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

//Create app
const app = express();

//Initialize database
const database = require('./Models');
database.sequelize.sync()
    .then(() => console.log("Database is initialized"));

//Set up body parser to handle form submission
app.use(bodyParser.urlencoded({
    extended: true
}));

//Set up cors for Cross origin data
app.use(cors());

//Routing
require('./Routes/auth.route')(app);
require('./Routes/collections.route')(app);
require('./Routes/card.route')(app);

app.listen(8000, () => { console.log("App is running") });