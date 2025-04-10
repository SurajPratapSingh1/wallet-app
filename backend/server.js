const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth",require("./routes/authRoutes"));
app.use("/api/wallet", require("./routes/walletRoutes"));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true }).then(() => {
    app.listen(process.env.PORT, () => console.log(`Server on PORT ${process.env.PORT}`));
}).catch((err) => console.error(err));