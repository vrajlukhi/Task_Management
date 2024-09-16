const user = require("../models/user.schema")
const jwt=require("jsonwebtoken")

const signupui=async(req,res)=>{
    res.status(200).render("signup")
}
const userui=async(req,res)=>{
    res.status(200).render("user")
}
const adminui=async(req,res)=>{
    res.status(200).render("admin")
}
const signup=async(req,res)=>{
    let{email}=req.body
    let userdata=await user.findOne({email:email})
    if(!userdata){
        let newuser=await user.create(req.body)
        res.status(200).cookie("role",newuser.role)
        res.status(200).cookie("id",newuser._id)
        res.redirect("/user/login")
        console.log(newuser)
    }
    else{
        res.redirect("/user/login")
    }
}
const loginui=async(req,res)=>{
    res.status(200).render("login")
}
const login=async(req,res)=>{
    let{email,password}=req.body
    let userdata=await user.findOne({email:email})
    if(userdata){
        if(userdata.password==password){
            let token=jwt.sign({id:userdata._id},'pass')
            res.status(200).cookie("role",userdata.role)
            res.status(200).cookie("id",userdata._id)
            res.status(200).cookie("token",token)
            if(userdata.role=="admin"){
                res.redirect("/user/admin")
            }
            else{
                res.redirect("/user/user")
            }
        }
        else{
            res.json("Password is wrong")
        }
    }
    else{
        res.redirect("/user/signup")
    }
}

module.exports={signupui,signup,loginui,login,userui,adminui}