const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Produk } = require('../models/produk.model');
const { Kategori } = require('../models/kategori.model');
const fs = require('fs');


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
      cb(uploadError, 'asset/products')
  },
  filename: function (req, file, cb) {
      const fileName = file.originalname.split(' ').join('-');
      const extenstion = FILE_TYPE_MAP[file.mimetype];
      cb(null, `${fileName}`)
      // dengan filename asli tidak di hash / tambah char
  }
})

const upload = multer({ storage: storage })


router.post('/', upload.single('gambar'), async (req, res) => {
  const { nama, harga, stok, deskripsi, kategori, isFeatured } = req.body;
  const file = req.file;

  try {
    const kategoriObj = await Kategori.findById(kategori);
    if (!kategoriObj) {
      return res.status(400).send('Kategori tidak valid!');
    }

    if (!file) {
      return res.status(400).send('Tidak ada file gambar yang disediakan!');
    }

    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/asset/products/`;
    
    const produk = new Produk({
      nama,
      harga,
      stok,
      deskripsi,
      isFeatured,
      gambar: `${basePath}${fileName}`,
      kategori: kategoriObj,

    });

    const savedProduk = await produk.save();
    res.send(savedProduk);
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to create a product!');
  }
});

router.get(`/`, async (req, res) => {
    // contoh : localhost:8080/bc-bakery/v1/produk
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

router.patch('/:id', upload.single('gambar'), async (req, res) => {
  const { nama, harga, stok, deskripsi, kategori, isFeatured } = req.body;
  const file = req.file;

  try {
    const kategoriObj = await Kategori.findById(kategori);
    if (!kategoriObj) {
      return res.status(400).send('Kategori tidak valid!');
    }

    const product = await Produk.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan!' });
    }

    let imagePath = product.gambar;
    const basePath = `${req.protocol}://${req.get('host')}/asset/products/`; // Definisikan basePath

    // Delete the old image if a new image is uploaded
    if (file) {
      if (product.gambar) {
        const oldImagePath = product.gambar.replace(`${req.protocol}://${req.get('host')}/`, '');
        fs.unlink(`asset/products/${oldImagePath}`, (error) => {
          if (error) {
            console.error('Gagal menghapus file gambar lama:', error);
          }
        });
      }

      imagePath = `${file.filename}`;
    }

    const updatedProduk = await Produk.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          nama,
          harga,
          stok,
          deskripsi,
          isFeatured,
          gambar: imagePath ? `${basePath}${imagePath}` : undefined,
          kategori: kategoriObj,
        },
      },
      { new: true }
    );

    if (!updatedProduk) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan!' });
    }

    res.send(updatedProduk);
  } catch (error) {
    console.error(error);
    res.status(500).send('Gagal memperbarui produk!');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const product = await Produk.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan!' });
    }

    if (product.gambar) {
      const imagePath = product.gambar.replace(`${req.protocol}://${req.get('host')}/`, '');
      fs.unlink(`asset/products/${imagePath}`, (error) => {
        if (error) {
          console.error('Gagal menghapus file gambar:', error);
        }
      });
    }

    const deletedProduct = await Produk.findByIdAndRemove(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: 'Gagal menghapus produk!' });
    }

    res.send({ success: true, message: 'Produk berhasil dihapus!' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Gagal menghapus produk!');
  }
});


module.exports = router; 