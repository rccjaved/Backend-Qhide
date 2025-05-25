const bcrypt = require('bcrypt')
const { createToken } = require('../utils/tokenCreate')
const { User, Role } = require('../models');
const { generateOTP } = require('../utils/otp');
const { responseReturn } = require('../utils/response')
const { saveOtp, getOtpRecord, deleteOtp } = require('../utils/otpStore');
const transport = require('../utils/mailTransport');


class authController {

  signup = async (req, res) => {
    try {
      const { emailOrPhone, password } = req.body;
      if (!emailOrPhone || !password) {
        return res
          .status(400)
          .json({ success: false, message: 'Email or phone and password required.' });
      }

      const isEmail = emailOrPhone.includes('@');
      const email = isEmail ? emailOrPhone.toLowerCase() : null;
      const phone = !isEmail ? emailOrPhone : null;

      const exists = await User.findOne({
        where: isEmail ? { email } : { phone }
      });
      if (exists) {
        return res
          .status(400)
          .json({ success: false, message: 'That email/phone is already registered.' });
      }

      const otp = generateOTP();
      console.log(`Generated OTP for ${emailOrPhone}:`, otp);
      saveOtp(isEmail ? email : phone, otp);

      if (isEmail) {
        await transport.sendMail({
          from: `<${process.env.GMAIL_USER}>`,
          to: email,
          subject: 'Your One-Time SignUp Verification Code',
          text: `Your OTP is ${otp}. It expires in 5 minutes.`,
          html: `<p>Your OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`
        });

        return res
          .status(200)
          .json({
            success: true,
            message: 'OTP sent to your email.',
            otp: otp
          });
      }

      // phone path (if you later add SMS)
      return res
        .status(200)
        .json({
          success: true,
          message: 'OTP generated for phone (SMS logic not set up).',
          otp: otp
        });

    } catch (err) {
      console.error('Signup error:', err);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error.' });
    }
  }; //End Method



  verifyOtpAndRegister = async (req, res) => {
    const { emailOrPhone, otp, password } = req.body;
    if (!emailOrPhone || !otp || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Email/phone, OTP, and password are required.' });
    }

    const isEmail = emailOrPhone.includes('@');
    const key = isEmail ? emailOrPhone.toLowerCase() : emailOrPhone;
    const rec = getOtpRecord(key);
    if (!rec || rec.otp !== otp) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid or expired OTP.' });
    }

    // hash & create user
    const hashed = bcrypt.hashSync(password, 8);
    try {
      await User.create({
        email: isEmail ? key : null,
        phone: !isEmail ? key : null,
        password: hashed,
        role_id: 2
      });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: err.message });
    }

    // cleanup and respond
    deleteOtp(key);
    return res
      .status(200)
      .json({ success: true, message: 'User registered successfully.' });
  }; //End Method


  // controllers/authController.js

  signin = async (req, res) => {
    const { emailOrPhone, password } = req.body;
    if (!emailOrPhone || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Email/phone and password required.' });
    }

    const isEmail = emailOrPhone.includes('@');
    const where = isEmail
      ? { email: emailOrPhone.toLowerCase() }
      : { phone: emailOrPhone };

    try {
      const user = await User.findOne({
        where,
        include: [{ model: Role, as: 'role', attributes: ['name'] }]
      });

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }
      if (user.role && user.role.name !== 'user') {
        return res.status(403).json({ success: false, message: 'Only users can sign in.' });
      }

      const match = bcrypt.compareSync(password, user.password);
      if (!match) {
        return res.status(401).json({ success: false, message: 'Invalid password.' });
      }

      // Generate & cache OTP
      const otp = generateOTP();
      const key = isEmail ? user.email : user.phone;
      saveOtp(key, otp);
      console.log(`Signin OTP for ${key}:`, otp);

      // Send OTP via Gmail transport
      if (isEmail) {
        await transport.sendMail({
          from: `<${process.env.GMAIL_USER}>`,
          to: user.email,
          subject: 'Your One-Time Login Verification Code',
          text: `Your OTP is ${otp}. It expires in 5 minutes.`,
          html: `<p>Your OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`
        });
      } else {
        // Send SMS OTP logic here (if you implement it later)
        console.log(`Would send SMS OTP to ${user.phone}: ${otp}`);
      }

      return res.status(200).json({
        success: true,
        message: 'OTP sent. Please check your email.',
        otp      // include for testing purposes
      });

    } catch (err) {
      console.error('Error in signin:', err);
      return res.status(500).json({ success: false, message: 'Server error.' });
    }
  }; //End Method



  verifySigninOtp = async (req, res) => {
    const { emailOrPhone, otp } = req.body;
    if (!emailOrPhone || !otp) {
      return res
        .status(400)
        .json({ success: false, message: 'Email/phone and OTP required.' });
    }

    const isEmail = emailOrPhone.includes('@');
    const key = isEmail
      ? emailOrPhone.toLowerCase()
      : emailOrPhone;

    const record = getOtpRecord(key);
    if (!record || record.otp !== otp) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid or expired OTP.' });
    }

    try {
      // Fetch the user one more time to build the token & response
      const user = await User.findOne({
        where: isEmail ? { email: key } : { phone: key },
        include: [{ model: Role, as: 'role', attributes: ['name'] }]
      });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: 'User not found.' });
      }

      // Create token
      const token = await createToken({ id: user.id, role: user.role.name });

      // Set cookie
      res.cookie('accessToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      // Cleanup OTP
      deleteOtp(key);

      // Respond with token & user info
      return res.json({
        success: true,
        message: 'Login successful.',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role.name
        }
      });

    } catch (err) {
      console.error('Error in verifySigninOtp:', err);
      return res.status(500).json({ success: false, message: 'Server error.' });
    }
  }; //End Method






  // THESE ARE THE FUNCTION OF LOGIN ADMIN FROM DASHBOARD

  admin_login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const admin = await User.findOne({
        where: { email },
        attributes: ['id', 'email', 'password', 'role_id'],
      });

      if (!admin) {
        return responseReturn(res, 404, { error: "Email not found" });
      }

      // Enforce that only users with role_id = 1 (admins) can proceed
      if (admin.role_id !== 1) {
        return responseReturn(res, 403, { error: "Not authorized as admin" });
      }

      const match = await bcrypt.compare(password, admin.password);
      if (!match) {
        return responseReturn(res, 401, { error: "Password incorrect" });
      }

      // At this point we know it’s an admin, so create the token
      const token = await createToken({
        id: admin.id,
        role_id: admin.role_id,
      });

      // Set it as a cookie
      res.cookie('accessToken', token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });

      return responseReturn(res, 200, { token, message: "Login Success" });
    } catch (error) {
      return responseReturn(res, 500, { error: error.message });
    }
  };
  // End Method 


  // GET USER DATA FROM NODE
  getUser = async (req, res) => {
    const { id, role_id } = req;

    try {
      if (role_id === 1) {
        const user = await User.findById(id)
        responseReturn(res, 200, { userInfo: user })
      } 

    } catch (error) {
      responseReturn(res, 500, { error: 'Internal Server Error' })
    }

  } // End getUser Method 

}

module.exports = new authController()