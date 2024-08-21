import { createToken, maxAge } from '../../Extra/extra.js';
import User from '../../models/UserModel.js';
import validator from 'validator';

const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send('Email and Password is required');
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ msg: 'Invalid Email' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    const user = await User.create({ email, password });

    res.cookie('jwt', createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: 'None',
    });
    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email.toLowerCase(),
        profileSetup: user.profileSetup,
      },
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send('Internal Server Error!');
  }
};

export default signup;
