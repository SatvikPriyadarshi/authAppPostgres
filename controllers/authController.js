const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const userModel = require('../models/userModel');

const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET;
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
const RECAPTCHA_SITE_KEY = process.env.RECAPTCHA_SITE_KEY;


const showRegister = (req, res) => {
  res.render('register', {
    error: null,
    success: null,
    formData: {},
    siteKey: RECAPTCHA_SITE_KEY,
  });
};


const showLogin = (req, res) => {
  res.render('login', {
    error: null,
    siteKey: RECAPTCHA_SITE_KEY,
  });
};

const registerUser = async (req, res) => {
  const { username, email, password, 'g-recaptcha-response': recaptchaToken } = req.body;
  const formData = { username, email };

  console.log('\n--- REGISTER USER ---');
  console.log('RECAPTCHA_SECRET_KEY:', RECAPTCHA_SECRET_KEY);
  console.log('Received g-recaptcha-response:', recaptchaToken);

  if (!username || !email || !password || !recaptchaToken) {
    return res.render('register', {
      error: 'All fields and reCAPTCHA are required.',
      success: null,
      formData,
      siteKey: RECAPTCHA_SITE_KEY,
    });
  }

  try {
    const query = `secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`;
    console.log('Sending to Google reCAPTCHA:', query);

    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: query,
    });

    const data = await response.json();
    console.log('Google reCAPTCHA Response:', data);

    if (!data.success) {
      return res.render('register', {
        error: 'Invalid reCAPTCHA. Please try again.',
        success: null,
        formData,
        siteKey: RECAPTCHA_SITE_KEY,
      });
    }
  } catch (error) {
    console.error('Error during reCAPTCHA verification:', error);
    return res.render('register', {
      error: 'Error verifying reCAPTCHA.',
      success: null,
      formData,
      siteKey: RECAPTCHA_SITE_KEY,
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.render('register', {
      error: 'Invalid email format.',
      success: null,
      formData,
      siteKey: RECAPTCHA_SITE_KEY,
    });
  }

  if (password.length < 8) {
    return res.render('register', {
      error: 'Password must be at least 8 characters.',
      success: null,
      formData,
      siteKey: RECAPTCHA_SITE_KEY,
    });
  }

  try {
    if (await userModel.checkUsernameExists(username)) {
      return res.render('register', {
        error: 'Username already exists.',
        success: null,
        formData,
        siteKey: RECAPTCHA_SITE_KEY,
      });
    }

    if (await userModel.checkEmailExists(email)) {
      return res.render('register', {
        error: 'Email already registered.',
        success: null,
        formData,
        siteKey: RECAPTCHA_SITE_KEY,
      });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await userModel.createUser(username, email, hashedPassword);

    return res.render('register', {
      error: null,
      success: 'Registration successful! Please login.',
      formData: {},
      siteKey: RECAPTCHA_SITE_KEY,
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.render('register', {
      error: 'Server error. Please try again later.',
      success: null,
      formData,
      siteKey: RECAPTCHA_SITE_KEY,
    });
  }
};

const loginUser = async (req, res) => {
  const { identifier, password, 'g-recaptcha-response': recaptchaToken } = req.body;

  console.log('\n--- LOGIN USER ---');
  console.log('RECAPTCHA_SECRET_KEY:', RECAPTCHA_SECRET_KEY);
  console.log('Received g-recaptcha-response:', recaptchaToken);

  if (!identifier || !password || !recaptchaToken) {
    return res.render('login', {
      error: 'All fields and reCAPTCHA are required.',
      siteKey: RECAPTCHA_SITE_KEY,
    });
  }

  try {
    const query = `secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`;
    console.log('Sending to Google reCAPTCHA:', query);

    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: query,
    });

    const data = await response.json();
    console.log('Google reCAPTCHA Response:', data);

    if (!data.success) {
      return res.render('login', {
        error: 'Invalid reCAPTCHA. Please try again.',
        siteKey: RECAPTCHA_SITE_KEY,
      });
    }
  } catch (err) {
    console.error('Error during reCAPTCHA verification:', err);
    return res.render('login', {
      error: 'Error verifying reCAPTCHA.',
      siteKey: RECAPTCHA_SITE_KEY,
    });
  }

  try {
    const user = await userModel.getUserByUsernameOrEmail(identifier);
    if (!user) {
      return res.render('login', {
        error: 'Invalid username/email or password.',
        siteKey: RECAPTCHA_SITE_KEY,
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.render('login', {
        error: 'Invalid username/email or password.',
        siteKey: RECAPTCHA_SITE_KEY,
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: true, 
      maxAge: 15 * 60 * 1000,
    });

    res.redirect('/profile');
  } catch (error) {
    console.error('Login error:', error);
    res.render('login', {
      error: 'Server error. Please try again later.',
      siteKey: RECAPTCHA_SITE_KEY,
    });
  }
};


const logoutUser = (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
};

module.exports = {
  showRegister,
  registerUser,
  showLogin,
  loginUser,
  logoutUser,
};
