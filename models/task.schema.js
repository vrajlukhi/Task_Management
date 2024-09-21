const { default: mongoose } = require("mongoose")
const moongose = require("mongoose")

const taskschema = new moongose.Schema({
    title: {
        type:String,
    },
    content: {
        type:String,
    },
    category: {
        type:String,
        
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
    },
    userID : {type : mongoose.Schema.Types.ObjectId , ref : "user"},
    duedate: { type: Date },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "comments",
    }]
},{timestamps:true})

const taskmodel = moongose.model("task" , taskschema)

module.exports = taskmodel