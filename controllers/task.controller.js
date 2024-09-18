const taskmodel = require("../models/task.schema")

const addtaskui=(req,res)=>{
    res.render("addtask")
}
const addtask=async(req,res)=>{
    let data=await taskmodel.create(req.body)
    res.json(data)
}
const usertask=async(req,res)=>{
    let data=await taskmodel.find({userID:req.body.userID})
    res.json(data)
}
const alltask=async(req,res)=>{
    let data=await taskmodel.find().populate("userID")
    console.log(data);
    res.json(data)
}
const updatetask=async(req,res)=>{
    let{ _id}=req.body
    let data=await taskmodel.findByIdAndUpdate(_id,req.body)
    res.redirect("/user/user")
}
const adminupdate=async(req,res)=>{
    let{ _id}=req.body
    let data=await taskmodel.findByIdAndUpdate(_id,req.body)
    res.redirect("/user/admin")
}
const deltask=async(req,res)=>{
    let{id}=req.params
    let data=await taskmodel.findByIdAndDelete(id)
    res.json(data)
}
const searchTasks = async (req, res) => {
    const { category } = req.query;
    try {
        let data;
        if (category) {
            
            data = await taskmodel.find({ category: { $regex: new RegExp(category, "i") } });
        } else {
            data = await taskmodel.find(); 
        }
        res.json(data);  
    } catch (error) {
        res.json({ error: "Error fetching tasks" });
    }
};
module.exports={addtaskui,addtask,usertask,deltask,updatetask,adminupdate,alltask,searchTasks}