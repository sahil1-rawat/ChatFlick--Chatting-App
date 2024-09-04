import mongoose from 'mongoose';
import Group from '../models/GroupModel.js';
import User from '../models/UserModel.js';

export const createGroup = async (req, res, next) => {
  try {
    const { name, members, description } = req.body;
    const userId = req.userId;

    // Find the admin user
    const admin = await User.findById(userId);
    if (!admin) {
      return res.status(400).send('Admin User not found');
    }

    // Ensure admin is included in the members list
    if (!members.includes(userId)) {
      members.push(userId);
    }

    // Validate all members
    const validMembers = await User.find({ _id: { $in: members } });
    const validMemberIds = validMembers.map((member) => member._id.toString());

    // Find invalid members
    const invalidMembers = members.filter(
      (member) => !validMemberIds.includes(member)
    );

    if (invalidMembers.length > 0) {
      return res.status(400).json({
        message: 'Some members are not valid users.',
        invalidMembers,
      });
    }

    // Create a new group
    const newGroup = new Group({
      name,
      description,
      members: validMemberIds, // use the validated members list
      admin: userId,
    });

    // Save the group to the database
    await newGroup.save();

    return res.status(201).json({ group: newGroup });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send('Internal Server Error!');
  }
};

export const getUserGroup = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);

    // Find groups where the user is either the admin or a member
    const groups = await Group.find({
      $or: [{ admin: userId }, { members: userId }],
    })
      .populate('members', 'fullName image color') // Populating the members to get their names
      .populate('admin', 'fullName image color') // Populating the admin to get their name
      .sort({ updatedAt: -1 });

    return res.status(200).json({ groups });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Internal Server Error!');
  }
};
export const getGroupMessages = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId).populate({
      path: 'messages',
      populate: {
        path: 'sender',
        select: 'fullName email _id image color bio',
      },
    });

    if (!group) {
      return res.status(404).send('Group not found!');
    }
    const messages = group.messages;
    console.log(messages);

    return res.status(201).json({ messages });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Internal Server Error!');
  }
};

export const editGroupInfo = async (req, res) => {
  const { groupId } = req.params;

  const { name, description } = req.body;
  console.log(name);

  try {
    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      { name, description },
      { new: true }
    );

    if (!updatedGroup) {
      return res.status(404).json({ message: 'Group not found' });
    }

    return res.status(200).json(updatedGroup);
  } catch (error) {
    res.status(500).json({ message: 'Error updating group info', error });
  }
};
