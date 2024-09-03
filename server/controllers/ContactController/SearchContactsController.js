import mongoose from 'mongoose';
import User from '../../models/UserModel.js';
import Message from '../../models/MessagesModel.js';

export const SearchContacts = async (req, res, next) => {
  try {
    const { searchTerm } = req.body;
    if (searchTerm === undefined || searchTerm === null) {
      return res.status(400).json({ msg: 'Search Term is required' });
    }
    const sanitizedSearchTerm = searchTerm.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&'
    );
    const regex = new RegExp(sanitizedSearchTerm, 'i');

    const contacts = await User.find({
      $and: [
        { _id: { $ne: req.userId } },
        {
          $or: [{ email: regex }, { fullName: regex }],
        },
      ],
    });
    return res.status(200).json({ contacts });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send('Internal Server Error!');
  }
};

// get contact list
export const getChatContactsList = async (req, res, next) => {
  try {
    // Extract the userId from the request and convert it to a MongoDB ObjectId
    let { userId } = req;
    userId = new mongoose.Types.ObjectId(userId);

    // Aggregate function to fetch chat contacts for the user
    const contacts = await Message.aggregate([
      {
        // Match messages where the user is either the sender or the recipient
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },
      {
        // Sort the messages by timestamp in descending order (most recent first)
        $sort: { timestamp: -1 },
      },
      {
        // Group messages by the contact person (the other party in the conversation)
        $group: {
          _id: {
            $cond: {
              // If the user is the sender, group by recipient; otherwise, group by sender
              if: { $eq: ['$sender', userId] },
              then: '$recipient',
              else: '$sender',
            },
          },
          // Store the timestamp of the most recent message in each group
          lastMessageTime: { $first: '$timestamp' },
          lastMessage: { $first: '$content' },
          messageType: { $first: '$messageType' },
        },
      },
      {
        // Perform a lookup to join the `users` collection and get contact details
        $lookup: {
          from: 'users',
          localField: '_id', // The contact's ID from the group stage
          foreignField: '_id', // The user's ID in the `users` collection
          as: 'contactInfo', // Store the result in `contactInfo`
        },
      },
      {
        // Unwind the `contactInfo` array to convert it into individual objects
        $unwind: '$contactInfo',
      },
      {
        // Select and project specific fields to include in the final output
        $project: {
          _id: 1, // Contact's ID
          lastMessageTime: 1, // Timestamp of the last message
          email: '$contactInfo.email', // Contact's email
          fullName: '$contactInfo.fullName', // Contact's full name
          image: '$contactInfo.image', // Contact's profile image
          color: '$contactInfo.color', // Contact's assigned color
          bio: '$contactInfo.bio',
          lastMessage: '$lastMessage',
          messageType: '$messageType',
        },
      },
      {
        // Sort the final list of contacts by last message time in descending order
        $sort: { lastMessageTime: -1 },
      },
    ]);

    // Send the contacts as a JSON response with a status of 200 (OK)
    return res.status(200).json({ contacts });
  } catch (err) {
    // If an error occurs, log the error message and return a 500 status (Internal Server Error)
    console.log(err.message);
    return res.status(500).send('Internal Server Error!');
  }
};

export const getAllContacts = async (req, res, next) => {
  try {
    const users = await User.find(
      { _id: { $ne: req.userId } },
      'fullName _id email'
    );

    const contacts = users.map((user) => ({
      label: user.fullName ? user.fullName : user.email,
      value: user._id,
    }));

    return res.status(200).json({ contacts });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send('Internal Server Error!');
  }
};

export const SearchGroupContacts = async (req, res, next) => {
  try {
    const { searchTerm } = req.body;
    if (searchTerm === undefined || searchTerm === null) {
      return res.status(400).json({ msg: 'Search Term is required' });
    }
    const sanitizedSearchTerm = searchTerm.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&'
    );
    const regex = new RegExp(sanitizedSearchTerm, 'i');

    const contacts = await User.find({
      $and: [
        { _id: { $ne: req.userId } },
        {
          $or: [{ fullName: regex }],
        },
      ],
    });
    const Groupcontacts = contacts.map((user) => ({
      label: user.fullName,
      value: user._id,
    }));

    return res.status(200).json({ Groupcontacts });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send('Internal Server Error!');
  }
};
