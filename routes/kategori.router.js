const express = require('express');
const router = express.Router();
const {Kategori} = require('../models/kategori.model');

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

// router.post('/', async (req, res) => {
//     try {
//         const { nama, deskripsi } = req.body;
//         const kategoriBaru = new Kategori({
//           nama: nama,
//           deskripsi: deskripsi
//         });
//         const kategori = await kategoriBaru.save();
//         res.json(kategori);
//       } catch (error) {
//         console.error('Kesalahan saat membuat kategori:', error);
//         res.status(500).json({ error: 'Kesalahan saat membuat kategori' });
//       }
// })

// router.put('/:id', async (req, res) => {
//     const kategory = await Kategori.findByIdAndUpdate(
//         req.params.id, {
//             nama: req.body.nama,
//             deskripsi: req.body.deskripsi
//         },
//         { new : true}
//     )

//     if(!kategory)
//     return res.status(400).send('kategori tidak dapat dibuat!')

//     res.send(kategory);
// })

// CREATE - Membuat kategori baru
router.post('/', async (req, res) => {
    try {
      const { nama, deskripsi } = req.body;
      const kategoriBaru = new Kategori({
        nama: nama,
        deskripsi: deskripsi
      });
      const kategori = await kategoriBaru.save();
      res.status(201).json(kategori);
    } catch (error) {
      console.error('Kesalahan saat membuat kategori:', error);
      res.status(500).json({ error: 'Kesalahan saat membuat kategori' });
    }
  });
  
  // UPDATE - Mengupdate kategori berdasarkan ID
  router.put('/:id', async (req, res) => {
    try {
      const { nama, deskripsi } = req.body;
      const kategori = await Kategori.findByIdAndUpdate(req.params.id, { nama: nama, deskripsi: deskripsi }, { new: true });
      if (kategori) {
        res.json(kategori);
      } else {
        res.status(404).json({ error: 'Kategori tidak ditemukan' });
      }
    } catch (error) {
      console.error('Kesalahan saat mengupdate kategori:', error);
      res.status(500).json({ error: 'Kesalahan saat mengupdate kategori' });
    }
  });
  
  // DELETE - Menghapus kategori berdasarkan ID
  router.delete('/:id', async (req, res) => {
    Kategori.findByIdAndRemove(req.params.id).then(kategory => {
        if(kategory) {
            return res.status(200).json({success: true, message: 'kategory berhasil dihapus!'})
        } else {
            return res.status(404).json({success: true, message: 'kategory tidak ada!'})
        }
    }).catch(err=> {
        return res.status(400).json({success: false, error: err})
    })
  });
  


module.exports = router;