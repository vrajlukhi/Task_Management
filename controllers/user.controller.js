const user = require("../models/user.schema");
const jwt = require("jsonwebtoken");

const signupui = async (req, res) => {
    try {
        res.render("signup");
    } catch (error) {
        console.error("Error rendering signup UI:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const userui = async (req, res) => {
    try {
        res.render("user");
    } catch (error) {
        console.error("Error rendering user UI:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const adminui = async (req, res) => {
    try {
        res.render("admin");
    } catch (error) {
        console.error("Error rendering admin UI:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const signup = async (req, res) => {
    try {
        let { email } = req.body;
        let userdata = await user.findOne({ email: email });

        if (!userdata) {
            let newuser = await user.create(req.body);
            res.cookie("role", newuser.role, { httpOnly: true });
            res.cookie("id", newuser._id, { httpOnly: true });
            res.redirect("/user/login");
            console.log(newuser);
        } else {
            res.redirect("/user/login");
        }
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const loginui = async (req, res) => {
    try {
        res.render("login");
    } catch (error) {
        console.error("Error rendering login UI:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        let userdata = await user.findOne({ email: email });

        if (userdata) {
            if (userdata.password === password) {
                let token = jwt.sign({ id: userdata._id }, 'pass'); // Use environment variable for secret
                res.cookie("role", userdata.role, { httpOnly: true });
                res.cookie("id", userdata._id, { httpOnly: true });
                res.cookie("token", token, { httpOnly: true });

                if (userdata.role === "admin") {
                    res.redirect("/user/admin");
                } else {
                    res.redirect("/user/user");
                }
            } else {
                res.status(401).json("Password is wrong");
            }
        } else {
            res.redirect("/user/signup");
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { signupui, signup, loginui, login, userui, adminui };
