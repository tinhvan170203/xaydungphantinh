let mongoose = require('mongoose');
let baidang = mongoose.Schema({
    title: String,
    minhhoa: String,
    trichyeu: String,
    danhmuc: {
        type: mongoose.Types.ObjectId,
        ref: 'Danhmuc'
    },
    thutu: Number,
    created_at: String,
    content: String,
    hot: String
});
const Baidang = mongoose.model('Baidang', baidang);
module.exports = Baidang;