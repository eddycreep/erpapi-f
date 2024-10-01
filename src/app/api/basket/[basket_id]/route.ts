import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'
import { useState, useEffect } from 'react'

async function connectToDatabase() {
    const connection = await mysql.createConnection({
        host: "localhost", // Replace with your DB host
        user: "root", // Replace with your DB username
        password: "yanga@1501", // Replace with your DB password
        database: "erpapi" // Replace with your database name
    })
    return connection;
}

export async function GET(request: Request, context: any) {
    const { params } = context;

    try{
        //connect to the database by calling the function
        const connect = await connectToDatabase();

        //define the query
        const query = `SELECT basket_id, customer_id, total_amount, purchase_date FROM tblbasketinfo WHERE basket_id = ?`;

        const [rows] = await connect.execute(query, [params.basket_id])

        await connect.end();

        return NextResponse.json({ BasketData: rows})

    } catch (error) {
        console.error("Error fetching basket data from the database")
        return NextResponse.json({ error: "failed to fetch basket data"})
    }
}

