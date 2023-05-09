const mongoose = require('mongoose');

// deklarasi schema database produk
const pembeliSchema = mongoose.Schema({
    nama: {
        type: String,
        require: true
    },
    alamat: {
        type: String,
        default: ""
    },
    telepon: {
        type: String,
        default: ""
    },
    username: {
        type: String,
        require: true
    },
    passwordHash: {
        type: String,
        required: true
    }
})

pembeliSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

pembeliSchema.set('toJSON', {
    virtual: true
})

exports.Pembeli = mongoose.model('Pembeli', pembeliSchema);