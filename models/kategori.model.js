const mongoose = require('mongoose');

const kategorySchema = mongoose.Schema({
    nama: {
        type: String,
        required: true
    },
    gambar: {
        type: String,
        required: true
    }
})

exports.Kategori = mongoose.model('KategoriProduk', kategorySchema);