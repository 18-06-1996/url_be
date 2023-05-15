const express = require('express')
const mongoose= require('mongoose')
const bodyParser=require('body-parser')
const cors = require('cors')
const DB_URL = require('./common/dbconfig')


const app_server=express();

const userRouter= require('./routes/user')
const urlRouter= require('./routes/url')

//database
mongoose.connect(DB_URL)



//middleware
app_server.use(cors())
app_server.use(bodyParser.json());
app_server.use(bodyParser.urlencoded({extended:false}));
app_server.use(express.static('public'))
 app_server.set('view engine','ejs')



//controller register

app_server.use("/api",userRouter)
app_server.use("/url",urlRouter)


module.exports=app_server