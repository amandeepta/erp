const express = require("express");
const dbConnect = require("./config/dataBase");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 4000;
const Admin = require("./routes/admin");

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/admin", Admin);

app.listen(PORT, () => {
    console.log(`Connection established successfully at ${PORT}`);
})

dbConnect();
