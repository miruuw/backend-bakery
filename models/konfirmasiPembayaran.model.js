const mongoose = require('mongoose');

// deklarasi schema database konfirmasi
const konfirmasiPembayaran = mongoose.Schema({
    pesanan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DetailPesanan',
        required: true
    },
    asalRekening: {
        type: String,
        required: true
    },
    tujuanRekening: {
        type: String,
        required: true
    },
    tanggalPembayaran: {
        type: Date,
        required: true
    },
    jumlah: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['tertunda', 'dikonfirmasi'],
        default: 'tertunda'
    }
})


exports.KonfirmasiPembayaran = mongoose.model('KonfirmasiPembayaran', konfirmasiPembayaran);