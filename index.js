const express = require('express');
const app = express();

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'https://desolate-mountain-37815.herokuapp.com');

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