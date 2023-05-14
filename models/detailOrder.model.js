const mongoose = require('mongoose');

// deklarasi detail order
const detailOrderSchema = mongoose.Schema({
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    item: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})

detailOrderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

detailOrderSchema.set('toJSON', {
    virtual: true
})

exports.DetailOrder = mongoose.model('DetailOrder', detailOrderSchema);