let mongoose = require('mongoose');
let user = mongoose.Schema({
    user: String,
    password: String
});
const User = mongoose.model('User', user);
module.exports = User;