require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// konfigurasi transporter nodemailer dari .env
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587',10),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// verifikasi transporter (opsional)
transporter.verify().then(() => console.log('SMTP siap')).catch(err => console.warn('SMTP error', err.message));

app.post('/api/order', async (req, res) => {
  try {
    const { customerName, customerEmail, address, paymentMethod, items, total, date } = req.body;
    if (!items || !items.length) return res.status(400).json({ message: 'Keranjang kosong'});

    // buat HTML email
    const itemsHtml = items.map(i => `<li>${i.name} - Rp ${i.price.toLocaleString()}</li>`).join('');
    const html = `
      <h2>Pesanan Baru - Toko Online TJKT</h2>
      <p><strong>Nama:</strong> ${escapeHtml(customerName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(customerEmail)}</p>
      <p><strong>Alamat:</strong> ${escapeHtml(address)}</p>
      <p><strong>Metode Pembayaran:</strong> ${escapeHtml(paymentMethod)}</p>
      <p><strong>Tanggal:</strong> ${escapeHtml(date)}</p>
      <h3>Detail Barang:</h3>
      <ul>${itemsHtml}</ul>
      <p><strong>Total:</strong> Rp ${total.toLocaleString()}</p>
    `;

    const mailOptions = {
      from: `"Toko Online TJKT" <${process.env.SMTP_USER}>`,
      to: process.env.STORE_EMAIL, // email pemilik toko
      subject: `Pesanan Baru - ${customerName} - Rp ${total.toLocaleString()}`,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email terkirim:', info.messageId);
    res.json({ ok: true, message: 'Email dikirim', info: info.messageId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saat mengirim email', error: err.message });
  }
});

// simple escape untuk keamanan output email
function escapeHtml(text='') {
  return String(text).replace(/[&<>"'`=\/]/g, function(s){ return '&#'+s.charCodeAt(0)+';'; });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Server berjalan di http://localhost:${PORT}`));
