const mongoose = require('mongoose');

// deklarasi schema database produk
const produkSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

produkSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

produkSchema.set('toJSON', {
    virtual: true
})

exports.Produk = mongoose.model('Produk', produkSchema);