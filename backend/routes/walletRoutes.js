const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

router.get("/balance", auth, async (req, res) => { 
    const user = await User.findById(req.userId);

    res.json({ points : user.points});

})

router.post("/transfer", auth, async (req, res) => {
  try {
    const { to, amount } = req.body;
    const senderId = req.userId;

    if (amount <= 0) return res.status(400).json({ error: "Invalid amount" });

    const sender = await User.findById(senderId);
    const receiver = await User.findOne({ username: to });

    if (!receiver) return res.status(404).json({ error: "Receiver not found" });
    if (sender.points < amount) return res.status(400).json({ error: "Insufficient points" });

    sender.points -= amount;
    receiver.points += amount;

    sender.transactions.push({
      type: "sent",
      amount,
      with: receiver.username,
      date: new Date(),
    });

    receiver.transactions.push({
      type: "received",
      amount,
      with: sender.username,
      date: new Date(),
    });

    await sender.save();
    await receiver.save();

    return res.status(200).json({ message: `Sent ${amount} points to ${to}` });
  } catch (err) {
    console.error("Error in /transfer route:", err);
    res.status(500).json({ error: "Something went wrong while transferring." });
  }
});

router.get("/transactions", auth, async (req,res) => {
    const user = await User.findById(req.userId);
    res.json({ transactions : user.transactions });
});

router.post("/earn", auth, async (req,res) => {
    const { task } = req.body;
    const rewards = {
        "daily-login" : 10,
        "share-app" : 20,
        "complete-profile" : 15,
    }

    const reward = rewards[task];
    if(!reward) return res.status(400).json({ error : "Invalid task "});

    const user = await User.findById(req.userId);
    user.points += reward;
    user.transactions.push({
        type: "received",
        amount: reward,
        with: `Task: ${task}`,
        date: new Date(),
      });
      
    await user.save();

    res.json({ message: `Earned ${reward} points for ${task}` });

 })

module.exports = router;