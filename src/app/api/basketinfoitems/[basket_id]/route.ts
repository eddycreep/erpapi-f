import { NextResponse } from 'next/server'
import mysql2 from 'mysql2/promise'
import { useState, useEffect } from 'react'

async function connectToDatabase() {
    const connection = await mysql2.createConnection({
        host: "localhost", // Replace with your DB host
        user: "root", // Replace with your DB username
        password: "yanga@1501", // Replace with your DB password
        database: "erpapi" // Replace with your database name
    })
    return connection;
}

export async function GET(request: Request,  context: any) {
    const { params } = context;

    try {
        const connection = await connectToDatabase()

        const query = `SELECT product, quantity, product_price, basket_id FROM erpapi.tblbasketinfo_items WHERE basket_id = ?`

        const [rows] = await connection.execute(query, [params.basket_id])

        await connection.end()

        // Check if rows is an array
        if (Array.isArray(rows)) {
            const basketInfoItemsData = rows.map((row: any) => ({
                product: row.product,
                quantity: row.quantity,
                product_price: row.product_price,
                basket_id: row.basket_id
            }));

            console.log("Purchased products retrieved successfully using the basket ID", basketInfoItemsData);
            return NextResponse.json({ BasketInfoItems: basketInfoItemsData });
        } else {
            console.log("Unexpected response format, no data returned.");
            return NextResponse.json({ message: "No data found." });
        }

    } catch (error) {
        console.log("Error fetching the purchased items linked to the basket ID", error)
    }
}