import config from './utils/config.js'
import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import cors from 'cors'
import personsRouter from './controllers/persons.js'
import middleware from './utils/middleware.js'

const app = express()

mongoose.set('strictQuery', false)
mongoose
  .connect(config.MONGODB_URI)
  .then(res => console.log('Connected to MongoDB'))
  .catch(err => console.log('error connecting to MongoDB:', err.message))

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

if (process.env.NODE_ENV !== 'test') app.use(morgan(middleware.morganfc))
app.use('/api/persons', personsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app
