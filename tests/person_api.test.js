/* eslint-env jest */
import helper from './test_helper.js'
import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app.js'
import Person from '../models/person.js'

const api = supertest(app)
mongoose.set('bufferTimeoutMS', 30000)

beforeEach(async () => {
  await Person.deleteMany({})

  for (const person of helper.initialPeople) {
    const personObject = new Person(person)
    await personObject.save()
  }
}, 100000)

describe('when there is initially some people saved', () => {
  test('people are returned as json', async () => {
    await api
      .get('/api/persons')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 100000)

  test('all people are returned', async () => {
    const response = await api.get('/api/persons')

    expect(response.body).toHaveLength(helper.initialPeople.length)
  })

  test('a specific person is within the returned perople', async () => {
    const response = await api.get('/api/persons')

    const contents = response.body.map(p => p.name)

    expect(contents).toContain('Martin')
  })
})

describe('viewing a specific person', () => {
  test('succeeds with a valid id', async () => {
    const peopleAtStart = await helper.peopleInDb()

    const personToView = peopleAtStart[0]

    const resultPerson = await api
      .get(`/api/persons/${personToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(resultPerson.body).toEqual(personToView)
  })

  test('fails with statuscode 404 if note does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    await api
      .get(`/api/persons/${validNonexistingId}`)
      .expect(404)
  })

  test('fails with statuscode 400 if id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .get(`/api/persons/${invalidId}`)
      .expect(400)
  })
})

describe('addition of a new person', () => {
  test('succeeds with valid data', async () => {
    const newPerson = {
      name: 'Raul',
      number: '55-55-5555'
    }

    await api
      .post('/api/persons')
      .send(newPerson)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const peopleAtEnd = await helper.peopleInDb()
    expect(peopleAtEnd).toHaveLength(helper.initialPeople.length + 1)

    const contents = peopleAtEnd.map(n => n.name)
    expect(contents).toContain('Raul')
  })

  test('fails with status code 400 if data invalid', async () => {
    const newPerson = {
      name: '1'
    }

    await api
      .post('/api/persons')
      .send(newPerson)
      .expect(400)

    const peopleAtEnd = await helper.peopleInDb()

    expect(peopleAtEnd).toHaveLength(helper.initialPeople.length)
  })
})

describe('deletion of a person', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const peopleAtStart = await helper.peopleInDb()
    const personToDelete = peopleAtStart[0]

    await api
      .delete(`/api/persons/${personToDelete.id}`)
      .expect(204)

    const peopleAtEnd = await helper.peopleInDb()

    expect(peopleAtEnd).toHaveLength(
      helper.initialPeople.length - 1
    )

    const contents = peopleAtEnd.map(r => r.name)

    expect(contents).not.toContain(personToDelete.name)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
