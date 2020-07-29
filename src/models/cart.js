const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    products: [{
        product: {
            type: Object
        }
        
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

const Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart