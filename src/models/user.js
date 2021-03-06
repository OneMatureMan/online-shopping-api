const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Cart = require('./cart')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        trim:true,
        required: true,
        unique: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid!')
            }
        }  
    },
    password: {
        type: String,
        required:true,
        minlength: 6,
        trim: true,
        validate(value) {
            if(value === 'password') {
                throw new Error('Password cannot be password')
            }
        }

    },
    credit: {
        type: Number,
        default: 1000
    },
    tokens: [{
        token: {
            type: String,
            required:true
        }
    }]
})

userSchema.virtual('orders',{
    ref:'Order',
    localField: '_id',
    foreignField:'owner'
})
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id:user._id.toString()}, process.env.JWT_SECRET, {expiresIn:'7 days'})

    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}

//limiting the client's access to the data
userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.statics.findByCredentials = async (email,password) => {
    const user = await User.findOne({email})

    if(!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user
}

userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.pre('remove', async function (next) {
    const user = this
    await Cart.findOneAndDelete({owner:user._id})
    next()
})
const User = mongoose.model('User', userSchema)


module.exports = User
