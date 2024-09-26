'use client'

import * as React from "react"
import axios from 'axios';
import { apiEndPoint, colors } from '@/utils/colors';
import { toast } from 'react-hot-toast';
import { useQuery } from "@/hooks/useQuery";
import { useState, useEffect } from "react"
import { useAudit } from "@/shared/tools/auditMonit";

interface BasketProps {
    basket_id: number,
    customer_id: number,
    purchased_product: string,
    quantity: number,
    purchase_date: string,
    total_amount: number,
    payment_method: string
}

type BasketResponse = BasketProps[]

export default function Home() {
  const { addAuditLog } = useAudit()
  const [ basketData, setBasketData ] = useState<BasketResponse>([])

  useEffect(() => {
    const getBasketInfo = async () => {
        try {
          //http://localhost:4300/basket/getcustomerbasket/1

          const id = 1
          const url = `basket/getcustomerbasket/${id}`
          const response = await axios.get(`${apiEndPoint}/${url}`)
          setBasketData(response.data)
          console.log("Successfully retrieved basket data: " + response.data)
        } catch (error) {
          console.error("Error fetching basket data:", error)
          toast.error("Failed to fetch basket data")
        }
    }

    const checkProductSpecials = async () => {

    }



    getBasketInfo()
  }, []);



  return (
    <section className="w-full h-full flex flex-col justify-center items-center gap-2 p-2 rounded bg-grey text-black">
      <div>
      {basketData?.map(({ basket_id, customer_id, purchased_product, quantity, purchase_date, total_amount, payment_method }) => ( 
          <div className="">
              <div className="flex gap-4">
                <label>Basket ID:</label>
                <p className="text-red">{basket_id}</p>
              </div>
            <div className="flex gap-4">
                <label>Customer ID:</label>
                <p className="text-red">{customer_id}</p>
            </div>
            <div className="flex gap-4">
                <label>Purchased Product:</label>
                <p className="text-red">{purchased_product}</p>
            </div>
            <div className="flex gap-4">
                <label>Quantity:</label>
                <p className="text-red">{quantity}</p>
            </div>
            <div className="flex gap-4">
              <label>Purchase Date:</label>
              <p className="text-red">{purchase_date}</p>
            </div>
            <div className="flex gap-4">
              <label>Total Amount:</label>
              <p className="text-red">{total_amount}</p>
            </div>
            <div className="flex gap-4">
              <label>Payment Method:</label>
              <p className="text-red">{payment_method}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
