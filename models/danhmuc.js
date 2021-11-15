let mongoose = require('mongoose');
let danhmuc = mongoose.Schema({
    danhmuc: String,
    thutu: Number
});
const Danhmuc = mongoose.model('Danhmuc', danhmuc);
module.exports = Danhmuc;