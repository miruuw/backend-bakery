const mongoose = require('mongoose');

// deklarasi schema tujuanorder
const tujuanOrderSchema = mongoose.Schema({
    alamat: {
        type: String,
        require: true
    },
    telepon: {
        type: String,
        require: true
    }
})

tujuanOrderSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

tujuanOrderSchema.set('toJSON', {
    virtual: true
})

exports.TujuanOrder = mongoose.model('TujuanOrder', tujuanOrderSchema);