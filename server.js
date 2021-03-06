const express = require('express');
const app = express();
const path = require('path');
const db = require('./db');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();

app.use(express.json());

app.use('/dist', express.static('dist'));

app.use(express.static(path.join(__dirname + '/assets')));

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/api/schools', (req, res, next) => {
  db.readSchools()
    .then(schools => {
      res.send(schools);
      console.log(schools);
    })
    .catch(next);
});

app.get('/api/students', (req, res, next) => {
  db.readStudents()
    .then(students => res.send(students))
    .catch(next);
});

app.post('/api/schools', jsonParser, (req, res, next) => {
  db.createSchools(req.body.name)
    .then(response => res.send(response))
    .catch(next);
});

app.post('/api/students', jsonParser, (req, res, next) => {
  db.createStudents(req.body)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(next);
});

app.put('/api/students/:id', (req, res, next) => {
  db.changeStudent(req.body)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(err => console.error(err));
});

app.put('/api/schools/:id', (req, res, next) => {
  db.changeSchool(req.body)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(err => console.error(err));
});

app.delete('/api/students/:id', (req, res, next) => {
  db.destroyStudent(req.params.id)
    .then(response => {
      res.status(204).send(response);
    })
    .catch(err => console.error(err));
});

app.delete('/api/schools/:id', (req, res, next) => {
  db.destroySchool(req.params.id)
    .then(response => {
      res.status(204).send(response);
    })
    .catch(err => console.error(err));
});

db.sync().then(() => {
  app.listen(port, () => {
    console.log(`listening on port ${port}...`);
  });
});
