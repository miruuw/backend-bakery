const express = require('express');
const router = express.Router();
const { PesananItem } = require('../models/pesananItem.model');
const { DetailPesanan } = require('../models/detailPesanan.model');

router.post('/', async (req, res) => {
    const orderItemsIds = Promise.all(req.body.pesananItem.map(async orderItem => {
        var newOrderItem = new PesananItem({
            kuantitas: orderItem.kuantitas,
            produk: orderItem.produk
        })

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id
    }))

    const orderItemsIdsResolved = await orderItemsIds;

    // const totalPrices = await Promise.all(orderItemsIdsResolved.map(async(orderItemId) => {
    //     const orderItem = await PesananItem.findById(orderItemId).populate('produk', 'harga');
    //     const totalPrice = orderItem.produk.harga * orderItem.kuantitas;
    //     return totalPrice;
    // }))

    let order = new DetailPesanan({
        pesananItem: orderItemsIdsResolved,
        alamatPengiriman1: req.body.alamatPengiriman1,
        alamatPengiriman2: req.body.alamatPengiriman2,
        telepon: req.body.telepon,
        kota: req.body.kota,
        status: req.body.status,
        // totalPrice: totalPrices,
        pengguna: req.body.pengguna,
    })

    order = await order.save();

    if (!order)
        return res.status(404).send('Pemesanan tidak dapat dibuat!')

    res.send(order);
})

router.get('/', async (req, res) => {
    const orderList = await DetailPesanan.find().populate('pengguna', 'nama').sort('dibuatPada');

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