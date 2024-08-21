import { maxAge } from '../../Extra/extra.js';

export const logout = async (req, res, next) => {
  try {
    res.cookie('jwt', '', { maxAge: 1, secure: true, sameSite: 'None' });
    return res.status(200).send('Log Out Success');
  } catch (err) {
    console.log(err.message);
    return res.status(500).send('Internal Server Error!');
  }
};
