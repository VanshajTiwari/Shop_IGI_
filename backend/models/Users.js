const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Minimum password length is 6 characters'],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  username: {
    type: String,
    required: [true, 'Please enter a username'],
    unique: false,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  phoneNumber: {
    numberType:{
      type:String,
      enum:["mobile","phone"],
      default:"mobile"
    },
    countryCode:String,
    number:Number,

  },
  // orders: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Order',
  //   },
  // ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.post('save', function (doc, next) {
  console.log('new user was created', doc);
  next();
})

userSchema.pre('save',async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  // console.log('user about to created', this);
  next();
})

userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
};

const User = mongoose.model('User', userSchema);

module.exports = User;