const express = require('express');
const app = express();
 
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