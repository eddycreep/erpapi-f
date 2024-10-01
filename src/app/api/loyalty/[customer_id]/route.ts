import { NextResponse } from 'next/server'
import mysql2 from 'mysql2/promise'

async function createConnection() {
    const connection = await mysql2.createConnection({
        host: "localhost", // Replace with your DB host
        user: "root", // Replace with your DB username
        password: "yanga@1501", // Replace with your DB password
        database: "erpapi" // Replace with your database name
    })
    return connection;
}

export async function GET() {
    
}