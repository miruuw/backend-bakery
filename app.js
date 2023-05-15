const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');


app.use(cors());
app.options('*', cors());

// deklarasi middleware 
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use((err, req, res, next) => {
    if (err) {
        res.status(500).json({message: err})
    }
})

// deklasrasi mongoose untuk koneksi ke db compasss
mongoose.connect(process.env.CONNECTION_ATLAS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'bakery_db'
}).then(()=> {
    console.log('Koneksi ke database berhasil...');
}).catch((err)=> {
    console.log(err);
})

// deklarasi port di 8080;
const port = 8080;
app.listen(port, ()=> {
    console.log(`server is running http://localhost:${port}`);
})

// deklarasi routes
const produkRoutes = require('./routes/produk.router');
const kategoriRoutes = require('./routes/kategori.router');
const penggunaRoutes = require('./routes/pengguna.router');
const pemesananRoutes = require('./routes/pemesanan.router');
const pembayaranRoutes =  require('./routes/pembayaran.router');
// deklarasi file .env
const api = process.env.API_URL;

// deklarasi router express
app.use(`${api}/produk`, produkRoutes);
app.use(`${api}/kategori`, kategoriRoutes);
app.use(`${api}/pengguna`, penggunaRoutes);
app.use(`${api}/pemesanan`, pemesananRoutes);
app.use(`${api}/pembayaran`, pembayaranRoutes);