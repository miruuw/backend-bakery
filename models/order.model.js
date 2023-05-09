const mongoose = require('mongoose');

// deklarasi schema database order
const orderSchema = mongoose.Schema({
    tanggal_beli: {
        type: Date,
        default: Date.now,
    },
    jumlah_beli: {
        type: Number,
        require: trues
    }
})

orderSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

orderSchema.set('toJSON', {
    virtual: true
})

exports.Order = mongoose.model('Order', orderSchema);
