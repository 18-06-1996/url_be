const express= require('express')
const jwt= require('jsonwebtoken')
const {userModel} = require('../model/userschema');
const nodemailer = require('nodemailer')

const { hashPassword, hashCompare ,adminGaurd, createToken, authenticate ,validation} = require('../common/auth');



const router=express.Router();

const secretkey='assdskjfioewqrevnv.fjkcdsjius'


router.post("/register", async(req,res)=>{
    try {
        let user=await userModel.findOne({email:req.body.email})
console.log(user);
if(user){
    res.status(200).send({message:"user already exixts"})
}else{
    let hashedPassword= await hashPassword(req.body.password)
    req.body.password=hashedPassword
    let user = await userModel.create(req.body)
    res.status(200).send({user,message:"User Login Successfully..!!"})

    const transporter= await nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:'kpkarthic18@gmail.com',
            pass: 'ifawtoqsgiuysege'
        }
    })
    const mailOptions ={
        from:'kpkarthic18@gmail.com',
        to:'karthick18696@gmail.com',
        subject:'message from client',
        html:`
        <ul>
        <li><h1>Email Confirmation .....</h1></li>
        <li><h1>Welcome to you...</h1></li>
        </ul>
<div>
<p>You are one step away to shorten your lengthy url. Please confirm your email by clicking on the following link</p>
<a href='http://localhost:5000/api/login'> Click here</a>
<p>The link expires 15 minutes from now</p>
</div>

        `
    }
 const sendconfirmationEmail= await   transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
            console.log(error);
        }else{
            console.log(`Email send ${info.response}`);
        }
    })
transporter.close()
  

}
        
    } catch (error) {
        res.status(500).send({message:"inernal server error"})
    }
})

router.get("/all",validation,adminGaurd, async(req,res)=>{

    try {
        let users= await userModel.find({},{password:0});
        res.status(200).send({users,message:"user details Here"}) ,users

    } catch (error) {
        res.status(400).send({message:"internal server error  "}) ,error
    }

})


router.post("/login",async(req,res)=>{

    try {
        let user= await userModel.findOne({email:req.body.email})
        if(user){
if(await hashCompare(req.body.password,user.password)){
    let token=await createToken({
        name:user.name,
        email:user.email,
        id:user._id,
        role:user.role
    })
    console.log(token);
    res.status(200).send({
        message:"User Login Successfull!",
      token
      })

}else{
     res.status(402).send({message:"invalid password"})
 }
       }

    }
     catch (error) {
        res.status(500).send({message:"internal server error"})
    }
})


router.post("/forget-password",async(req,res)=>{
    const {email}=req.body;
    try {
        const olduser=await userModel.findOne({email});
        console.log(olduser);
        if(!olduser){
            return res.status(400).json({
                message:"user not exists"
            });
        }
      
        let token=await createToken({
           
                                             name:olduser.name,
                                            email:olduser.email,
                                            id:olduser._id,
                                             role:olduser.role,
                                            }  )


// console.log(token);

        const link = `http://localhost:5000/api/reset-password/${olduser._id}/${token}`;
 
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'kpkarthic18@gmail.com',
              pass: 'ifawtoqsgiuysege',
            },
          });
      
          var mailOptions = {
            from: 'kpkarthic18@gmail.com',
            to: 'karthick18696@gmail.com',
            subject: "Password Reset",
            text: link,
          };
      
          transporter.sendMail(mailOptions, (error, info)=> {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });

        console.log(link);
    } catch (error) {
        console.log(error);
    }
})


router.post("/reset-password/:id/:token",async(req,res)=>{
    const {id,token}=req.params;
    console.log(req.params);

const oldUser=await userModel.findOne({_id:id});
if(!oldUser){
    return res.json({ status: "User Not Exists!!" });
}


try {
    const verify = jwt.verify(token,secretkey);
    res.render("index",{email:verify.email,status:" not-verified"});

} catch (error) {
    console.log(error);
res.send("not verified");
}

});


router.post("/reset-password/:id/:token",async(req,res)=>{
    const {id,token}=req.params;
   let {password}=req.body;

const oldUser=await userModel.findOne({_id:id});
if(!oldUser){
    return res.json({ status: "User Not Exists!!" });
}

try {
     const verify = jwt.verify(token,secretkey);

    let hashedPassword= await hashPassword(password)
    // password=hashedPassword

    await userModel.updateOne({_id: id,},{$set: {password:hashedPassword},});

    res.status(200).json({message:"password updated"})

} catch (error) {
    console.log(error);
res.json({message:" somthing went wrong",error});
}

});


router.put("/edit/:id",adminGaurd,async(req,res)=>{
    try {
        let user= await userModel.findOne({_id:req.params.id})

        if(user){
            user.name=req.body.name
            user.email=req.body.email
            user.password=req.body.password
            user.role=req.body.role

await user.save()
            res.status(200).send({user,message:"user updated successfully...!"})
        }else{
            res.status(400).send({message:"user detail not updated ..!"})
        }
    } catch (error) {
        res.status(500).send({message:"internal server error"})
    }
})

router.delete("/delete/:id",adminGaurd,async(req,res)=>{
    try {
        let user= await userModel.findOne({_id:req.params.id})

        if(user){
            let user = await userModel.deleteOne({_id:req.params.id})
            res.status(200).send({user,message:"user deleted successfully...!"})
        }else{
            res.status(400).send({message:"user detail not deleted ..!"})
        }
    } catch (error) {
        res.status(500).send({message:"internal server error"})
    }
})




module.exports=router;