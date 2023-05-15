const express= require('express')
const app_server= require('./app')


const node_server=express();

const PORT = 5000;
// node_server.set("view engine","ejs");

node_server.use("/",app_server)

node_server.listen(PORT,()=>{
    console.log(`server started in port-${PORT}`);
})