require('dotenv').config()
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")

mongoose.set('strictQuery', false)
mongoose.connect("mongodb://127.0.0.1:27017/userDB", { useNewUrlParser: true })

const app = express()

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]})
const user = new mongoose.model("User", userSchema)

app.get("/",function(req,res) {
    res.render("home")
})

app.get("/login",function(req,res) {
    res.render("login")
})

app.get("/register",function(req,res) {
    res.render("register")
})

app.post("/register",function (req,res) {
    const newUser = new user({
        email: req.body.username,
        password: req.body.password
    })
    newUser.save(function(err) {
        if (!err) {
            res.render("secrets")
        }else {
            console.log(err);
        }
    })
})

app.post("/login", function(req,res){
    user.findOne(
        {email: req.body.username},
        function (err, founduser) {
            if(err){
                console.log(err)
            }else if(founduser){
                if(founduser.password === req.body.password){
                    res.render("secrets")
                }
            } 
        })
})










app.listen(3000, () => {
    console.log("Server started on port 3000")
})
