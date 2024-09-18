const review = require("../models/comments.model")
const taskmodel = require("../models/task.schema")

const addtaskui=(req,res)=>{
    res.render("addtask")
}
const addtask=async(req,res)=>{
    let data=await taskmodel.create(req.body)
    req.io.emit("Create",data)
    res.redirect("/user/user")
}
const usertask=async(req,res)=>{
    let data=await taskmodel.find({userID:req.body.userID})
    res.json(data)
}
const alltask=async(req,res)=>{
    let data=await taskmodel.find().populate("userID")
    res.json(data)
}
const updatetask=async(req,res)=>{
    let{ _id}=req.body
    let data=await taskmodel.findByIdAndUpdate(_id,req.body)
    req.io.emit("update",data)
    res.redirect("/user/user")
}
const adminupdate=async(req,res)=>{
    let{ _id}=req.body
    let data=await taskmodel.findByIdAndUpdate(_id,req.body)
    req.io.emit("update",data)
    res.redirect("/user/admin")
}
const deltask=async(req,res)=>{
    let{id}=req.params
    let data=await taskmodel.findByIdAndDelete(id)
    req.io.emit("delete",data)
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
const singletask= async (req, res) => {
    let { id } = req.params

    let singleTask = await taskmodel.findById(id).populate({path:"reviews",populate:{path:"author"}})
    res.render("singletask", { singleTask })
}
const homeui=async(req,res)=>{
    res.render("home")
}
const reviews = async (req, res) => {

    let listing = await taskmodel.findById(req.params.id);
  
    let newReview = new review(req.body.review);
    
    newReview.author = req.body.userID;
  
    listing.reviews.push(newReview);
  
    await newReview.save();
    await listing.save();
  
    res.redirect(`/task/singleTask/${req.params.id}`);
  };
  
module.exports={addtaskui,addtask,usertask,deltask,updatetask,adminupdate,alltask,searchTasks,singletask,homeui,reviews}