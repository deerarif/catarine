const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const {
  Main,
  sendFonnte,
  getAllstatus,
  InvoiceHandler,
  ClaimHandler,
  HotlineHandler,
} = require("./model");
const { findUser } = require("./controller/controller");
const app = express();
const port = 8080;

app.use(bodyParser.json());
app.get("/", (reg, res) => {
  res.status(200).send("ok");
});
app.use(express.static("public"));

function stringifyData(data) {
  const stringifiedItems = data
    .map((item) => ` Menu: ${item.Menu} Total: ${item.Total} `)
    .join("\n");
  return `${stringifiedItems}`;
}
// Handle POST requests to /processData
app.post("/", async (req, res) => {
  const data = req.body;
  const { device, sender, message, name, location, url, filename, extension } =
    data;

  if (message.toLowerCase().includes("cek")) {
    findUser(sender, 1);
    let id_Barang = message.trim().split(" ").slice(-1)[0];
    Main(id_Barang, res, sender);
  } else if (message.toLowerCase().includes("buat" && "invoice")) {
    //panggil invoice handler dari Model
    const key_value = message.trim().split(" ");
    const data = {
      Kode: key_value[key_value.length - 2],
      Tgl: new Date(key_value[key_value.length - 1]),
    };
    try {
      InvoiceHandler(data, res, sender);
    } catch (err) {
      console.error("Error handling request:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  } else if (message.toLowerCase().includes("claim")) {
    findUser(sender, 3);
    let id_Claim = message.trim().split(" ").slice(-1)[0];
    ClaimHandler(id_Claim, res, sender);
  } else if (message.toLowerCase().includes("hotline")) {
    findUser(sender, 4);
    let id_Claim = message.trim().split(" ").slice(-1)[0];
    HotlineHandler(id_Claim, res, sender);
  } else if (message === "!Dashboard") {
    try {
      const pesan = await getAllstatus().then((data) => {
        const message = stringifyData(data);
        return message;
      });
      const fonnteResponse = await sendFonnte(sender, {
        message: pesan,
      });
      res.status(200).send("ok");
    } catch (error) {
      console.error("Error handling request:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    try {
      const fonnteResponse = await sendFonnte(sender, {
        message:
          '*Pesan Otomatis*\nHalo. Salam Satu Hati. \nCATHERINE bisa bantu apa hari ini?\n1. Cek Stok (ketik "cek + Part Number")\n2. Buat Invoice (ketik "invoice + Nomor Dealer/Toko + Tahun-Bulan-Tanggal")\n3. Lacak pengajuan Klaim Sparepart (ketik "Claim + C3 + Nomor Dealer/Toko + Part Number")\n4. Cek Hotline Order (ketik "hotline + Nomor PO Hotline")\n5. Help\n\n*Noted* : Jika Catherine tidak membalas bisa mengetik Help + Nomor Menu (Contoh: Help 1)\nTanda + disetetiap menu tidak perlu ditulis',
      });
      res.status(200).json(fonnteResponse);
    } catch (error) {
      console.error("Error handling request:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
