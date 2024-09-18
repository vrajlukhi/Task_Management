const express=require("express")
const connect = require("./config/db")
const cookie=require("cookie-parser")
const URoute = require("./routes/user.route")
const BRoute = require("./routes/task.route")
const http=require("http")
const socketio=require("socket.io")
require("dotenv").config()
const app=express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.set("view engine","ejs")
app.use(express.static(__dirname+"/public"))
app.set("views",(__dirname+"/views"))
app.use(cookie())

const server = http.createServer(app);
const io = socketio(server);

app.use((req, res, next) => {
    req.io = io;
    next();
});
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

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