const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// SIGNUP CONTROLLER
const Signup = async (req, res) => {
  try {
    // getting user data from request body
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    // checking if user already exists in our database
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

    // Hashing the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creating user in the database
    user = await User.create({
      email,
      password: hashedPassword,
      name,
    });
    
    const tokenData={id:user._id};
    
    const token =jwt.sign(tokenData,process.env.SECRET_KEY,{
      expiresIn:"15d"
    })

    return res.status(200).cookie("token",token,{
      maxAge:15*24*60*60*1000,
      httpOnly:true,
      sameSite:"strict"
    }).json({
      message: "User signed up successfully",
      success: true,
      user:{ email:user.email, _id:user._id, name:user.name }
    });
  } 
  catch (error) {
    console.log("Issue occurring during signup:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// LOGIN CONTROLLER
const Login = async (req, res) => {
  try {
    // getting user data from request body
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    // finding user in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    // comparing input password with the stored hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect password",
        success: false,
      });
    }

    // creating token
    const tokenData = { id: user._id };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "15d",
    });

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
        httpOnly: true, // cookie accessible only by web server
        sameSite: "strict", // CSRF protection
      })
      .json({
        message: `logged in successfully`,
        success: true,
        user: { email:user.email, _id:user._id, name:user.name }, // return user data without password
      });
  } catch (error) {
    console.log("Problem logging in:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// LOGOUT CONTROLLER
const Logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", {
        maxAge: 0, // Clear the cookie
      })
      .json({
        message: "User logged out successfully",
        success: true,
      });
  } catch (error) {
    console.log("Problem logging out the user:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

module.exports = {
  Signup,
  Login,
  Logout,
};
