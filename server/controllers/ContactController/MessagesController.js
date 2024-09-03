import Message from '../../models/MessagesModel.js';
import { mkdirSync, renameSync, rmdirSync, unlinkSync } from 'fs';
import path from 'path';
export const getMessages = async (req, res, next) => {
  try {
    const user1 = req.userId;
    const user2 = req.body.id;
    if (!user1 || !user2) {
      return res.status(400).json({ msg: "Both User ID's are requqired" });
    }

    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timestamp: 1 });

    return res.status(200).json({ messages });
  } catch (err) {
    console.log(err);
    return res.status(500).send('Internal Server Error!');
  }
};

export const uploadFile = async (req, res, next) => {
  try {
    console.log(req.file);

    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }
    const date = Date.now();
    let fileDir = `uploads/files/${date}`;
    let fileName = `${fileDir}/${req.file.originalname}`;
    mkdirSync(fileDir, { recursive: true });
    renameSync(req.file.path, fileName);
    return res.status(200).json({ filePath: fileName });
  } catch (err) {
    console.log(err);
    return res.status(500).send('Internal Server Error!');
  }
};

export const UnsendMessages = async (req, res, next) => {
  const { messageId } = req.params;
  const { userId } = req;
  try {
    // console.log(req);
    const message = await Message.findById(messageId);
    console.log(message);

    if (!message) {
      return res.status(400).json({ msg: 'Message not found' });
    }
    await Message.deleteOne({ _id: messageId });
    const Path = message.fileUrl;

    if (Path) {
      const parts = Path.split('/');
      const fileDir = `uploads/files/${parts[2]}`;
      const filePath = path.resolve(Path);
      unlinkSync(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        }
      });
      rmdirSync(fileDir);
    }
    return res.status(200).json({ msg: 'Message Unsend' });
  } catch (err) {
    console.log(err);
    return res.status(500).send('Internal Server Error!');
  }
};
