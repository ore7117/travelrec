const mongoose = require('mongoose');
const argon2 = require('argon2');

// Define the User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  vacationType: {
    type: String,
    enum: ['Solo', 'Partner', 'Family'],
    default: 'Solo',
  },
  partnerInfo: {
    name: String,
    age: Number,
    travelPreferences: String,
  },
  kidsInfo: [
    {
      name: String,
      age: Number,
      interests: String,
    }
  ],
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to hash the password before saving the user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    this.password = await argon2.hash(this.password, { type: argon2.argon2id });
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return argon2.verify(this.password, candidatePassword);
};

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
