'use client'

import * as React from "react"
import axios from 'axios';
import { apiEndPoint } from '@/utils/colors';
import { toast } from 'react-hot-toast';
import { useState, useEffect } from "react";
import { format } from "date-fns";

// Retrieve basket info
interface BasketProps {
    basket_id: number,
    customer_id: number,
    product: string,
    quantity: number,
    purchase_date: string,
    total_amount: number,
    payment_method: string
}
type BasketResponse = BasketProps[]

// Specials info
interface SpecialProps {
    uid: number,
    product_id: number,
    special: string,
    specialAmount: number,
    specialValue: string, // percentage or value
    specialType: string,  // e.g., 'discount'
    startDate: string,
    expiryDate: string
}
type SpecialsResponse = SpecialProps[]

interface SaveClientProps {
  basket_id: number,
  customer_id: number,
  product: string,
  quantity: number,
  product_price: number,
  discount_applied: number,
  final_price: number,
  insertion_time: string
}
type SaveClientResponse = SaveClientProps[]

// Main component
export default function Home() {
  const [ basketData, setBasketData ] = useState<BasketResponse>([])
  const [ specialData, setSpecialData ] = useState<SpecialsResponse>([])

  // Fetch basket data on mount
  useEffect(() => {
    const getBasketInfo = async () => {
        try {
          const id = 2
          const url = `basket/getcustomerbasket/${id}`
          const response = await axios.get(`${apiEndPoint}/${url}`)
          setBasketData(response.data)
          console.log("Successfully retrieved basket data: ", response.data)
        } catch (error) {
          console.error("Error fetching basket data:", error)
          toast.error("Failed to fetch basket data")
        }
    }

    getBasketInfo()
  }, []);

  // Function to check for product specials
  const checkProductSpecials = async (product: string, total_amount: number) => {
    try {
      const response = await axios.get(`${apiEndPoint}/basket/getcustomerspecial/${product}`);
      const specials: SpecialsResponse = response.data;
      setSpecialData(specials);
      
      if (specials.length > 0) {
        const special = specials[0]; // Assume first special is applicable for simplicity/
        
        // Apply percentage or value-based discount
        let newTotal = total_amount;
        if (special.specialValue === 'Percentage') {
          newTotal = total_amount - (total_amount * special.specialAmount / 100);
        } else if (special.specialValue === 'Amount') {
          newTotal = total_amount - special.specialAmount;
        }

        console.log(`Discounted total for ${product}: ${newTotal}`);
        return newTotal;
      } else {
        console.log("No applicable specials found.");
        return total_amount;
      }
    } catch (error) {
      console.error("Error fetching product specials:", error);
      return total_amount;
    }
  };

  // Function to store discounted basket information
  const storeDiscountedBasket = (basket: BasketProps, newTotal: number) => {
    const storageData = {
      basket_id: basket.basket_id,
      customer_id: basket.customer_id,
      product: basket.product,
      quantity: basket.quantity,
      purchase_date: basket.purchase_date,
      total_amount: newTotal,
      payment_method: basket.payment_method
    };

    // Simulating storing in local state (could be localStorage, database, etc.)
    console.log("Stored basket data:", storageData);
  };

  // Function to save the client's transaction
const saveClientTransaction = async (basket: BasketProps, newTotal: number, specialAmount: number) => {
  try {
    const ticketDate = format(
      new Date(),
      "EEE MMM dd yyyy HH:mm:ss 'GMT'XXX"
    );

    // Construct the payload from the updated basket data and specials
    const payload = {
      basket_id: basket.basket_id, // Basket ID from basket data
      customer_id: basket.customer_id, // Customer ID from basket data
      product: basket.product, // Product from basket data
      quantity: basket.quantity, // Quantity from basket data
      product_price: basket.total_amount, // Total amount (from storeDiscountedBasket) mapped to product_price
      discount_applied: specialAmount, // Special amount applied (from checkProductSpecials)
      final_price: newTotal, // New total after applying discount (from checkProductSpecials)
      insertion_time: ticketDate // Insertion time for the transaction
    };
    

    // Send the payload to the backend
    const response = await axios.post<SaveClientResponse>(`${apiEndPoint}/basket/saveclientransaction`, payload);

    // Handle the response using the SaveClientResponse type
    const data: SaveClientResponse = response.data;
    console.log("Transaction saved successfully:", data);

    toast.success("Transaction saved successfully!");
  } catch (error) {
    console.error("Error saving transaction:", error);
    toast.error("Failed to save the transaction");
  }
};

  // Simulate checking specials, updating basket, and saving transaction
  useEffect(() => {
    if (basketData.length > 0) {
      const firstProduct = basketData[0];
  
      // Check if the special data has been processed to avoid repeating the process
      checkProductSpecials(firstProduct.product, firstProduct.total_amount)
        .then((newTotal) => {
          const special = specialData.length > 0 ? specialData[0] : null;
          const specialAmount = special ? special.specialAmount : 0;
  
          // Store the updated basket info after applying special
          storeDiscountedBasket(firstProduct, newTotal);
          
          // Save the transaction after storing the updated basket
          saveClientTransaction(firstProduct, newTotal, specialAmount);
        });
    }
    // Only depend on basketData, avoid triggering on specialData updates
  }, [basketData]);
  
  

  return (
    <section className="w-full h-full flex flex-col justify-center items-center gap-2 p-2 rounded bg-grey text-black">
      <div>
        {basketData?.map(({ basket_id, customer_id, product, quantity, purchase_date, total_amount, payment_method }) => ( 
          <div key={basket_id} className="">
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
              <p className="text-red">{product}</p>
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

