import User from '../../models/UserModel.js';

export const getUserInfo = async (req, res, next) => {
  try {
    // console.log(req.userId);
    const userData = await User.findById(req.userId);
    if (!userData) {
      return res.status(404).send('User with the given id not found.');
    }
    return res.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      bio: userData.bio,
      image: userData.image,
      color: userData.color,
      fullName: userData.fullName,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send('Internal Server Error!');
  }
};
