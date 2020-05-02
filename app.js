const express = require('express');
const app = express();

const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv/config');

//BODY PARSER
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const challengeRoute = require('./Routes/challenge');
//Middleware
app.use(cors());
app.use('/challenge', challengeRoute);

const port = 3000;

app.listen(port, () => {
    console.log(`Server is running at localhost:${port}`);
});

module.exports = app;