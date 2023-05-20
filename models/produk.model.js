const mongoose = require('mongoose');

// deklarasi schema database produk
const produkSchema = mongoose.Schema({
    nama: {
        type: String,
        required: true
    },
    harga: {
        type: Number,
        required: true
    },
    stok: {
        type: Number,
        required: true
    },
    deskripsi: {
        type: String,
        required: true
    },
    gambar: {
        type: String,
        required: true
    },
    kategori: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'KategoriProduk', 
        required: true
    },
    dibuatPada: {
        type: Date,
        default: Date.now
    }
})


exports.Produk = mongoose.model('Produk', produkSchema);