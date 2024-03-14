const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.json()); // TODO ???

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf8')
);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
}

const getTour = (req, res) => { // get by id
  const id = req.params.id*1;
  const tour = tours.find(el => el.id === id);
  if(!tour){
    return res.status(404).json({
      status: 'fail',
      message: `Not found the tour with ID: ${id}`
    })
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
}

const createTour = (req, res) => {  // create tour
  const { name, duration, difficulty} = req.body;
  if(name == '' || duration == '' || difficulty == ''){
    return res.status(404).json({
      status: 'error',
      message: "Name, Duration, Difficulty are required"
    })
  }

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    })
  })
}

const updateTour = (req, res) => { // Update by ID
  const id = req.params.id*1
  const updateTour = tours.find(el => el.id === id)
  if(!updateTour){
    return res.status(404).json({
      status: 'fail',
      message: `Not found the tour with ID: ${id}`
    })
  }

  Object.assign(updateTour, req.body)
 
  tours.map(r => (updateTour.id == r.id) || r)

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    res.status(200).json({
      status: 'success',
      data: {
        tour: updateTour
      }
    })
  })
}

const deleteTour = (req, res) => { // Delete by ID
  const id = req.params.id*1
  const delTour = tours.find(el => el.id === id)
  if(!delTour){
    return res.status(404).json({
      status: 'fail',
      message: `Not found the tour with ID: ${id}`
    })
  }

  const remainTour = tours.filter((obj, index, arr) => obj.id !== id)

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(remainTour), err => {
    res.status(204).json({
      status: 'success',
      data: ''
    })
  })
}

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTours).post(createTour)
app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour)


app.post('/', (req, res) => {
  res.send('You can POST to this endpoint...');
});

const port = '3000';
app.listen(port, () => {
  console.log('listening on port ' + port + '...');
});
