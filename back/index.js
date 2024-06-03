const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
var Cookies = require('cookies');
const EmployeeModel = require("./model");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/employee");

// Middleware to manage cookies
app.use((req, res, next) => {
    req.cookies = new Cookies(req, res);
    next();
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    EmployeeModel.findOne({ email: email })
        .then(user => {
            if (user) {
                if (user.password === password) {
                    // Setting a cookie to simulate a session
                    req.cookies.set('session', user._id, { httpOnly: true });
                    res.json("Success");
                } else {
                    res.json("The password is incorrect");
                }
            } else {
                res.status(403).json("You cannot Enter without Log in");
            }
        })
        .catch(err => res.status(500).json(err));
});

app.post("/logout", (req, res) => {
    // Clear the session cookie
    req.cookies.set('session', '', { expires: new Date(0) });
    res.json("Logged out successfully");
});

app.post("/register", (req, res) => {
    EmployeeModel.create(req.body)
        .then(employees => res.json(employees))
        .catch(err => res.json(err));
});

app.get('/register', async (req,res)=>{
   try{
    const RegistrationData= await EmployeeModel.find()
    res.json(RegistrationData)
   }
   catch(error){
    console.error('Error',error)
   }
})

app.listen(3001, () => {
    console.log("server is running");
});
