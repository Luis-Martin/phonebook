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

app.get('/api/persons', (req, res) => {
  Person.find({}).then(notes => res.json(notes))
})

app.get('/api/persons/:id', (req, res) => {
  Person
    .findById(req.params.id)
    .then(person => res.json(person))
    .catch(err => res.status(404).end(err.message))
})

app.delete('/api/persons/:id', (req, res) => {
  Person
    .findByIdAndDelete(req.params.id)
    .then(person => res.json(person))
    .catch(err => res.status(400).end(err.message))
})

app.post('/api/persons', (req, res) => {
  const maxId = Math.max(...persons.map(p => p.id))
  
  if (!req.body.name || !req.body.number) return res.status(400).end('Bad request')
  if (persons.find(p => p.name === req.body.name)) return res.status(409).end('Name must be unique')

  const newPerson = {...req.body, id: maxId + 1}
  persons = [...persons, newPerson]
  res.json(newPerson)
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`App listen in port ${PORT}`)
})
