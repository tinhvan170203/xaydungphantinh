let mongoose = require('mongoose');
let image = mongoose.Schema({
    url: String,
    thutu: Number,
    public_id: String
});
const Image = mongoose.model('Image', image);
module.exports = Image;