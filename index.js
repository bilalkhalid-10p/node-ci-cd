const express = require('express');
const app = express();

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'https://bilalkhalid-10p.github.io');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
 
app.get('/', (req, res) => {
  res
    .status(200)
    .send('Hello Bilal server is running on 8080')
    .end();
});

app.get('/data', function(req, res) {
  res.json([{
    number: 1,
    name: 'John',
    gender: 'male'
  },
    {
      number: 2,
      name: 'Ashley',
      gender: 'female'
    }
  ]);
});
 
// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

const { Client } = require('pg');

var connectionString = "postgres://ftopzbzlusikbd:7f967c819a8cf5bec97b50d5d3b489ab78441780f1e38f87ccd775f33d31bc5c@ec2-34-227-135-211.compute-1.amazonaws.com:5432/daibac7pl3rgn7"

const client = new Client({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});

client.query(`SELECT * FROM Users;`, (err, res) => {
  if (err) {
    console.log("Error - Failed to select all from Users");
    console.log(err);
  }
  else {
    for (let row of res.rows) {
      console.log(JSON.stringify(row));
    }
    client.end();
  }
});