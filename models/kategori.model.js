const mongoose = require('mongoose');

const kategorySchema = mongoose.Schema({
    nama: {
        type: String,
        required: true
    },
    deskripsi: {
        type: String,
        required: true
    }
})

exports.Kategori = mongoose.model('KategoriProduk', kategorySchema);