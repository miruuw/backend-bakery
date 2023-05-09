const mongoose = require('mongoose');

// deklarasi detail order
const detailOrderSchema = mongoose.Schema({
    jumlah_beli: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    subtotal: {
        type: Number,
        required: true
    }
})

detailOrderSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

detailOrderSchema.set('toJSON', {
    virtual: true
})

exports.DetailOrder = mongoose.model('DetailOrder', detailOrderSchema);