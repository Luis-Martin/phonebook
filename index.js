import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import personsRouter from './controllers/persons.js'

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
    JSON.stringify(req.body)
  ].join(' ')
}

app.use(morgan(morganfc))
app.use('/api/persons', personsRouter)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
  console.log(err.name)
  console.log(err.message)

  if (err.name === 'CastError') return res.status(400).send({ error: 'malformatted id' })
  if (err.name === 'ValidationError') return res.status(400).json({ error: err.message })

  next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`App listen in port ${PORT}`)
})
