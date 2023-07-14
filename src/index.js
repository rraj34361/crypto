const express = require('express')
const app = express()
const {default : mongoose} = require('mongoose')
const route = require('./route/route.js')
const {MONOGO_URL, PORT} = require('../config.js')
app.use(express.json())
app.use(express.urlencoded({extended:true}))

mongoose.connect(MONOGO_URL, {useNewUrlParser : true,}).then(()=>{
    console.log("monogoDb is connected...")
}).catch((err)=>{
    console.log(err)
})

app.use('/', route)

app.listen(PORT, ()=>{
    console.log('Express app is runinng on port')
})
