const express = require('express');
const router = express.Router();
const { Kategori } = require('../models/kategori.model');
const { Produk } =require('../models/produk.model');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      const isValid = FILE_TYPE_MAP[file.mimetype];
      let uploadError = new Error('Tipe Gambar tidak valid!');

      if (isValid) {
          uploadError = null
      }
      cb(uploadError, 'asset/categories')
  },
  filename: function (req, file, cb) {
      const fileName = file.originalname.split(' ').join('-');
      const extenstion = FILE_TYPE_MAP[file.mimetype];
      cb(null, `${fileName}`)
      // dengan filename asli tidak di hash / tambah char
  }
})

const upload = multer({ storage: storage })

router.get('/', async (req, res) => {
  const kategoriList = await Kategori.find();

  if (!kategoriList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(kategoriList);
})

router.get('/:id', async (req, res) => {
  const kategori = await Kategori.findById(req.params.id);

  if (!kategori) {
    res.status(500).json({ message: "Kategori dengan ID yang diberikan tidak ditemukan!" });
  }
  res.status(200).send(kategori);
})

router.post('/', upload.single('gambar'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).send('Tidak ada gambar/image di dalam request!');

    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/asset/categories/`;

    const kategoriBaru = new Kategori({
     nama : req.body.nama,
     gambar :  `${basePath}${fileName}`
    });

    const kategori = await kategoriBaru.save();
    res.status(201).json(kategori);
  } catch (error) {
    res.status(500).json({ error: 'Kesalahan saat membuat kategori baru' });
  }
});

router.patch('/:id', upload.single('gambar'), async (req, res) => {
  try {
    const kategori = await Kategori.findById(req.params.id);
    if (!kategori) {
      return res.status(404).json({ error: 'Kategori tidak ditemukan' });
    }

    kategori.nama = req.body.nama;

    if (req.file) {
      const basePath = `${req.protocol}://${req.get('host')}/asset/categories/`;
      const oldImagePath = `asset/categories/${kategori.gambar}`;

      // Hapus gambar lama jika ada
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      // Simpan gambar baru
      kategori.gambar = `${basePath}${req.file.filename}`;
    }

    const updatedKategori = await kategori.save();
    res.status(200).json(updatedKategori);
  } catch (error) {
    res.status(500).json({ error: 'Kesalahan saat mengubah kategori' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const kategori = await Kategori.findById(req.params.id);
    if (!kategori) {
      return res.status(404).json({ error: 'Kategori tidak ditemukan' });
    }

    if (kategori.gambar) {
      const imagePath = path.resolve(__dirname, '..', kategori.gambar);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log('File gambar berhasil dihapus:', imagePath);
      } else {
        console.log('File gambar tidak ditemukan:', imagePath);
      }
    }

    await Produk.deleteMany({ kategori: req.params.id });
    await Kategori.findByIdAndRemove(req.params.id);

    res.status(200).json({ message: 'Kategori berhasil dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Kesalahan saat menghapus kategori' });
  }
});


module.exports = router;