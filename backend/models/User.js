const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    type: { type: String, enum: ["sent", "received"], required: true },
    amount: { type: Number, required: true },
    with: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
    username : {type:String, unique : true},
    email : String,
    password : String,
    points : {type : Number, default : 100 },
    transactions: [transactionSchema],
}, {timestamps : true});

module.exports = mongoose.model("User", userSchema);