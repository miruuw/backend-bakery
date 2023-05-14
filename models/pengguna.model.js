const mongoose = require('mongoose');

// deklarasi schema database produk
const pembeliSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

pembeliSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

pembeliSchema.set('toJSON', {
    virtual: true
})

exports.Pembeli = mongoose.model('Pembeli', pembeliSchema);