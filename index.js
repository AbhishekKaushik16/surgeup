const express = require('express');
const { Client } = require('pg');
const connectionString = 'postgres://postgres:postgres@localhost:5432/surgeup';
const client = new Client({
    connectionString: connectionString
});
client.connect();
var app = express();
app.set('port', process.env.PORT || 4000);
app.get('/', function (req, res, next) {
    client.query('SELECT * FROM covid', (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
    });
});
app.get('/search/state/:keyword', (req, res, next) => {
    const keyword = req.params.keyword;
    client.query('SELECT state FROM covid WHERE state ILIKE $1', ['%' + keyword + '%'], (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
    });
});
app.get('/get/:state', (req, res, next) => {
    const state = req.params.state;
    console.log(state);
    client.query('SELECT * FROM covid WHERE state = $1', [state], (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows[0]);
    });
})
app.listen(4000, function () {
    console.log('Server is running.. on Port 4000');
});
