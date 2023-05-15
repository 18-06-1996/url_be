const shortid =require('shortid')
const urlModel = require('../model/urlschema')

async function generateNewshortUrl (req,res){
const body= req.body;
if(!body.url) return res.status(400).json({error:"url required"})

    const shortID= shortid();

    await urlModel.create({
        shortId:shortID,
        redirectURL: body.url,
        visitHistory:[]
    });
   return res.json({id:shortID});
};

async function handleclicks(req,res){
    const shortId=req.params.shortId;
   let result= await urlModel.findOne({shortId})
return  res.json({totalClicks: result.visitHistory.length});

};

module.exports= {generateNewshortUrl,handleclicks}