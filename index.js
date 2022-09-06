const express = require('express');
const app = express();
var cors = require('cors')
const { Client } = require('pg');
const bodyParser = require("body-parser");

app.use(cors());

app.use(function (req, res, next) {

  // Website you wish to allow to connect;
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

var connectionString = "postgres://ftopzbzlusikbd:7f967c819a8cf5bec97b50d5d3b489ab78441780f1e38f87ccd775f33d31bc5c@ec2-34-227-135-211.compute-1.amazonaws.com:5432/daibac7pl3rgn7"

const client = new Client({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();
 
app.get('/', (req, res) => {
  res
    .status(200)
    .send('Hello Bilal server is running on 8080')
    .end();
});

app.get('/data', function(req, res) {
  client.query(`SELECT * FROM Users;`, (err, result) => {
    if (err) {
      console.log("Error - Failed to select all from Users");
      console.log(err);
    }
    else {
      res.status(200).json(result.rows)
    }
  });
});

app.get('/list', function(req, res) {
  client.query(`SELECT Table1.first_name AS employee_first_name,
                    Table1.last_name AS employee_last_name,
                    Table1.id AS employee_id,
                    Table2.first_name AS manager_first_name,
                    Table2.last_name AS manager_last_name
                FROM Users as Table1
                LEFT JOIN Users as Table2 ON Table2.id = Table1.manager_id
                WHERE Table1.deleted_at IS NULL`, (err, result) => {
    if (err) {
      console.log("Error - Failed to select all from Users");
      console.log(err);
    }
    else {
      res.status(200).json(result.rows)
    }
  });
});

app.get('/managers', function(req, res) {
  client.query(`SELECT first_name, last_name, id
                FROM Users
                WHERE deleted_at IS NULL`, (err, result) => {
    if (err) {
      console.log("Error - Failed to select all from Users");
      console.log(err);
    }
    else {
      res.status(200).json(result.rows)
    }
  });
});

app.post('/create', function(req, res) {
    let first_name = req.body.data.first_name;
    let last_name = req.body.data.last_name;
    let manager_id = req.body.data.manager_id == '' ? 0 : req.body.data.manager_id;
    let deleted_at = null;

    client.query(`INSERT INTO users (first_name, last_name, manager_id, deleted_at) VALUES ($1, $2, $3, $4)  RETURNING *`,
        [first_name, last_name, manager_id, deleted_at], (err, result) => {
        if (err) {
            console.log("Error - Failed to insert data into Users");
            console.log(err);
        }
        else {
            res.status(200).json(result.rows)
        }
    });
});

app.post('/update', function(req, res) {
    let user_id = req.body.data.user_id;
    let first_name = req.body.data.first_name;
    let last_name = req.body.data.last_name;
    let manager_id = req.body.data.manager_id == '' ? 0 : req.body.data.manager_id;
    let deleted_at = null;

    client.query(`UPDATE users SET first_name = $1, last_name = $2, manager_id = $3, deleted_at = $4 WHERE id = $5`,
        [first_name, last_name, manager_id, deleted_at, user_id], (err, result) => {
            if (err) {
                console.log("Error - Failed to update data of User");
                console.log(err);
            }
            else {
                res.status(200).json(result.rows)
            }
        });
});

app.delete('/delete_user/:userId', function(req, res) {
    const id = req.params.userId;

    client.query(`UPDATE users SET manager_id = 0 WHERE manager_id = $1`,
    [id], (err, result) => {
        if (err) {
            console.log("Error - Failed to update manager id");
            console.log(err);
        }
    });

    client.query(`UPDATE users SET deleted_at = current_timestamp WHERE id = $1`,
        [id], (err, result) => {
            if (err) {
                console.log("Error - Failed to update manager id");
                console.log(err);
            }
        });

    res.status(200).send(id);
});

app.post('/get_user', function(req, res) {
    let userId = req.body.data.userId;

    client.query(`SELECT *
                  FROM Users
                  WHERE id = $1`, [userId], (err, result) => {
            if (err) {
                console.log("Error - Failed to find user data");
                console.log(err);
            }
            else {
                res.status(200).json(result.rows)
            }
        });
});


// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});