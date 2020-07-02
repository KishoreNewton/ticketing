import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
// import request from 'supertest'
// import { app } from '../app'

declare global {
    namespace NodeJS {
        interface Global {
            signin(id?: string): string[]
        }
    }
}

jest.mock('../nats-wrapper')

process.env.STRIPE_KEY = 'sk_test_Q6jB26xzlMih5YBWtA329tZt00IMdj7aNF'

let mongo: any
beforeAll(async() => {
    jest.clearAllMocks()
    process.env.JWT_KEY = 'asdf'
    const mongo = new MongoMemoryServer()
    const mongoUri = await mongo.getUri()

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
})

beforeEach(async() => {
    const collections = await mongoose.connection.db.collections()

    for(let collection of collections){
        await collection.deleteMany({})
    }
})

afterAll(async() => {
    await mongoose.connection.close()
})

global.signin = (id?: string) => {
    const payload = {
        id: id || new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    }

    const token = jwt.sign(payload, process.env.JWT_KEY!)

    const session = { jwt: token }

    const sessionJSON = JSON.stringify(session)

    const base64 = Buffer.from(sessionJSON).toString('base64')

    return [`express:sess=${base64}`]
}