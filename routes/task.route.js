const {Router}=require("express")
const { addtaskui, addtask, usertask, deltask, alltask, updatetask, searchTasks, adminupdate, singletask, homeui, reviews } = require("../controllers/task.controller")
const { Auth, authorize } = require("../middleware/auth")
const BRoute=Router()

BRoute.get("/addtask",addtaskui)
BRoute.post("/addtask",Auth,addtask)
BRoute.get("/usertask",Auth,usertask)
BRoute.get("/alltask",alltask)
BRoute.post("/updatetask",updatetask)
BRoute.post("/adminupdate",adminupdate)
BRoute.delete("/deltask/:id",Auth,deltask)
BRoute.get("/searchtask",searchTasks)
BRoute.get("/singleTask/:id",singletask)
BRoute.get("/home",homeui)
BRoute.post("/:id/comment",Auth,reviews)

module.exports=BRoute