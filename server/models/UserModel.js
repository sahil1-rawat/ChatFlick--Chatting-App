import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is Required'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is Required'],
  },
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  bio: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  color: {
    type: Number,
    required: false,
  },
  profileSetup: {
    type: Boolean,
    required: false,
  },
  fullName: {
    type: String,
  },
});

// Pre-save middleware to hash the password before saving it to the database
userSchema.pre('save', async function (next) {
  if (this.isModified('password' || this.isNew)) {
    const salt = await bcrypt.genSalt(); //generate a salt
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});
const User = mongoose.model('User', userSchema);

export default User;
