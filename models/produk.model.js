const mongoose = require('mongoose');

// deklarasi schema database produk
const produkSchema = mongoose.Schema({
    nama: {
        type: String,
        require: true
    },
    harga: {
        type: Number,
        default: 0
    },
    kategori: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Kategori',
        require: true
    }
})

produkSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

produkSchema.set('toJSON', {
    virtual: true
})

exports.Produk = mongoose.model('Produk', produkSchema);