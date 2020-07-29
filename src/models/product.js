const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        trim:true,
        lowercase:true,
        required:true
    },
    unitPrice: {
        type: String,
        required: true
    },
    weight: {
        type: String,
        required: true
    },
    remainingStock: {
        type: Number,
        required: true
    }
})

const Product = mongoose.model('Product', productSchema)

// require('../db/mongoose')
// new Product({
//     productName: 'Gucci shoes ',
//     unitPrice: '540$',
//     weight: '54.5kg',
//     remainingStock:'2'
// }).save().then(result =>{
//     console.log(result)
// }).catch(error => {
//     console.log(error)
// })

// new Product({
//     productName: 'Lazzetleri',
//     unitPrice: '20$',
//     weight: '1.5kg',
//     remainingStock:'2'
// }).save().then(result =>{
//     console.log(result)
// }).catch(error => {
//     console.log(error)
// })

// new Product({
//     productName: 'Gazzentepe',
//     unitPrice: '4$',
//     weight: '0.5kg',
//     remainingStock:'20'
// }).save().then(result =>{
//     console.log(result)
// }).catch(error => {
//     console.log(error)
// })




module.exports = Product