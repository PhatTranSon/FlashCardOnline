//Create an express application
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

//Create app
const app = express();

//Set up body parser to handle form submission
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//Set up cors for Cross origin data
app.use(cors());

//Initialize database
const database = require('./Models');
database.sequelize.sync()
    .then(() => console.log("Database is initialized"));

//Routing
require('./Routes/auth.route')(app);
require('./Routes/collections.route')(app);
require('./Routes/card.route')(app);
require('./Routes/test.route')(app);

app.listen(8000, () => { console.log("App is running") });