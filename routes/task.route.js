const {Router}=require("express")
const { addtaskui, addtask, usertask, deltask, alltask, updatetask, searchTasks, adminupdate } = require("../controllers/task.controller")
const { Auth, authorize } = require("../middleware/auth")
const BRoute=Router()

BRoute.get("/addtask",addtaskui)
BRoute.post("/addtask",Auth,addtask)
BRoute.get("/usertask",Auth,usertask)
BRoute.get("/alltask",authorize,Auth,alltask)
BRoute.post("/updatetask",updatetask)
BRoute.post("/adminupdate",adminupdate)
BRoute.delete("/deltask/:id",Auth,deltask)
BRoute.get("/searchtask",searchTasks)

module.exports=BRoute