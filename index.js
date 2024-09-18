const express=require("express")
const connect = require("./config/db")
const cookie=require("cookie-parser")
const URoute = require("./routes/user.route")
const BRoute = require("./routes/task.route")
require("dotenv").config()
const app=express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.set("view engine","ejs")
app.use(express.static(__dirname+"/public"))
app.set("views",(__dirname+"/views"))
app.use(cookie())

app.get("/",(req,res)=>{
    res.redirect("/user/signup")
})
app.get("/user",(req,res)=>{
    res.redirect("/user/signup")
})
app.get("/task",(req,res)=>{
    res.redirect("/task/usertask")
})
app.use("/user",URoute)
app.use("/task",BRoute)

app.listen(process.env.PORT,()=>{
    console.log(`Server start ${process.env.PORT}`)
    connect()
})