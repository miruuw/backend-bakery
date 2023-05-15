const mongoose = require('mongoose');

// deklarasi schema database produk
const penggunaSchema = mongoose.Schema({
    nama: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    kataSandi: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    dibuatPada: {
        type: Date,
        default: Date.now
    }
})

exports.Pengguna = mongoose.model('Pengguna', penggunaSchema);