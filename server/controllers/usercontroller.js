//imports
const User = require("../models/user.model");
const sendEmail = require("../utils/sendMail");
const sendToken = require("../utils/SendToken")
const Contact = require("../models/contactModel");
const bcrypt = require('bcrypt');

// ... Other imports and controller functions ...

// Change Password
// Change Password
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword, id } = req.body;
    const userId = id; // Assuming you have user information stored in req.user

    // Validate if no empty field
    const emptyFields = [];

    if (!oldPassword) {
      emptyFields.push('Old Password');
    }

    if (!newPassword) {
      emptyFields.push('New Password');
    }

    if (!confirmPassword) {
      emptyFields.push('Confirm Password');
    }

    if (emptyFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `The following fields are required: ${emptyFields.join(', ')}`,
      });
    }

    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New Password and Confirm Password do not match',
      });
    }

    // Check if the provided old password matches the current password in the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const isPasswordMatch = await user.comparePassword(oldPassword);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Old Password is incorrect',
      });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    user.Password = hashedNewPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Error during password change:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};


exports.createContact = async (req, res) => {
  try {
    const { Name, Email, PhoneNumber, Message } = req.body;

    // Validate request data (you might want to add more validation)
    if (!Name || !Email || !PhoneNumber || !Message) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    const newContact = new Contact({
      Name,
      Email,
      PhoneNumber,
      Message,
    });

    // Save the new contact to the database
    await newContact.save();

    res.status(201).json({ message: 'Contact created successfully.' });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    console.error('Error retrieving contacts:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
exports.getAllUser = async (req, res) => {
  try {
    const Users = await User.find();
    res.status(200).json(Users);
  } catch (error) {
    console.error('Error retrieving Users:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
// Register
exports.RegisterUser = async (req, res) => {
  try {
    // console.log(req.body)
    const { Name, Email, Password, ContactNumber, Role } = req.body;

    // Validate if no any empty field
    const otp = generateOtp();
    const emptyFields = [];

    if (!Name) {
      emptyFields.push('Name');
    }

    if (!Email) {
      emptyFields.push('Email');
    }

    if (!ContactNumber) {
      emptyFields.push('Number');
    }

    if (!Password) {
      emptyFields.push('Password');
    }



    if (emptyFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `The following fields are required: ${emptyFields.join(', ')}`,
      });
    }

    // Check if the email already exists in the database
    const existingUser = await User.findOne({ Email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email address is already registered',
      });
    }
    const existingUserByContactNumber = await User.findOne({ ContactNumber });
    if (existingUserByContactNumber) {
      return res.status(409).json({
        success: false,
        message: 'Contact number is already registered',
      });
    }
    // Save a new user
    const newUser = new User({
      Name,
      Email,
      Password,
      ContactNumber,
      Role,
      OtpForVerification: otp
    });

    const emailOptions = {
      email: Email,
      subject: 'Welcome To Camro Company - Verification Code Inside',
      message: `
        <html>
          <head>
            <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f6f6f6;
          }
          .container {
            width: 100%;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 10px;
            -webkit-box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            margin: 20px auto;
            max-width: 600px;
          }
          .header {
            background-color: #0044cc;
            padding: 10px;
            border-radius: 10px 10px 0 0;
            text-align: center;
            color: #ffffff;
          }
          .content {
            padding: 20px;
            text-align: center;
          }
          .content h1 {
            color: #333333;
          }
          .content p {
            font-size: 16px;
            color: #666666;
          }
          .verification-code {
            display: inline-block;
            margin: 20px 0;
            padding: 10px 20px;
            font-size: 24px;
            color: #ffffff;
            background-color: #0044cc;
            border-radius: 5px;
          }
          .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #999999;
          }.example {
    display: -ms-grid;
    display: grid;
    -webkit-transition: all .5s;
    -o-transition: all .5s;
    transition: all .5s;
    -webkit-user-select: none;
       -moz-user-select: none;
        -ms-user-select: none;
            user-select: none;
    background: -webkit-gradient(linear, left top, left bottom, from(white), to(black));
    background: -o-linear-gradient(top, white, black);
    background: linear-gradient(to bottom, white, black);
}
            </style>
          </head>
          <body>
            <div className="container">
              <div className="header">
                <h2>Welcome to Camro </h2>
              </div>
              <div className="content">
                <h1>Congratulations, ${Name}!</h1>
                <p>We are excited to have you on board. To get started, please verify your email address using the verification code below:</p>
                <div className="verification-code">${otp}</div>
                <p>Thank you for joining us at Camro Company. If you have any questions, feel free to contact our support team.</p>
              </div>
              <div className="footer">
                &copy; ${new Date().getFullYear()} Camro Company. All rights reserved.
              </div>
            </div>
          </body>
        </html>
      `,
    };

    // Note: Ensure `verificationCode` variable is defined and contains the actual verification code.




    // Save the new user to the database
    await newUser.save();
    // Send welcome email
    await sendEmail(emailOptions);
    return res.status(200).json({
      success: true,
      data: newUser,
      message: 'Registration successful',
    });
  } catch (error) {
    console.error('Error during user registration:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};


exports.verifyOtpForSignIn = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate email format
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    // Validate OTP format (numeric string of length 6)
    if (!otp || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid OTP',
      });
    }

    const existingUserByMail = await User.findOne({ Email: email });
    if (!existingUserByMail) {
      return res.status(404).json({
        success: false,
        message: 'User not registered',
      });
    }

    // Check if user is already verified
    if (existingUserByMail.isActive) {
      return res.status(400).json({
        success: false,
        message: 'User is already verified',
      });
    }

    // Check if OTP matches and is within the expiration time
    if (existingUserByMail.OtpForVerification === otp && existingUserByMail.isActive === false) {
      // Verify user
      existingUserByMail.isActive = true;
      await existingUserByMail.save();

      const emailOptions = {
        email: email,
        subject: 'Welcome to Camro Company - Verification Successful',
        message: `
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f6f6f6;
                }
                .container {
                  width: 100%;
                  padding: 20px;
                  background-color: #ffffff;
                  border-radius: 10px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  margin: 20px auto;
                  max-width: 600px;
                }
                .header {
                  background-color: #0044cc;
                  padding: 10px;
                  border-radius: 10px 10px 0 0;
                  text-align: center;
                  color: #ffffff;
                }
                .content {
                  padding: 20px;
                  text-align: center;
                }
                .content h1 {
                  color: #333333;
                }
                .content p {
                  font-size: 16px;
                  color: #666666;
                }
                .button {
                  display: inline-block;
                  margin: 20px 0;
                  padding: 10px 20px;
                  font-size: 16px;
                  color: #ffffff;
                  background-color: #0044cc;
                  border-radius: 5px;
                  text-decoration: none;
                }
                .footer {
                  text-align: center;
                  padding: 20px;
                  font-size: 12px;
                  color: #999999;
                }
              </style>
            </head>
            <body>
              <div className="container">
                <div className="header">
                  <h2>Welcome to Camro Company</h2>
                </div>
                <div className="content">
                  <h1>Congratulations, ${existingUserByMail.Name}!</h1>
                  <p>Your email has been successfully verified. We are excited to have you on board.</p>
                  <a target="_blank" href="https://camrosteel.com/" className="button">Visit Our Website</a>
                  <p>Thank you for joining us at Camro Company. If you have any questions, feel free to contact our support team.</p>
                </div>
                <div className="footer">
                  &copy; ${new Date().getFullYear()} Camro Company. All rights reserved.
                </div>
              </div>
            </body>
          </html>
        `,
      };
      try {
        await sendEmail(emailOptions);
      } catch (error) {
        console.error('Error sending verification email:', error);
        return res.status(500).json({
          success: false,
          message: 'Error sending verification email',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'User verified successfully',
      });
    } else {
      // Optional: Implement account deletion or another action after a certain number of failed attempts
      return res.status(401).json({
        success: false,
        message: 'Invalid OTP',
      });
    }
  } catch (error) {
    console.error('Error during user verification:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
exports.ResendSignOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(403).json({
        success: false,
        msg: "Please provide an email"
      });
    }

    const user = await User.findOne({ Email: email });
    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "User Not Available With this Email"
      });
    }

    const otp = generateOtp();
    user.OtpForVerification = otp;


    await user.save();

    const options = {
      email: email,
      subject: "Sign In OTP Request - Resend OTP",
      message: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f6f6f6;
              }
              .container {
                width: 100%;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                margin: 20px auto;
                max-width: 600px;
              }
              .header {
                background-color: #0044cc;
                padding: 10px;
                border-radius: 10px 10px 0 0;
                text-align: center;
                color: #ffffff;
              }
              .content {
                padding: 20px;
                text-align: center;
              }
              .content h1 {
                color: #333333;
              }
              .content p {
                font-size: 16px;
                color: #ffffff;
                background-color: #ff0000;
                padding: 10px;
                border-radius: 5px;
              }
              .footer {
                text-align: center;
                padding: 20px;
                font-size: 12px;
                color: #999999;
              }
            </style>
          </head>
          <body>
            <div className="container">
              <div className="header">
                <h2>Sign In OTP Request - Resend OTP</h2>
              </div>
              <div className="content">
                <p>Your new OTP for Sign-In : <strong>${otp}</strong></p>
                <p>Please use this OTP to sign in to your account.</p>
                <p>If you didn't request this OTP, please ignore this email.</p>
              </div>
              <div className="footer">
                &copy; ${new Date().getFullYear()} Camro Company. All rights reserved.
              </div>
            </div>
          </body>
        </html>
      `
    };

    await sendEmail(options);

    return res.status(200).json({
      success: true,
      msg: "OTP resent to your email"
    });
  } catch (error) {
    console.log(error);
    res.status(501).json({
      success: false,
      msg: "Internal Server Error"
    });
  }
};
//Login 
exports.LogginUser = async (req, res) => {
  try {

    const { Email, Password } = req.body

    if (!Email || !Password) {
      return res.status(403).json({
        success: false,
        message: "Please enter all fields"
      })
    }
    const checkUser = await User.findOne({ Email })

    if (!checkUser) {
      return res.status(401).json({
        success: false,
        message: "User Not Found"
      })
    }

    const PasswordMatch = await checkUser.comparePassword(Password)
    if (!PasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password"
      })
    }

    await sendToken(checkUser, res, 200);
  } catch (error) {
    console.log(error)
  }
}


//Logout

exports.LogoutUser = async (req, res) => {
  //clear cookie
  try {
    res.cookie('Token')
    // console.log('LogoutUser')

    return res.status(200).json({
      success: true,
      message: 'Logged out'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}


exports.getUserIdbyUser = async (req, res) => {
  try {
    let userid = req.params.user_id;
    let UserInfo = await User.findById(userid, -"password");
    if (!UserInfo) {
      return res.status(403).json({
        success: false,
        msg: 'user is not found'
      })
    }



    return res.status(200).json({
      success: true,
      msg: 'user is found',
      data: UserInfo
    })


  }
  catch (error) {
    console.log(error)
  }
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Check if OTP is expired
function isOtpExpired(otpGeneratedAt) {
  const now = new Date();
  const expiryTime = 5 * 60 * 1000; // 5 minutes in milliseconds
  return now - otpGeneratedAt > expiryTime;
}
exports.PasswordChangeRequest = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(403).json({
        success: false,
        msg: "Please Fill All Required Fields"
      });
    }

    const user = await User.findOne({ Email: email });
    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "User Not Available With this Email"
      });
    }

    const otp = generateOtp();
    user.ForgetPasswordOtp = otp;
    user.OtpGeneratedAt = new Date();

    await user.save();

    const options = {
      email: email,
      subject: "Password Reset Request",
      message: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f6f6f6;
              }
              .container {
                width: 100%;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                margin: 20px auto;
                max-width: 600px;
              }
              .header {
                background-color: #0044cc;
                padding: 10px;
                border-radius: 10px 10px 0 0;
                text-align: center;
                color: #ffffff;
              }
              .content {
                padding: 20px;
                text-align: center;
              }
              .content p {
                font-size: 16px;
                color: #ffffff;
                background-color: #ff0000;
                padding: 10px;
                border-radius: 5px;
              }
              .footer {
                text-align: center;
                padding: 20px;
                font-size: 12px;
                color: #999999;
              }
            </style>
          </head>
          <body>
            <div className="container">
              <div className="header">
                <h2>Password Reset Request</h2>
              </div>
              <div className="content">
                <p>Your OTP for password reset is: <strong>${otp}</strong></p>
                <p>Please use this OTP to reset your password.</p>
                <p>If you didn't request this password reset, please ignore this email.</p>
              </div>
              <div className="footer">
                &copy; ${new Date().getFullYear()} Camro Company. All rights reserved.
              </div>
            </div>
          </body>
        </html>
      `
    };


    await sendEmail(options);

    return res.status(200).json({
      success: true,
      msg: "OTP sent to your email"
    });
  } catch (error) {
    console.log(error);
    res.status(501).json({
      success: false,
      msg: "Internal Server Error"
    });
  }
};

//Resend OTP
exports.ResendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(403).json({
        success: false,
        msg: "Please provide an email"
      });
    }

    const user = await User.findOne({ Email: email });
    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "User Not Available With this Email"
      });
    }

    const otp = generateOtp();
    user.ForgetPasswordOtp = otp;
    user.OtpGeneratedAt = new Date();

    await user.save();

    const options = {
      email: email,
      subject: "Password Reset Request - Resend OTP",
      message: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f6f6f6;
              }
              .container {
                width: 100%;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                margin: 20px auto;
                max-width: 600px;
              }
              .header {
                background-color: #ff0000; /* Red background */
                padding: 10px;
                border-radius: 10px 10px 0 0;
                text-align: center;
                color: #ffffff; /* White text */
              }
              .content {
                padding: 20px;
                text-align: center;
              }
              .content p {
                font-size: 16px;
                color: #ff0000; /* Red text */
              }
              .footer {
                text-align: center;
                padding: 20px;
                font-size: 12px;
                color: #999999;
              }
            </style>
          </head>
          <body>
            <div className="container">
              <div className="header">
                <h2>Password Reset Request - Resend OTP</h2>
              </div>
              <div className="content">
                <p>Your new OTP for password reset is: <strong style="color: #ffffff;">${otp}</strong></p>
                <p>Please use this OTP to reset your password.</p>
                <p>If you didn't request this password reset, please ignore this email.</p>
              </div>
              <div className="footer">
                &copy; ${new Date().getFullYear()} Camro Company. All rights reserved.
              </div>
            </div>
          </body>
        </html>
      `
    };


    await sendEmail(options);

    return res.status(200).json({
      success: true,
      msg: "OTP resent to your email"
    });
  } catch (error) {
    console.log(error);
    res.status(501).json({
      success: false,
      msg: "Internal Server Error"
    });
  }
};

//Verify OTP and Change Password
exports.VerifyOtp = async (req, res) => {
  try {
    const { otp } = req.body; // Ensure newPassword is retrieved from req.body
    const { email, newPassword } = req.params; // email is retrieved from req.params

    if (!email || !otp || !newPassword) {
      return res.status(403).json({
        success: false,
        msg: "Please Fill All Required Fields"
      });
    }

    const user = await User.findOne({ Email: email });
    if (!user || user.ForgetPasswordOtp !== otp) {
      return res.status(401).json({
        success: false,
        msg: "Invalid OTP or Email"
      });
    }

    if (isOtpExpired(user.OtpGeneratedAt)) {
      return res.status(401).json({
        success: false,
        msg: "OTP has expired"
      });
    }


    user.Password = newPassword
    user.ForgetPasswordOtp = null;
    user.OtpGeneratedAt = null;

    await user.save();

    return res.status(200).json({
      success: true,
      msg: "Password updated successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(501).json({
      success: false,
      msg: "Internal Server Error"
    });
  }
};
