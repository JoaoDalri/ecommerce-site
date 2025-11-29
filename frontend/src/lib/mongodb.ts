import { MongoClient } from 'mongodb'


declare global {
var mongoClient: MongoClient | undefined
}


const uri = process.env.MONGO_URI || ''
if (!uri) {
console.warn('MONGO_URI not set — API will use in-memory seed data')
}


export async function getMongoClient() {
if (!uri) return null
if (global.mongoClient) return global.mongoClient
const client = new MongoClient(uri)
await client.connect()
global.mongoClient = client
return client
}


export async function getProductsCollection() {
const client = await getMongoClient()
if (!client) return null
const db = client.db()
return db.collection('products')
}