const express = require('express')
const userRouter = require('./routers/user')
const productRouter = require('./routers/product')
require('./db/mongoose')


const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter,productRouter)


app.listen(port, () => {
    console.log(`Listening on port ${port}!`)
})
