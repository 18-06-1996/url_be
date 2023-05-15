const bcrypt=require('bcryptjs')
const saltRounds=10
const jwt= require('jsonwebtoken')
const JWTD =require('jwt-decode')
const secretkey='assdskjfioewqrevnv.fjkcdsjius'



const hashPassword= async(password)=>{

    const salt= await bcrypt.genSalt(saltRounds)
    const hashedPassword= await bcrypt.hash(password,salt)
    return hashedPassword
}

const hashCompare = async (password,hashPassword)=>{
    return await bcrypt.compare(password,hashPassword)
} 


const createToken= async(payload)=>{

    let token= await jwt.sign(payload,secretkey,{expiresIn:'10m'})
    return token
}


const validation= async(req,res,next)=>{
    console.log(req.headers.authorization)
    if(req.headers.authorization){
        let token= req.headers.authorization.split(" ")[1]
        let data= await jwt.decode(token)
        console.log(data)
        console.log(+new Date()/1000)
        if(Math.floor((+new Date()/1000))<data.exp){
          next()
        }else{
          res.status(400).send({message:"token expired"})
        }
      }else{
        res.status(400).send({message:"token not found"})
      }
      }

const adminGaurd = async(req,res,next)=>{
    console.log(req.headers.authorization)
    
    if(req.headers.authorization){
      let token= req.headers.authorization.split(" ")[1]
      let data= await jwt.decode(token)
    
     
      if(data.role==='admin'){
        next()
      }else{
        res.status(400).send({message:"only Admins are allowed"})
      }
    }else{
      res.status(400).send({message:"token not found"})
    }
    }


    const authenticate = async(token)=>{
      const decode = JWTD(token);
      if(Math.round(new Date() / 1000) <= decode.exp){
          return decode.email;
      }
      else{
          return "";
      }
  }

module.exports={hashPassword,hashCompare,createToken,validation,adminGaurd,authenticate}