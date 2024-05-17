const express = require("express");
const dbConnect = require("./config/dataBase");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();
const cors = require('cors');

require('dotenv').config();
const PORT = process.env.PORT || 4000;
const Admin = require("./routes/adminRoutes");
const Faculty = require("./routes/facultyRoutes");
const Student = require("./routes/studentRoutes");
const Login = require("./routes/loginRoutes");

app.use(cors({
    origin: true,
    credentials: true
  }));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/login", Login);
app.use("/admin", Admin);
app.use("/faculty", Faculty);
app.use("/student", Student);

app.listen(PORT, () => {
    console.log(`Connection established successfully at ${PORT}`);
})

dbConnect();
