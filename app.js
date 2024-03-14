const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.json()); // TODO ???

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf8')
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  console.log(newTour);

  res.send('done');
});

app.post('/', (req, res) => {
  res.send('You can POST to this endpoint...');
});

const port = '3000';
app.listen(port, () => {
  console.log('listening on port ' + port + '...');
});
