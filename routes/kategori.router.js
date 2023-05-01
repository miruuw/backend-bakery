const express = require('express');
const router = express.Router();
const { Kategori } = require('../models/kategori.model'); 

router.get('/', async (req, res) => {
    const kategoriList = await Kategori.find();

    if(!kategoriList) {
        res.status(500).json({success: false});
    }
    res.status(200).send(kategoriList);
})

router.get('/:id', async (req, res) => {
    const kategori = await Kategori.findById(req.params.id);

    if(!kategori) {
        res.status(500).json({message: "Kategori dengan ID yang diberikan tidak ditemukan!"});
    }
    res.status(200).send(kategori);
})

router.post('/', async (req, res) => {
    let kategori = new Kategori({
        nama: req.body.nama
    })
    kategori = await kategori.save();

    if(!kategori)
        return res.status(404).send('Kategori tidak dapat dibuat!');
    
        res.send(kategori);
})



module.exports = router;