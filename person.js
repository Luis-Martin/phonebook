import mongoose from 'mongoose'

mongoose.set('strictQuery', false)

mongoose
  .connect(process.env.MONGODB_URI)
  .then(res => console.log('Connected to MongoDB'))
  .catch(err => console.log('error connecting to MongoDB:', err.message))

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id    
    delete returnedObject.__v    
  }
})

const Person = mongoose.model("Person", personSchema)

export { Person }