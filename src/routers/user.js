const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const Cart = require('../models/cart')
const auth = require('../middleware/auth')



router.post('/users', async (req,res)=> {
    const user = new User(req.body)
    const cart = new Cart({
            owner: user._id
    })

    try {
        await user.save()
        await cart.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    } catch (error) {   
        res.status(400).send(error)
    }
})

router.post('/users/login', async (req,res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({user,token})
    } catch (error) {
        res.status(400).send({error:error.message})
    }
})

router.post('/users/logout',auth, async (req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/users/me', auth , async (req,res) => {
    try {
        res.status(200).send(req.user)
    } catch (error) {
        res.status(400).send()
    }
})

router.patch('/users/me',auth , async (req,res) => {
    const updates = Object.keys(req.body)
    const updatables = ['name','email','password']
    const isValidOperation = updates.every(update => updatables.includes(update))

    try {
        if (!isValidOperation){
            return res.status(400).send({error:'Invalid updates!'})
        }
        updates.forEach(update => req.user[update] = req.body[update])
        await req.user.save()
        res.status(200).send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/users/me', auth, async (req,res) => {
    try {
        await req.user.remove()
        res.status(200).send()
    } catch (error) {
        res.status(400).send(error.message)
    }
    
})

module.exports = router