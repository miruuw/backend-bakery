const { OrderItem } = require('../models/orderItem.model');
const { DetailOrder }  = require('../models/detailOrder.model');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const orderItemsIds = req.body.orderItems.map(async orderItem => {
        let newOrderItem = new OrderItem({
            produk : orderItem.produk,
            jumlah_beli: orderItem.jumlah_beli
        })

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id
    })
    console.log(orderItemsIds);

    let order = new DetailOrder({
        orderItems: orderItemsIds,
        
    })
})

module.exports = router;