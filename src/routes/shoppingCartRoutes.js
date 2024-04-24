/**
 * Purpose: Store all the routes for shoppingCart/shoppingCartItems
 * 
 * Author: Paul Kim
 * Last Modified: 4/21/2024
 * TO DO(s):
 * -
 */
const express = require('express');
const { generateId } = require('../utils/generateId');
const { jwtCustomerFilter } = require('../requestFilters/customerFilter');
const { getShoppingCartItemsByUserId, createShoppingCart, createShoppingCartItem, getShoppingCartByUserId, deleteShoppingCartItemById, getCartItemByProductIdAndCartId, updateCartItem } = require('../database/shoppingCart');

const shoppingCartRoutes = express.Router()

shoppingCartRoutes.get("/", jwtCustomerFilter, async (req, res) => {
    const user = req.decoded;

    const userId = user.id;

    try{
        const shoppingCart = new Map();

        const shoppingCartItems = await getShoppingCartItemsByUserId(userId)
        
        shoppingCartItems.forEach(shoppingCartItem => {
            const { ProductId } = shoppingCartItem

            if (!shoppingCart.has(ProductId)) {
                shoppingCart.set(ProductId, shoppingCartItem);
              } else {
                // If product id already exists, update quantity and total
                const storedItem = shoppingCart.get(ProductId);
                storedItem.Quantity  = storedItem.Quantity + shoppingCartItem.Quantity;

                shoppingCart.set(ProductId, storedItem);
              }
        })

        const shoppingCartItemArray = [];

        shoppingCart.forEach(value => {
            shoppingCartItemArray.push(value);
        });
        console.log(shoppingCartItemArray)

        res.status(200).json(shoppingCartItemArray)
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Internal Server Error"})
    }
})

shoppingCartRoutes.put("/", jwtCustomerFilter, async (req, res) => {
    try 
    {
        const user = req.decoded

        const userId = user.id;

        // Get shopping cart that belongs to the customer
        const shoppingCart = await getShoppingCartByUserId(userId);

        // If there is no shopping cart then make one
        let shoppingCartId;

        if (!shoppingCart) 
        {
            shoppingCartId = generateId(35);

            const shoppingCart = {
                CartId: shoppingCartId,
                CustomerId: userId
            }

            await createShoppingCart(shoppingCart)
        } else {
            shoppingCartId = shoppingCart.CartId;
        }

        // Get the shoppingCartItem and add it to the shopping cart
        const shoppingCartItem = req.body;
        
        shoppingCartItem.CartItemId = generateId(35);
        shoppingCartItem.CartId = shoppingCartId

        const retrievedCartItem = await getCartItemByProductIdAndCartId(shoppingCartItem.ProductId, shoppingCartId)

        if(retrievedCartItem)
        {
            const newQuantity = retrievedCartItem.Quantity + parseInt(shoppingCartItem.Quantity)
            console.log(newQuantity)
            await updateCartItem('Quantity', newQuantity, retrievedCartItem.CartItemId)
        }else{
            // Add the shoppingCartItem to the database
            await createShoppingCartItem(shoppingCartItem)
        }

        return res.status(200).json({message: "Added to cart"})
    } catch (err) {

        console.log(err)
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

shoppingCartRoutes.delete("/:shoppingCartItemId", jwtCustomerFilter, async (req, res) => {
    try 
    {
        const user = req.decoded
        const shoppingCartItemId = req.params.shoppingCartItemId;

        await deleteShoppingCartItemById(shoppingCartItemId)

        res.status(200).json({message: "Deleted"})
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Internal Server Error"})
    }
})

module.exports = {
    shoppingCartRoutes
}