const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

let UserSchema = new Schema({
  username: {type: String, required: true},
  email: {type: String, required: true},
  user_type: {type: String, required: true},
  password: {type: String, required: true},
});

UserSchema.methods.encrypt_password = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5));
};

UserSchema.methods.compare_password = function(password) {
  return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);

