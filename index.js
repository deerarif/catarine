const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const { Main, sendFonnte, getAllstatus, InvoiceHandler } = require("./model");
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
    console.log(message);
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
          "Salam Satu Hati.\nMakasih Om, Tante, Kaka, Koko & Cici yang sudah menghubungi Astra Motor Kaltim 2, Main Distributor HGP & AHM Oil Wilayah Kalimantan Timur.\nPerkenalkan saya CATHERINE (Customer Share Digital & Information Centre spesial buat bantu pelanggan HGP).\nUntuk Mengecek barang bisa mengirim pesan \ncek id_barang",
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
