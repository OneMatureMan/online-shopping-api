const mongoose = require('mongoose')



const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: Number,
        required:true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    products: [{
        product: {
            type: Object
        }
    }],
    totalPrice: {
        type: Number,
        required: true
    }
})

const Order = mongoose.model('Order',orderSchema)


module.exports = Order