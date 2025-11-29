import { NextResponse } from 'next/server'
import { getProductsCollection } from '@/lib/mongodb'
import { seedProducts } from '@/data/seedProducts'


export async function GET(req: Request) {
const col = await getProductsCollection()
if (!col) return NextResponse.json({ products: seedProducts })
const products = await col.find({}).limit(100).toArray()
return NextResponse.json({ products })
}


export async function POST(req: Request) {
const col = await getProductsCollection()
if (!col) return NextResponse.json({ ok: false, message: 'No DB' }, { status: 500 })
const body = await req.json()
const doc = { ...body, createdAt: new Date() }
const r = await col.insertOne(doc)
return NextResponse.json({ ok: true, id: r.insertedId })
}