const mongoose=require("mongoose")
const connect=async()=>{
    await mongoose.connect("mongodb+srv://vrajlukhi:vrajlukhi@cluster0.h0qqzcb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    console.log("mongoose connected")
}
module.exports=connect