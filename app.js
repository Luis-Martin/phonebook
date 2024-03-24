import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import cors from 'cors'
import personsRouter from './controllers/persons.js'
import middleware from './utils/middleware.js'

const app = express()

mongoose.set('strictQuery', false)
mongoose
  .connect(process.env.MONGODB_URI)
  .then(res => console.log('Connected to MongoDB'))
  .catch(err => console.log('error connecting to MongoDB:', err.message))

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

app.use(morgan(middleware.morganfc))
app.use('/api/persons', personsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app
