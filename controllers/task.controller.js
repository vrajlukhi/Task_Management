const review = require("../models/comments.model")
const taskmodel = require("../models/task.schema")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const csvParser = require("csv-parser")
const { Parsser, Parser } = require("json2csv")
const user = require("../models/user.schema")

const addtaskui = (req, res) => {
    res.render("addtask")
}
const addtask = async (req, res) => {
    try {
        const { title, content, category, duedate, priority, status, assignedTo } = req.body;

        if (!title || title.trim() === "") {
            return res.status(400).json({ message: "Task title cannot be empty." });
        }

        const existingTask = await taskmodel.findOne({ title });
        if (existingTask) {
            return res.status(400).json({ message: "Task with this title already exists." });
        }

        const currentDate = new Date();
        const taskDueDate = new Date(duedate);
        if (taskDueDate < currentDate) {
            return res.status(400).json({ message: "Due date cannot be in the past." });
        }

        const taskData = {
            title,
            content,
            category,
            duedate: taskDueDate,
            status,
            priority,
        };

        const newTask = await taskmodel.create(taskData);
        req.io.emit("taskcreated", newTask);
        res.redirect("/user/user");

    } catch (error) {
        res.status(500).json({ message: "Error creating task", error });
    }
}
const usertask = async (req, res) => {
    let data = await taskmodel.find({ userID: req.body.userID })
    res.json(data)
}
const alltask = async (req, res) => {
    let data = await taskmodel.find().populate("userID")
    res.json(data)
}
const updatetask = async (req, res) => {
    let { _id } = req.body
    let data = await taskmodel.findByIdAndUpdate(_id, req.body)
    req.io.emit("update", data)
    res.redirect("/user/user")
}
const adminupdate = async (req, res) => {
    let { _id } = req.body
    let data = await taskmodel.findByIdAndUpdate(_id, req.body)
    req.io.emit("update", data)
    res.redirect("/user/admin")
}
const deltask = async (req, res) => {
    let { id } = req.params
    let data = await taskmodel.findByIdAndDelete(id)
    req.io.emit("delete", data)
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
        res.json({ error: "Error fetching tasks" });
    }
};
const singletask = async (req, res) => {
    let { id } = req.params

    let singleTask = await taskmodel.findById(id).populate({ path: "reviews", populate: { path: "author" } })
    res.render("singletask", { singleTask })
}
const homeui = async (req, res) => {
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

const TasksPagination = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const tasks = await taskmodel.find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await taskmodel.countDocuments();

        res.json({
            tasks,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching tasks' });
    } i
};

const getTasks = async (req, res) => {
    const { page = 1, limit = 10, status, priority, assignedTo, dueDateSort } = req.query;
    const query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;

    console.log(query)

    const sortOptions = dueDateSort ? { duedate: dueDateSort === 'asc' ? 1 : -1 } : {};

    try {
        const tasks = await taskmodel.find(query)
            .populate("userID", "assignedTo")
            .sort(sortOptions)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        console.log(query)
        console.log(tasks)

        const totalTasks = await taskmodel.countDocuments(query);
        console.log(totalTasks)
        res.json({
            tasks,
            totalPages: Math.ceil(totalTasks / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error });
    }
};


const upload = multer({
    dest: "uploads/",
    limits: { fileSize: 7 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== "text/csv") {
            return cb(new Error("Only CSV files are allowed!"), false);
            
        }
        cb(null, true);
        
    },
});

const exportTasksToCSV = async (req, res) => {
    try {
        const tasks = await taskmodel.find().populate("assignedTo");

        const fields = ["title", "des", "category", "duedate", "assignedTo.username"];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(tasks);

        res.header("Content-Type", "text/csv");
        res.attachment("tasks.csv");
        res.send(csv);
    } catch (error) {
        console.error("Error exporting tasks to CSV:", error);
        res.status(500).send("Error exporting tasks to CSV");
    }
};

const importTasksFromCSV = async (req, res) => {
    try {
        const tasks = [];
        const users = await user.find(); // Pre-fetch all users to validate 'assignedTo' field

        // Read CSV file
        fs.createReadStream(req.file.path)
            .pipe(csvParser())
            .on("data", (row) => {
                // Validate the task data format
                if (!row.title || !row.content || !row.duedate || !row.assignedTo) {
                    throw new Error("Missing required fields in CSV row");
                }

                // Validate assigned user exists
                const assignedUser = user.find((user) => user.username === row.assignedTo);
                if (!assignedUser) {
                    throw new Error(`Assigned user ${row.assignedTo} not found`);
                }

                // Push the valid task data into the array
                tasks.push({
                    title: row.title,
                    content: row.content,
                    category: row.category || "General",
                    duedate: new Date(row.duedate)
                });
            })
            .on("end", async () => {
                // Insert the valid tasks in bulk
                await taskmodel.insertMany(tasks);

                // Clean up uploaded file
                fs.unlinkSync(req.file.path);

                res.status(200).send("Tasks imported successfully");
            });
    } catch (error) {
        console.error("Error importing tasks from CSV:", error);
        res.status(500).send("Error importing tasks from CSV");
    }
};



module.exports = { addtaskui, addtask, usertask, deltask, updatetask, adminupdate, alltask, searchTasks, singletask, homeui, reviews, TasksPagination, getTasks, exportTasksToCSV, importTasksFromCSV, upload }