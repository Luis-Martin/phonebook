import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import personsRouter from './controllers/persons.js'
import middleware from './utils/middleware.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

app.use(morgan(middleware.morganfc))
app.use('/api/persons', personsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`App listen in port ${PORT}`)
})
