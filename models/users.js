'use strict';
const mongoose = require('mongoose');
const bcrypt = require ('bcryptjs');

mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
  FirstName: {type: String, required: true},
  LastName: {type: String, required: true},
  EmailAddress: {type: String, required: true},
  username: {type: String,required: true},
  password: {type: String,required: true},
  numRoomates: {type: String, required: true},
  budget: {type: String, required: true},
  culture: {type: String, required: true},
});

// userSchema.virtual('fullName').get(function() {
//   return `${this.FirstName} ${this.LastName}`.trim()});
userSchema.virtual('usernameTrimmed').get(function() {
  return `${this.username}`.trim()});

userSchema.methods.serialize = function() {
  return {
    id: this._id,
    username: this.usernameTrimmed,
    EmailAddress: this.EmailAddress,
    FirstName: this.FirstName,
    LastName: this.LastName,
    numRoomates: this.numRoomates,
    budget: this.budget,
    culture: this.culture,
  };
}

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, 10);
};
// note that all instance methods and virtual properties on our
// schema must be defined *before* we make the call to `.model`.
const User = mongoose.model('User', userSchema);
module.exports = {User};