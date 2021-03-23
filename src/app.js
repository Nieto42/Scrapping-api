const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

require('dotenv').config();

const middlewares = require('./middlewares');
const fetchCovidData = require('./scrapper');

const app = express();
let cacheTime;
let data;


app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/covid', async (req, res) => {
  if(cacheTime && cacheTime > Date.now()-(1000*10)){
    return res.json(data);
  }
  data = await fetchCovidData();
  cacheTime = Date.now();
  res.json(data);
});

app.get('/covid/:country', async(req, res) => {
  if (!data) {
    data = await fetchCovidData();
  }
  //console.log(data.filter(d => d.country === req.params.country));
  res.json(data.filter(d => d.country === req.params.country));
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;