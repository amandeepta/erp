const express = require("express");
const dbConnect = require("./config/dataBase");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 4000;
const Admin = require("./routes/adminRoutes");
const Faculty = require("./routes/facultyRoutes");
const Student = require("./routes/studentRoutes");

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/admin", Admin);
app.use("/api/faculty", Faculty);
app.use("/api/student", Student);

app.listen(PORT, () => {
    console.log(`Connection established successfully at ${PORT}`);
})

dbConnect();
