const express = require('express');
const router = express.Router();
const { PesananItem } = require('../models/pesananItem.model');
const { DetailPesanan } = require('../models/detailPesanan.model');

router.post('/', async (req, res) => {
    try {
      const orderItems = req.body.pesananItem;
      const orderItemsIds = [];
  
      for (const orderItem of orderItems) {
        const newOrderItem = new PesananItem({
          kuantitas: orderItem.kuantitas,
          produk: orderItem.produk,
        });
  
        const savedOrderItem = await newOrderItem.save();
        orderItemsIds.push(savedOrderItem._id);
      }
  
      const orderItemsWithPrices = await PesananItem.find({ _id: { $in: orderItemsIds } }).populate('produk', 'harga');
      const totalPrices = orderItemsWithPrices.map((orderItem) => orderItem.produk.harga * orderItem.kuantitas);
  
      const order = new DetailPesanan({
        pesananItem: orderItemsIds,
        alamatPengiriman1: req.body.alamatPengiriman1,
        alamatPengiriman2: req.body.alamatPengiriman2,
        telepon: req.body.telepon,
        kota: req.body.kota,
        status: req.body.status,
        totalPrice: totalPrices.reduce((a, b) => a + b, 0),
        pengguna: req.body.pengguna,
      });
  
      const savedOrder = await order.save();
  
      if (!savedOrder)
        return res.status(404).send('Pemesanan tidak dapat dibuat!');
  
      res.send(savedOrder);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

router.get('/', async (req, res) => {
    const orderList = await DetailPesanan.find().populate('pesananItem').populate('pengguna', 'nama').sort('dibuatPada');

    if (!orderList) {
        res.status(500).json({ success: false })
    }
    res.send(orderList);
})

router.get('/:id', async (req, res) => {
    const order = await DetailPesanan.findById(req.params.id).populate('pengguna', 'nama')

    if (!order) {
        res.status(500).json({ success: false })
    }
    res.send(order);
})

router.put('/:id', async (req, res) => {
    const order = await DetailPesanan.findByIdAndUpdate(
        req.params.id, {
        status: req.body.status
    },
        { new: true }
    )

    if (!order)
        return res.status(400).send('Pesanan tidak dapat diupdate!')

    res.send(order);
})

router.patch('/:id', async (req, res) => {
    try {
      const orderId = req.params.id;
      const orderItems = req.body.pesananItem;
  
      const updatedOrderItems = [];
  
      for (const orderItem of orderItems) {
        const updatedItem = await PesananItem.findByIdAndUpdate(
          orderItem._id,
          {
            kuantitas: orderItem.kuantitas,
            produk: orderItem.produk,
          },
          { new: true }
        );
        updatedOrderItems.push(updatedItem._id);
      }
  
      const orderItemsWithPrices = await PesananItem.find({ _id: { $in: updatedOrderItems } }).populate('produk', 'harga');
      const totalPrices = orderItemsWithPrices.map((orderItem) => orderItem.produk.harga * orderItem.kuantitas);
  
      const updatedOrder = await DetailPesanan.findByIdAndUpdate(
        orderId,
        {
          pesananItem: updatedOrderItems,
          alamatPengiriman1: req.body.alamatPengiriman1,
          alamatPengiriman2: req.body.alamatPengiriman2,
          telepon: req.body.telepon,
          kota: req.body.kota,
          status: req.body.status,
          totalPrice: totalPrices.reduce((a, b) => a + b, 0),
          pengguna: req.body.pengguna,
        },
        { new: true }
      );
  
      if (!updatedOrder)
        return res.status(400).send('Pesanan tidak dapat diupdate!');
  
      res.send(updatedOrder);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

router.delete('/:id', (req, res) => {
    DetailPesanan.findByIdAndRemove(req.params.id).then(order => {
        if (order) {
            return res.status(200).json({ success: true, message: 'data pesanan berhasil dihapus!' })
        } else {
            return res.status(404).json({ success: true, message: 'data pesanan tidak ada!' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, error: err })
    })
})

module.exports = router;