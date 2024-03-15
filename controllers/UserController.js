const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");
const Admin = require("../models/AdminModel");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const secretKey = "verySecretKey";
const nodemailer = require("nodemailer");

//Get All User
//@route GET /api/user
//@access Public
const getUser = asyncHandler(async (req, res) => {
  const user = await User.find({ User });
  res.status(200).json(user);
});

//Get One User
//@route GET /api/user/:id
//@access Public
const getOneUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  res.status(200).json(user);
});

//Get Multiple User
//@route GET /api/user/:ids
//@access Public
const getMultiUser = asyncHandler(async (req, res) => {
  const user = await User.find({ User });
  res.status(200).json(user);
});

//Login User
//@route POST /api/user/login
//@access Public
const loginUser = asyncHandler(async (req, res) => {
  let { UserName, password } = req.body;

  if (!UserName && !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  //Check if user exist
  const userExist = await User.findOne({ UserName });

  const bytes = CryptoJS.AES.decrypt(userExist.password, "secret key 123");
  const originalPass = bytes.toString(CryptoJS.enc.Utf8);

  if (originalPass !== password) return res.status(400).json({ error: "Wrong Password!" });
  
  if (userExist) {
    // const getUser = await User.findOne(userExist)
    // res.status(200).json(getUser)
    const userId = userExist._id;
    const isUser = userExist.role === "patient";
    const token = jwt.sign({ userId, isUser }, secretKey, { expiresIn: "1h" });
    res.status(200).json({ token, userId, isUser });
  } else {
    res.status(400);
    throw new Error("Wrong Credentials");
  }
});

//Post User
//@route POST /api/user
//@access Public
const postUser = asyncHandler(async (req, res) => {
  const {
    FirstName,
    LastName,
    MiddleName,
    birthday,
    sex,
    contactNum,
    houseNum,
    street,
    brgy,
    city,
    prov,
    email,
    UserName,
    password,
    confirmpassword,
  } = req.body;

  // !UserName||!LastName||!FirstName||!MiddleName||
  if (!UserName || !email || !password || !confirmpassword) {
    res.status(400).json({ error: "Please fill in all required fields" });
    return;
  }

  // Check if user with the same email already exists
  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400).json({ error: "Email already in use" });
    return;
  }

  // Encrypt the password before storing it
  const cipher = CryptoJS.AES.encrypt(password, "secret key 123").toString();

  const newUser = new User({
    FirstName,
    LastName,
    MiddleName,
    birthday,
    sex,
    contactNum,
    houseNum,
    street,
    brgy,
    city,
    prov,
    email,
    UserName,
    password: cipher,
    confirmpassword,
  });

  try {
    const savedUser = await newUser.save();

    // Create a JWT token for the new user
    const token = jwt.sign(
      { userId: savedUser._id, isAdmin: false },
      secretKey,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      token,
      userId: savedUser._id,
      FirstName: savedUser.FirstName,
      MiddleName: savedUser.MiddleName,
      LastName: savedUser.LastName,
      birthday: savedUser.birthday,
      sex: savedUser.sex,
      houseNum: savedUser.houseNum,
      street: savedUser.street,
      brgy: savedUser.brgy,
      city: savedUser.city,
      prov: savedUser.prov,
      contactNum: savedUser.contactNum,
      email: savedUser.email,
      UserName: savedUser.UserName,
    });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// const updateDetails = asyncHandler(async (req, res) => {
//   const userId = req.params.id;
//   const {
//       LastName,
//       FirstName,
//       MiddleName,
//       birthday,
//       sex,
//       address,
//       contactNum
//   } = req.body;

//   try {
//       let details = await Details.findOne({ user: userId });

//       if (!details) {
//           // If user details do not exist, create a new entry
//           details = new Details({
//               user: userId,
//               LastName,
//               FirstName,
//               MiddleName,
//               birthday,
//               sex,
//               address,
//               contactNum
//           });
//           await details.save();
//       } else {
//           // If user details already exist, update the existing entry
//           details.LastName = LastName;
//           details.FirstName = FirstName;
//           details.MiddleName = MiddleName;
//           details.birthday = birthday;
//           details.sex = sex;
//           details.address = address;
//           details.contactNum = contactNum;
//           await details.save();
//       }

//       res.status(200).json(details);
//   } catch (error) {
//       res.status(500).json({ error: 'Failed to update user details' });
//   }
// });

//Update User
//@route PUT /api/user/:id
//@access Public
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(400);
    throw new Error("User no found");
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedUser);
});

//Edit User Password ------------------------------------------------------------------------------------------------------------------------------------------------------
//@route PUT /api/user/:id
//@access Public
// const editPassword = asyncHandler(async (req, res) => {
//     // Check if User exists
//     const checkUser = await User.findById(req.params.id);

//     if (!checkUser) {
//       res.status(400);
//       throw new Error('User not found');
//     }

//     const cipher = CryptoJS.AES.encrypt(req.body.password, 'secret key 123').toString();

//     const updatedUser = await User.findByIdAndUpdate(
//       req.params.id,
//       { password: cipher },
//       { new: true }
//     );

//     const payload = {
//       user: {
//         id: updatedUser._id,

//       },
//     };
//     jwt.sign(payload, 'VerySecretiveKey', { expiresIn: '1h' }, (err, token) => {
//       if (err) {
//         throw err;
//       }
//       // Send the new token to the client
//       res.json({ token });
//     });
//   });

//Delete User
//@route DELETE /api/user/:id
//@access Public
const deltUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(400);
    throw new Error("User no found");
  }

  await user.deleteOne();

  res.status(200).json({ id: req.params.id });
});

//Delete Multiple User
//@route DELETE /api/user/:ids
//@access Public
const deltMultiUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(400);
    throw new Error("User no found");
  }

  await user.deleteMany();

  res.status(200).json({ id: req.params.id });
});

//FORGOT PASSWORD----------------------------------------------------------------
//@route POST /api/user/forgotpassword
const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: "ayokonasamernstack@outlook.com",
    pass: "123456789AATC!",
  },
});

const sendResetPasswordEmail = (email, resetToken) => {
  const options = {
    from: "ayokonasamernstack@outlook.com",
    to: email,
    subject: "Reset Password",
    text: `This is your reset token: ${resetToken}`,
  };

  transporter.sendMail(options, (error, info) => {
    if (error) {
      console.error("Error sending email", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
};

const generateResetToken = () => {
  const token = require("crypto").randomBytes(32).toString("hex");
  return token;
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const resetToken = generateResetToken();

    const user = await User.findOneAndUpdate(
      { email: email },
      { $set: { resetPasswordToken: resetToken } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await user.save();
    sendResetPasswordEmail(email, resetToken);

    res.status(200).json({
      message: "Password reset email has been sent. Check your inbox.",
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({
      message: "An error occurred. Please try again",
    });
  }
};


//------------------------NEW PASS
//@route POST /api/user/resetpassword

const resetPassword = async (req, res, next) => {
  try {
    const { email, resetToken, newPassword } = req.body;

    const cipher = CryptoJS.AES.encrypt(newPassword, "secret key 123").toString();

    const user = await User.findOneAndUpdate(
      { email: email, resetPasswordToken: resetToken },
      { $set: { password: cipher, confirmpassword: newPassword, resetPasswordToken: "" } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "Invalid reset token or email.",
      });
    }

    await user.save();

    res.status(200).json({
      message: "Password reset successfully!",
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({
      message: "An error occurred. Please try again.",
    });
  }
};

// MDB Query for User
// @route POST /api/user/search
// @access Public
const searchUser = asyncHandler(async (req, res) => {
  const { query } = req.body; // Assuming the query string is sent in the request body

  try {
    const regexQuery = new RegExp(query, 'i'); // Create a case-insensitive regular expression

    const users = await User.find({
      $or: [
        { UserName: { $regex: regexQuery } }
      ]
    });

    res.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = {
  getUser,
  getOneUser,
  getMultiUser,
  postUser,
  updateUser,
  deltUser,
  deltMultiUser,
  loginUser,
  forgotPassword,
  resetPassword,
  searchUser
};
