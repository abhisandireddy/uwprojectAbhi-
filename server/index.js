var express = require('express');
var app = express();
const path = require('path')
const sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const dbPath = path.resolve(__dirname, '../tables.db')


let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the tables database.');
});


app.get("/", function (req, res) {
    res.send('hello world');
})

app.get("/authenticate", function (req, res) {
    let sql = `SELECT * FROM UserAuth`
    db.all(sql, [], (err, rows) => {
        rowArray = [];
        rows.forEach((row) => {
            rowArray.push(row)
        });
        res.send(JSON.stringify(rowArray));
    });
});

app.post("/userInfo", function (req, res) {
    console.log("hello");
    let sql = "SELECT Username, URL FROM UserURLS WHERE (Username = \"" + req.body.username + "\" AND Display = \"1\")";
    console.log(sql);
    db.all(sql, [], (err, rows) => {
        rowArray = [];
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            rowArray.push(row)
        })
        res.send(JSON.stringify(rowArray));
    });
    
    
})



app.listen(3001, function (req, res) {
    console.log("app is listening on port 3001")
});


