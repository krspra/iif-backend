const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./utils/db.js");
const userRoute = require("./routes/user.route.js");
const path=require('path');

dotenv.config({});

const app = express();

const PORT = process.env.PORT || 3000;

const _dirname=path.resolve();

// middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions = {
    origin:'https://iif-nsut.onrender.com',
    credentials:true
}

app.use(cors(corsOptions));
app.options('*',cors(corsOptions))
// api's
app.use("/api/user", userRoute);

app.use(express.static(path.join(_dirname,"frontend/dist")))
app.get('*',(req,res)=>{
    res.sendFile(path.resolve(_dirname,"frontend","dist","index.html"))
})

app.listen(PORT,()=>{
    connectDB();
    console.log(`Server running at port ${PORT}`);
})