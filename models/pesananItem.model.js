const mongoose = require('mongoose');

// deklarasi schema database order
const orderSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Produk'
    },
    kuantitas: {
        type: Number,
        required: true
    },
   
})


exports.PesananItem = mongoose.model('PesananItem', orderSchema);
