const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req,res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({username, email, password: hashedPassword});
        res.status(201).json({msg:"User registered successfully"});
    } catch (err) {
        res.status(400).json({error : "Username or email already exists"});
    }
};

exports.login = async (req,res) => {
    const { username, password } =  req.body;
    try{
        const user = await User.findOne({username});
        if(!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({error:"invalid credentials"});
        }
        const token = jwt.sign({userId : user._id}, process.env.JWT_SECRET,{expiresIn:"2h"});
        res.json({token, username : user.username, points : user.points});
    } catch(err) {
        res.status(500).json({error : "Server error"});
    }
};