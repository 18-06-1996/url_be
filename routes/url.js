const express = require('express')

const url_router=express.Router();
const urlModel = require('../model/urlschema');

const {generateNewshortUrl,handleclicks}= require('../controller/Url')

url_router.get("/all",async(req,res)=>{
    let allurl=await urlModel.find();
    res.status(200).send({allurl,message:"url details here"})
})

url_router.post("/shorturl",generateNewshortUrl);


url_router.get("/:shortId",async(req,res)=>{
    const shortId =req.params.shortId;
    const entry =await urlModel.findOneAndUpdate({shortId},{
        $push:{
            visitHistory:{
                timestamp:Date.now(),
            }
        }
    }
    )
    console.log(entry);
    res.redirect(entry.redirectURL);
})


url_router.get("/click/:shortId",handleclicks);

module.exports=url_router