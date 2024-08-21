import { log } from 'console';
import User from '../../models/UserModel.js';
import { mkdirSync, readdirSync, renameSync, rmdirSync, unlinkSync } from 'fs';

// Update name and color in your profile
export const updateProfile = async (req, res, next) => {
  try {
    // console.log(req.userId);
    const { userId } = req;
    const { firstName, lastName, color, bio } = req.body;
    if (!firstName && !lastName) {
      return res.status(404).send('Your name cannot be empty');
    }
    let fullName = `${firstName} ${lastName}`;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        color,
        bio,
        fullName,
        profileSetup: true,
      },
      { new: true, runValidators: true }
    );
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

// Add Image in your Profile
export const addProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send('File is required');
    }

    const { userId } = req;

    const date = Date.now();
    const user = await User.findById(userId);
    const Dir = user.email.split('@').shift();
    let fileDir = `uploads/profiles/${Dir}`;
    let fileName = `${fileDir}/${req.file.originalname}`;
    if (user.image) {
      unlinkSync(user.image);
    }

    mkdirSync(fileDir, { recursive: true });
    renameSync(req.file.path, fileName);
    // renameSync(req.file.path, fileName);
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { image: fileName },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      image: updatedUser.image,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send('Internal Server Error!');
  }
};

// Remove Image from your Profile
export const removeProfileImage = async (req, res, next) => {
  try {
    // console.log(req.userId);
    const { userId } = req;

    const user = await User.findById(userId);
    const Dir = user.email.split('@').shift();
    let fileDir = `uploads/profiles/${Dir}`;
    if (!user) {
      return res.status(404).findById(userId);
    }
    if (user.image) {
      unlinkSync(user.image);
      rmdirSync(fileDir);
    }
    user.image = null;
    await user.save();
    return res.status(200).send('Profile Image removed Successfully');
  } catch (err) {
    console.log(err.message);
    return res.status(500).send('Internal Server Error!');
  }
};
