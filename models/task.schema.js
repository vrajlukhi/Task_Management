const { default: mongoose } = require("mongoose")
const moongose = require("mongoose")

const taskschema = new moongose.Schema({
    title: String,
    content: String,
    category: String,
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