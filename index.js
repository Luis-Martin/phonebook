import 'dotenv/config'
import express from 'express'
import morgan from  'morgan'
import cors from 'cors'
import { Person } from './person.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

const morganfc = (tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body),
  ].join(' ')
}

app.use(morgan(morganfc))

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/info', (req, res) => {
  const info = `
    <p>Phonebook has info for ${persons.length} people</p>
    <br />
    ${Date(Date.now()).toString()}
  `
  res.send(info)
})

app.get('/api/persons', (req, res, next) => {
  Person
    .find({})
    .then(notes => res.json(notes))
    .catch(err => next(err))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person
    .findById(req.params.id)
    .then(person => person ? res.json(person) : res.status(404).end('Person not found'))
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person
    .findByIdAndDelete(req.params.id)
    .then(person => res.status(204).end())
    .catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
  if (!req.body.name || !req.body.number) return res.status(400).end('Name or number missing!!!')
  
  const newPerson = new Person({
    name: req.body.name,
    number: req.body.number,
  })
  newPerson
    .save()
    .then(personSaved => res.json(personSaved))
    .catch(err => next(err))
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
  console.log(err.name)
  console.log(err.message)

  if (err.name === 'CastError') return res.status(400).send({error: 'malformatted id'})
  

  next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`App listen in port ${PORT}`)
})
