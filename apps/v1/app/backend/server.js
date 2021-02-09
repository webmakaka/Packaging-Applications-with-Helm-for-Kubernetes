const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const mongodb = require('mongodb');

const MONGODB_URI = process.env['MONGODB_URI'];

const mongoClient = mongodb.MongoClient;
const client = require('prom-client');

// Create a Registry which registers the metrics
const register = new client.Registry();
// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'prometheus-nodejs-app',
});
// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

var collection;
var db = mongoClient.connect(
  MONGODB_URI,
  {
    autoReconnect: true,
    reconnectInterval: 10000,
    reconnectTries: Number.MAX_VALUE,
    useNewUrlParser: true,
  },
  function (err, db) {
    if (err) throw err;
    console.log('connected to the mongoDB !');
    collection = db.db('guestbook').collection('greeetings');
  }
);

app.use(bodyParser.json());

app.use(function (req, res, next) {
  console.log('use cors');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );
  next();
});

app.get('/metrics', async (req, res) => {
  // Return all metrics the Prometheus exposition format
  res.setHeader('Content-Type', register.contentType);
  result = await register.metrics();
  return res.send(result);
});

app.get('/guestbook', function (req, res) {
  console.log('Guestbook API GET');
  collection
    .find()
    .sort({ _id: -1 })
    .toArray((err, guestbook) => {
      return res.send(guestbook);
    });
});

app.post('/guestbook', function (req, res) {
  if (!req.body) {
    res.statusCode = 400;
    return res.send('Error 400: Post syntax incorrect.');
  }
  var newGreeting = req.body;
  collection.insert(newGreeting, (err, greeting) => {
    if (err) console.log(err);
    res.send(greeting);
  });
});

app.listen(3000, function () {
  // console.log("MONGODB_URI:"+MONGODB_URI)
  console.log('Guestbook API listening on port 3000!');
});
