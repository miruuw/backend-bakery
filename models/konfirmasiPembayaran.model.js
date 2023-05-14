const mongoose = require('mongoose');

// deklarasi schema database konfirmasi
const konfirmasiPembayaran = mongoose.Schema({
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['credit card', 'paypal', 'bank transfer'],
        required: true
    },
    paymentDate: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed'],
        default: 'pending'
    }
})

konfirmasiPembayaran.virtual('id').get(function () {
    return this._id.toHexString();
});

konfirmasiPembayaran.set('toJSON', {
    virtual: true
})

exports.KonfirmasiPembayaran = mongoose.model('KonfirmasiPembayaran', konfirmasiPembayaran);