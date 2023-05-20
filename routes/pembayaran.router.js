const express = require('express');
const router = express.Router();
const { KonfirmasiPembayaran } = require('../models/konfirmasiPembayaran.model');

router.post('/', async (req, res) => {
  try {
    const { pesanan, asalRekening, tujuanRekening, tanggalPembayaran, jumlah, status } = req.body;

    // Membuat objek konfirmasi pembayaran baru
    const konfirmasi = new KonfirmasiPembayaran({
      pesanan,
      asalRekening,
      tujuanRekening,
      tanggalPembayaran,
      jumlah,
      status,
    });

    // Menyimpan konfirmasi pembayaran ke dalam database
    await konfirmasi.save();

    res.status(201).json({ message: 'Konfirmasi pembayaran berhasil dibuat' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal membuat konfirmasi pembayaran' });
  }
});

router.get('/', async (req, res) => {
  try {
    const konfirmasi = await KonfirmasiPembayaran.find();
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

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { pesanan, asalRekening, tujuanRekening, tanggalPembayaran, jumlah, status } = req.body;

    // Mengecek apakah konfirmasi pembayaran dengan ID yang diberikan ada dalam database
    const existingKonfirmasi = await KonfirmasiPembayaran.findById(id);
    if (!existingKonfirmasi) {
      return res.status(404).json({ error: 'Konfirmasi pembayaran tidak ditemukan' });
    }

    // Mengupdate konfirmasi pembayaran
    existingKonfirmasi.pesanan = pesanan;
    existingKonfirmasi.asalRekening = asalRekening;
    existingKonfirmasi.tujuanRekening = tujuanRekening;
    existingKonfirmasi.tanggalPembayaran = tanggalPembayaran;
    existingKonfirmasi.jumlah = jumlah;
    existingKonfirmasi.status = status;

    // Menyimpan perubahan pada konfirmasi pembayaran
    await existingKonfirmasi.save();

    res.status(200).json({ message: 'Konfirmasi pembayaran berhasil diperbarui' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal memperbarui konfirmasi pembayaran' });
  }
});


router.delete('/:id', async (req, res) => {
  KonfirmasiPembayaran.findByIdAndRemove(req.params.id).then(pembayaran => {
    if (pembayaran) {
      return res.status(200).json({ success: true, message: 'data pembayaran berhasil dihapus!' })
    } else {
      return res.status(404).json({ success: true, message: 'data pembayaran tidak ada!' })
    }
  }).catch(err => {
    return res.status(400).json({ success: false, error: err })
  })
});


module.exports = router;