const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const { Pengguna } = require('../models/pengguna.model');

router.get('/', async (req, res) => {
    const penggunaList = await Pengguna.find()

    if (!penggunaList) {
        res.status(500).json({ success: false });
    }
    res.send(penggunaList);
})

router.get('/:id', async (req, res) => {
    const pengguna = await Pengguna.findById(req.params.id)

    if (!pengguna) {
        res.status(500).json({ message: "pengguna dengan ID yang diberikan tidak ditemukan!" })
    }

    res.status(200).send(pengguna);
})

router.post('/', async (req, res) => {
    try {
        const { nama, email, kataSandi, isAdmin } = req.body;
    
        // Menghash kata sandi menggunakan bcrypt
        const hashedKataSandi = await bcrypt.hash(kataSandi, 10);
    
        // Membuat objek pengguna baru
        const pengguna = new Pengguna({
          nama,
          email,
          kataSandi: hashedKataSandi,
          isAdmin,
        });
    
        // Menyimpan pengguna ke dalam database
        await pengguna.save();
    
        res.status(201).json({ message: 'Pengguna berhasil dibuat' });
      } catch (error) {
        res.status(500).json({ error: 'Gagal membuat pengguna' });
      }
})

router.delete('/:id', (req, res) => {
    Pengguna.findByIdAndRemove(req.params.id).then(pengguna => {
        if (pengguna) {
            return res.status(200).json({ success: true, message: 'user berhasil dihapus!' })
        } else {
            return res.status(404).json({ success: true, message: 'user tidak ada!' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, error: err })
    })
})

router.post('/daftar', async (req, res) => {
    try {
        const { nama, email, kataSandi, isAdmin } = req.body;
    
        // Mengecek apakah pengguna dengan email yang sama sudah terdaftar
        const existingUser = await Pengguna.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ error: 'Pengguna dengan email tersebut sudah terdaftar' });
        }
    
        // Menghash kata sandi menggunakan bcrypt
        const hashedKataSandi = await bcrypt.hash(kataSandi, 10);
    
        // Membuat objek pengguna baru
        const pengguna = new Pengguna({
          nama,
          email,
          kataSandi: hashedKataSandi,
          isAdmin,
        });
    
        // Menyimpan pengguna ke dalam database
        await pengguna.save();
    
        res.status(201).json({ message: 'Pengguna berhasil didaftarkan' });
      } catch (error) {
        res.status(500).json({ error: 'Gagal mendaftarkan pengguna' });
      }
});

router.post('/masuk', async (req, res) => {
    try {
        const { email, kataSandi } = req.body;
    
        // Mencari pengguna berdasarkan email
        const pengguna = await Pengguna.findOne({ email });
        if (!pengguna) {
          return res.status(404).json({ error: 'Pengguna dengan email tersebut tidak ditemukan' });
        }
    
        // Membandingkan kata sandi yang diinputkan dengan kata sandi yang di-hash dalam database
        const isPasswordMatch = await bcrypt.compare(kataSandi, pengguna.kataSandi);
        if (!isPasswordMatch) {
          return res.status(401).json({ error: 'Kombinasi email dan kata sandi tidak valid' });
        }
    
        res.status(200).json({ message: 'Login berhasil' });
      } catch (error) {
        res.status(500).json({ error: 'Gagal melakukan login' });
      }
});


module.exports = router;