const mongoose = require('mongoose');

// deklarasi schema database konfirmasi
const konfirmasiPembayaran = mongoose.Schema({
    asal_rekening: {
        type: String,
        require: true
    },
    tujuan_rekening: {
        type: String,
        require: true
    },
    jumlah_transfer: {
        type: Number,
        default: 0
    }
})

konfirmasiPembayaran.virtual('id').get(function(){
    return this._id.toHexString();
});

konfirmasiPembayaran.set('toJSON', {
    virtual: true
})

exports.KonfirmasiPembayaran = mongoose.model('KonfirmasiPembayaran', konfirmasiPembayaran);