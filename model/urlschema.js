const mongoose = require('mongoose')


const urlSchema= mongoose.Schema({
  
    shortId:{
        type:String,
        required:true,
      
        
    },
    redirectURL:{
        type:String,
        required:true
    },
    visitHistory:[{
        timestamp:{
            type:Number,
        }
    }],
},{
    timestamps:true
}
)

const urlModel= mongoose.model('urlshorts',urlSchema)
module.exports= {urlModel}