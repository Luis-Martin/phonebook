import express from 'express'
import Person from '../models/person.js'

const personsRouter = express.Router()

personsRouter.get('/', (req, res, next) => {
  Person
    .find({})
    .then(notes => res.json(notes))
    .catch(err => next(err))
})

personsRouter.get('/:id', (req, res, next) => {
  Person
    .findById(req.params.id)
    .then(person => person ? res.json(person) : res.status(404).end('Person not found'))
    .catch(err => next(err))
})

personsRouter.delete('/:id', (req, res, next) => {
  Person
    .findByIdAndDelete(req.params.id)
    .then(person => res.status(204).end())
    .catch(err => next(err))
})

personsRouter.post('/', (req, res, next) => {
  const newPerson = new Person({
    name: req.body.name,
    number: req.body.number
  })

  newPerson
    .save()
    .then(personSaved => res.status(201).json(personSaved))
    .catch(err => next(err))
})

export default personsRouter
