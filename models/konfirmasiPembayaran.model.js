const mongoose = require('mongoose');

// deklarasi schema database konfirmasi
const konfirmasiPembayaran = mongoose.Schema({
    pesanan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DetailPesanan',
        required: true
    },
    metodePembayaran: {
        type: String,
        required: true,
        enum: ['Transfer Bank', 'OVO', 'GoPay', 'Dana']
    },
    nomorRekening: {
        type: String,
        required: true
    },
    buktiPembayaran: {
        type: String,
        required: true
    },
    tanggalPembayaran: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        required: true,
        enum: ['Menunggu Konfirmasi', 'Dikonfirmasi', 'Ditolak']
    }
})


exports.KonfirmasiPembayaran = mongoose.model('KonfirmasiPembayaran', konfirmasiPembayaran);