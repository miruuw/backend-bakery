const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Pembeli } = require('../models/pembeli.model');

router.post(`/`, async (req, res) => {
    let pembeli = new Pembeli({
        nama: req.body.nama,
        alamat: req.body.alamat,
        telepon: req.body.telepon,
        username: req.body.username,
        passwordHash: bcrypt.hashSync(req.body.password, 10)
    })

    pembeli = await pembeli.save();

    if(!pembeli)
        return res.status(404).send('pengguna tidak dapat dibuat')

        res.send(pembeli);
})

router.get('/', async (req, res) => {
    const pembeliList = await Pembeli.find().select('-passwordHash');

    if(!pembeliList) {
        res.status(500).json({success: false});
    }
    res.send(pembeliList);
})

module.exports = router;