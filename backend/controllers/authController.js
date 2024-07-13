const User = require("../models/Users");
const ResetToken = require("../models/resetToken");

const jwt = require("jsonwebtoken");
const crypto = require('crypto');

require("dotenv").config({path:"./config.env"});
const nodeMailer = require("nodemailer");

const createTransporter = async (mailOptions) => {
  try{
      const transporter=nodeMailer.createTransport({
      host:process.env.EMAIL_HOST,
      port:process.env.EMAIL_PORT,
       auth:{
           user:process.env.EMAIL_USERNAME,
           pass:process.env.EMAIL_PASSWORD
       }
      });
    if (!transporter) throw new Error('no transport client')

    // const mailOptions = {
    //   to: "kluke952@gmail.com",
    //   from: process.env.EMAIL,
    //   subject: "Node.js Email with Secure OAuth",
    //   generateTextFromHTML: true,
    //   html: "<b>test</b>"
    // };

    transporter.sendMail(mailOptions, (error, response) => {
      console.log("ERROR IN NODEMAILER ",error);
      smtpTransport.close();
    });
    // return transporter;
  } catch (e) {
    console.log(e);
  }
};

// const sendEmail = async (emailOptions) => {
//   try {
//     let emailTransporter = await createTransporter();
//     if (!emailTransporter) throw new Error('no email transport')
//     await emailTransporter.sendMail(emailOptions);
//   } catch (err) {
//     console.log(err);
//   }
// };
// const smtpTransport = require('nodemailer-smtp-transport');


async function generateToken(length = 32) {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(length, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        const token = buffer.toString("hex");
        resolve(token);
      }
    });
  });
}

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  // incorrect email
  if (err.message === "incorrect email") {
    errors.email = "That email is not registered";
  }

  // incorrect password
  if (err.message === "incorrect password") {
    errors.password = "That password is incorrect";
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = "that email is already registered";
    return errors;
  }

  // validation errors
  if (err.message.includes("user validation failed")) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id, isAdmin) => {
  return jwt.sign({ id, isAdmin }, "mysecret", {
    expiresIn: maxAge,
  });
};

// controller actions
module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.signup_post = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.create({ username, email, password});
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

    // console.log(user)
    console.log(res.cookie.jwt);
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).send({ errors });
  }

  // console.log(email, password);
  // res.send('new signup');
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id, user.isAdmin);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id, isAdmin: user.isAdmin });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = (req, res) => {
  console.log("logout hit" )
  res.cookie("jwt", "", { maxAge: 1 });
  res.send("logged out");
};

module.exports.ResetTokenPost = async (req, res) => {
  const { email } = req.body;
  const user=await User.findOne({email});
  if(!user){
    res.json({status:"fail",error:"Email does not exist"});
    return;
  }
  const token = await generateToken();

  try {
    if (!token) throw new Error("failed to generate token");

    const resetToken = await ResetToken.create({ email, token });

    const resetLink = `${req.protocol}://${req.get('host')}${req.originalUrl}/auth/forgotPassword?token=${token}`;
    const mailOptions = {
      to: email,
      subject: "Reset Password",
      text: `Click the following link to reset your password: ${resetLink}`,
      from: `Vanshaj Tiwari<vanshajtiwari62@gmail.com>`,
    };

    // transporter.sendMail(mailOptions, (error, info) => {
    //   if (error) {
    //     console.log('Error sending email: ' + error);
    //     res.status(500).json({ message: 'Failed to send reset email' });
    //   } else {
    //     console.log('Email sent: ' + info.response);
    //     res.status(200).json({ message: 'Reset email sent successfully' });
    //   }
    // });
    createTransporter(mailOptions);
    res.status(200).json({ status: 'ok' });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.ResetTokenGet = async (req, res) => {
  try {
    const { token } = req.query;

    // Check if the token exists in the database
    const resetToken = await ResetToken.findOne({ token });

    if (!resetToken) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // You can render a form for the user to enter a new password
    // Or handle it in any other way that suits your application

    // After the password is reset, delete the token from the database
    // await resetToken.remove();

    res.status(200).json({ token: token, sendNewPassword: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.changePassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const resetToken = await ResetToken.findOne({ token });
    if (!resetToken) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // if (new Date() > resetToken.createdAt) {
    //   return res.status(400).json({ message: "Token has expired" });
    // }

    const user = await User.findOne({ email: resetToken.email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // const hashedPassword = await bcrypt.hash(password, 10);
    user.password = password;

    // Save the updated user document
    await user.save();

    // Remove the used reset token from the database
    await ResetToken.findOneAndDelete({ _id: resetToken._id });

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.emailTest = async (req, res) => {
  createTransporter();
  res.status(200).json('done');
  // res.status(400).json({ message: result });
};
