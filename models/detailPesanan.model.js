const mongoose = require('mongoose');

// deklarasi detail order
const detailOrderSchema = mongoose.Schema({
    pesananItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PesananItem',
        required: true
    },
    alamatPengiriman1: {
        type: String,
        required: true
    },
    alamatPengiriman2: {
        type: String,
        required: false
    },
    telepon: {
        type: String,
        required: true
    },
    kota: {
        type: String,
        required: true
    },
    status: {
        type: String,
        // enum: ['tertunda', 'dikirim', 'terkirim'],
        default: 'tertunda'
    },
    totalPrice: {
        type: Number,
        default: 0
    },
    pengguna: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pengguna',
    },
    dibuatPada: {
        type: Date,
        default: Date.now
    }
})


exports.DetailPesanan = mongoose.model('DetailPesanan', detailOrderSchema);