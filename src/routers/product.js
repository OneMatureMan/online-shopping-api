const express = require('express')
const router = new express.Router()
const Product = require('../models/product')
const auth = require('../middleware/auth')
const Order = require('../models/order')

function rand(min, max) {
    let randomNum = Math.random() * (max - min) + min;
    return Math.round(randomNum);
 }
 rand(10, 20);



router.post('/products', async (req,res) => {
    try {
        const product1 = new Product({
            productName: 'Gucci shoes ',
            unitPrice: '540$',
            weight: '54.5kg',
            remainingStock:'2'
        })
        const product2 = new Product({
            productName: 'Jacket',
            unitPrice: '20$',
            weight: '2kg',
            remainingStock:'5'
        })
        await product1.save()
        await product2.save()
        res.send()
    } catch (error) {
        
    }
})

router.get('/products', async (req,res) => {
    const products = await Product.find()
    res.send(products)
})

router.get('/cart', auth, async (req,res) => {
    try {
        res.status(200).send(req.cart)
    } catch (error) {
        res.status(500).send
    }
})

router.get('/orders', auth, async (req,res) => {
    try {
        await req.user.populate({
            path:'orders',
        }).execPopulate()
        res.send(req.user.orders)
    } catch (error) {
        
    }
})

router.post('/order', auth, async (req,res) => {
    let totalPrice = 0 
    try {
        if (req.cart.products.length === 0) {
            return res.status(404).send({error:'cart is already empty!'})
        }
        req.cart.products.map(product => {
            const price = parseInt(product.product.unitPrice.replace('$',''))
            totalPrice = totalPrice + price
        })
        if(totalPrice > req.user.credit){
            return res.status(400).send({error:'Credit is not enough!'})
        }
        const order = new Order({
            orderNumber: rand(5000000,6000000),
            owner: req.user._id,
            totalPrice,
            products: req.cart.products
        })
        req.user.credit = req.user.credit - totalPrice
        req.cart.products = []

        await order.save()
        await req.user.save()
        await req.cart.save()
        res.send()
    } catch (error) {
        
    }
})


router.post('/addItem', auth, async (req,res) => {
    try {
        const product = await Product.findOne({productName:req.body.productName})

        if(!product){ 
            return res.status(404).send({error:'This product name does not exist!'})
        }

        req.cart.products = req.cart.products.concat({product})
        await req.cart.save()
   
        res.status(200).send(product)
    } catch (error) {
        res.status(500).send(error.message)
    }
    
})

router.post('/addCredit', auth, async (req,res) => {
    try {
        req.user.credit = req.user.credit + req.body.credit
        await req.user.save()
        res.status(200).send(`${req.body.credit}$ add sucessfully!`)
    } catch (error) {
        res.status(500).send()
    }
})

router.delete('/removeItem', auth, async (req,res) => {
    
    try {
        const index = req.cart.products.findIndex(product => req.body.productName === product.product.productName)

        if (index !== -1){
            req.cart.products.splice(index,1)
            req.cart.save()
        } else {
            return res.status(404).send({error:'Product does not exist in your cart!'})
        }
        res.status(200).send()
    } catch (error) {
        res.status(500).send()
    }
})



router.delete('/emptyCart', auth, async (req,res) => {
    try {  
        if (req.cart.products.length === 0) {
            return res.status(404).send({error:'cart is already empty!'})
        }
        req.cart.products = []
        await req.cart.save()
        res.status(200).send()
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router