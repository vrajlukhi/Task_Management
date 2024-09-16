const {Router}=require("express")
const { signupui, loginui, signup, login, adminui, userui } = require("../controllers/user.controller")
const { authorize } = require("../middleware/auth")
const URoute=Router()

URoute.get("/signup",signupui)
URoute.post("/signup",signup)
URoute.get("/login",loginui)
URoute.post("/login",login)
URoute.get("/admin",authorize,adminui)
URoute.get("/user",userui)

module.exports=URoute