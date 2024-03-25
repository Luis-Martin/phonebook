import Person from '../models/person'

const initialPeople = [
  {
    name: 'Marco',
    number: '00-01-0001'
  },
  {
    name: 'Martin',
    number: '11-11-1111'
  }
]

const nonExistingId = async () => {
  const person = new Person({ name: 'Jose', number: '33-33-3333' })
  await person.save()
  await person.deleteOne()

  return person._id.toString()
}

const peopleInDb = async () => {
  const people = await Person.find({})
  return people.map(person => person.toJSON())
}

export default { initialPeople, nonExistingId, peopleInDb }
