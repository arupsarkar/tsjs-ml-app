const express = require('express');
const path = require('path'); // NEW
const data = require('./fashion-mnist');



const app = express();
const port = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, '../dist'); // NEW
const HTML_FILE = path.join(DIST_DIR, 'index.html'); // NEW
const mockResponse = {
  foo: 'bar',
  bar: 'foo'
};


// Grab a reference to the MNIST input values (pixel data).
const INPUTS = data.TRAINING_DATA.inputs;

// Grab reference to the MNIST output values.
const OUTPUTS = data.TRAINING_DATA.outputs;

app.get('/fashion-mnist-api', (req, res, next) => {
  res.send({inputs: INPUTS, outputs: OUTPUTS})
})

app.use(express.static(DIST_DIR)); // NEW
app.get('/api', (req, res) => {
  res.send(mockResponse);
});
app.get('/', (req, res) => {
 res.sendFile(HTML_FILE); // EDIT
});
app.listen(port, function () {
 console.log('App listening on port: ' + port);
})