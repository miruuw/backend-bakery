const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const multer = require('multer');
const { Produk } = require('../models/produk.model');
const { Kategori } = require('../models/kategori.model');


const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null
        }
        cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extenstion = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extenstion}`)
    }
})

const uploadOptions = multer({ storage: storage })

router.get(`/`, async (req, res) => {
    // exp : localhost:8080/bc-bakery/v1/produk
    let filter = {};
    if (req.query.kategories) {
        filter = { kategori: req.kategories.split(',') }
    }

    const produkList = await Produk.find().populate('kategori');

    if (!produkList) {
        res.status(500).json({ success: false });
    }
    res.send(produkList);

})

router.get(`/:id`, async (req, res) => {
    const produk = await Produk.findById(req.params.id);

    if (!produk) {
        res.status(500).json({ success: false });
    }
    res.send(produk);
})

router.post(`/`, uploadOptions.single('gambar'), async (req, res) => {
    const kategori = await Kategori.findById(req.body.kategori);
    if (!kategori) return res.status(400).send('Kategori tidak valid!');

    const file = req.file;
    if (!file) return res.status(400).send('Tidak ada gambar/image di dalam request!');

    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/upload/`;

    const produk = new Produk({
        nama: req.body.nama,
        harga: req.body.harga,
        deskripsi: req.body.deskripsi,
        gambar: `${basePath}${fileName}`,
        kategori: req.body.kategori,
    });

    produk = await produk.save();

    if (!produk)
        return res.status(500).send('Produk tidak dapat dibuat!');

    res.send(produk);

})

router.put('/:id', uploadOptions.single('gambar'), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('ID Produk tidak valid!');
        return;
    }

    const kategori = await Kategori.findById(req.body.kategori);
    if (!kategori) {
        res.status(400).send('Kategori tidak valid!');
        return;
    }

    const file = req.file;
    const fileName = file ? req.file.filename : null;
    const basePath = `${req.protocol}://${req.get('host')}/public/upload/`;

    const produk = await Produk.findByIdAndUpdate(
        req.params.id,
        {
            nama: req.body.nama,
            harga: req.body.harga,
            deskripsi: req.body.deskripsi,
            gambar: file ? `${basePath}${fileName}` : req.body.gambar,
            kategori: req.body.kategori
        },
        { new: true }
    );

    if (!produk) {
        res.status(400).send('Produk tidak dapat diperbarui!');
        return;
    }

    res.send(produk);
});

router.delete('/:id', (req, res) => {
    Produk.findByIdAndRemove(req.params.id).then(produk => {
        if (produk) {
            return res.status(200).json({ success: true, message: 'produk berhasil dihapus!' })
        } else {
            return res.status(404).json({ success: true, message: 'produk tidak ada!' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, error: err })
    })
})

module.exports = router; 