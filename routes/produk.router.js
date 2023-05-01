const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { Produk } = require('../models/produk.model');
const { Kategori } = require('../models/kategori.model');

router.get(`/`, async (req, res) => {
    // exp : localhost:8080/bc-bakery/v1/produk
    let filter = {};
    if(req.query.kategories){
        filter = {kategori: req.kategories.split(',')}
    }

    const produkList = await Produk.find().populate('kategori');

    if(!produkList){
        res.status(500).json({success: false});
    }
    res.send(produkList);
    
})

router.post(`/:id`, async (req, res) => {
    const produk = await Produk.findById(req.params.id);

    if (!produk) {
        res.status(500).json({success: false});
    }
    res.send(produk);
})

router.post(`/`, async (req, res) => {
    const kategori = await Kategori.findById(req.body.kategori);
    if(!kategori) return res.status(400).send('Kategori tidak valid!');

    const produk = new Produk({
        nama: req.body.nama,
        harga: req.body.harga,
        kategori: req.body.kategori
    })

    produk = await produk.save();

    if(!produk)
        return res.status(500).send('Produk tidak dapat dibuat!');

    res.send(produk);

})

module.exports = router; 