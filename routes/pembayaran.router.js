const express = require('express');
const router = express.Router();
const { KonfirmasiPembayaran } = require('../models/konfirmasiPembayaran.model');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'asset/payments');
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(' ').join('-');
    cb(null, `${fileName}-${Date.now()}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post('/', upload.single('buktiPembayaran'), async (req, res) => {
  try {
    const { pesanan, metodePembayaran, nomorRekening, status } = req.body;
    const buktiPembayaran = req.file.path;

    const konfirmasiPembayaran = new KonfirmasiPembayaran({
      pesanan,
      metodePembayaran,
      nomorRekening,
      buktiPembayaran,
      status,
    });

    const savedKonfirmasiPembayaran = await konfirmasiPembayaran.save();
    res.send(savedKonfirmasiPembayaran);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


// router.post('/', async (req, res) => {
//   try {
//     const { pesanan, asalRekening, tujuanRekening, tanggalPembayaran, jumlah, status } = req.body;

//     // Membuat objek konfirmasi pembayaran baru
//     const konfirmasi = new KonfirmasiPembayaran({
//       pesanan,
//       asalRekening,
//       tujuanRekening,
//       tanggalPembayaran,
//       jumlah,
//       status,
//     });

//     // Menyimpan konfirmasi pembayaran ke dalam database
//     await konfirmasi.save();

//     res.status(201).json({ message: 'Konfirmasi pembayaran berhasil dibuat' });
//   } catch (error) {
//     res.status(500).json({ error: 'Gagal membuat konfirmasi pembayaran' });
//   }
// });

router.get('/', async (req, res) => {
  try {
    const konfirmasi = await KonfirmasiPembayaran.find().populate('pesanan');
    res.status(200).json(konfirmasi);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mendapatkan konfirmasi pembayaran' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const konfirmasi = await KonfirmasiPembayaran.findById(id);
    if (!konfirmasi) {
      return res.status(404).json({ error: 'Konfirmasi pembayaran tidak ditemukan' });
    }
    res.status(200).json(konfirmasi);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mendapatkan konfirmasi pembayaran' });
  }
});

router.put('/:id', upload.single('buktiPembayaran'), async (req, res) => {
  try {
    const { pesanan, metodePembayaran, nomorRekening, status } = req.body;
    let updateData = {
      pesanan,
      metodePembayaran,
      nomorRekening,
      status,
    };

    if (req.file) {
      const oldKonfirmasiPembayaran = await KonfirmasiPembayaran.findById(req.params.id);
      fs.unlinkSync(oldKonfirmasiPembayaran.buktiPembayaran);
      updateData.buktiPembayaran = req.file.path;
    }

    const updatedKonfirmasiPembayaran = await KonfirmasiPembayaran.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedKonfirmasiPembayaran) {
      return res.status(404).json({ success: false, error: 'Konfirmasi pembayaran tidak ditemukan!' });
    }

    res.send(updatedKonfirmasiPembayaran);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH - Memperbarui sebagian konfirmasi pembayaran
router.patch('/:id', upload.single('buktiPembayaran'), async (req, res) => {
  try {
    const { pesanan, metodePembayaran, nomorRekening, status } = req.body;
    let updateData = {};

    if (req.file) {
      const oldKonfirmasiPembayaran = await KonfirmasiPembayaran.findById(req.params.id);
      fs.unlinkSync(oldKonfirmasiPembayaran.buktiPembayaran);
      updateData.buktiPembayaran = req.file.path;
    }

    if (pesanan) updateData.pesanan = pesanan;
    if (metodePembayaran) updateData.metodePembayaran = metodePembayaran;
    if (nomorRekening) updateData.nomorRekening = nomorRekening;
    if (status) updateData.status = status;

    const updatedKonfirmasiPembayaran = await KonfirmasiPembayaran.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedKonfirmasiPembayaran) {
      return res.status(404).json({ success: false, error: 'Konfirmasi pembayaran tidak ditemukan!' });
    }

    res.send(updatedKonfirmasiPembayaran);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE - Menghapus konfirmasi pembayaran
router.delete('/:id', async (req, res) => {
  try {
    const deletedKonfirmasiPembayaran = await KonfirmasiPembayaran.findByIdAndRemove(req.params.id);
    if (!deletedKonfirmasiPembayaran) {
      return res.status(404).json({ success: false, error: 'Konfirmasi pembayaran tidak ditemukan!' });
    }
    fs.unlinkSync(deletedKonfirmasiPembayaran.buktiPembayaran);
    res.status(200).json({ success: true, message: 'Konfirmasi pembayaran berhasil dihapus!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


module.exports = router;