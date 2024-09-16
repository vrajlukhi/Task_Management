const { default: mongoose } = require("mongoose")
const moongose = require("mongoose")

const taskschema = new moongose.Schema({
    title: String,
    content: String,
    category: String,
    userID : {type : mongoose.Schema.Types.ObjectId , ref : "user"}
})

const taskmodel = moongose.model("task" , taskschema)

module.exports = taskmodel