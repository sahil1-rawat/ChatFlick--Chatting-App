import { createToken, maxAge } from '../../Extra/extra.js';
import User from '../../models/UserModel.js';
import bcrypt from 'bcrypt';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: 'Email and Password is required!' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        msg: 'Invalid credentials.',
      });
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.status(404).json({ msg: 'Invalid credentials.' });
    }
    res.cookie('jwt', createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: 'None',
    });
    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio,
        image: user.image,
        color: user.color,
        fullName: user.fullName,
      },
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send('Internal Server Error!');
  }
};
