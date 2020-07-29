const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Cart = require('../models/cart')

const auth = async (req,res,next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})
        const cart = await Cart.findOne({owner:user._id})

        if(!user) {
            throw new Error('')
        }
        req.user = user
        req.token = token
        req.cart = cart
        next()
    } catch (error) {
        res.status(401).send({error:'Please authenticate'})
    }
    
}

module.exports = auth