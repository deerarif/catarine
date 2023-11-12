const { Stocks, sequelize, Tanggal_data } = require("./config/database");
const { QueryTypes } = require("sequelize");
const { Makeinvoice } = require("./helpers/pdf");
const {
  GetInvoiceData,
  getClaimData,
  getHotlineData,
} = require("./controller/controller");
require("dotenv").config();
const axios = require("axios");
async function sendFonnte(target, messageData) {
  const requestData = {
    target,
    message: messageData.message,
    url: messageData.url,
    filename: messageData.filename,
  };

  try {
    const response = await axios.post(
      "https://api.fonnte.com/send",
      requestData,
      {
        headers: {
          Authorization: process.env.TOKEN, // Replace 'TOKEN' with your actual authorization token
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending message to Fonnte:", error.message);
    throw error; // Re-throw the error to handle it in the request handler
  }
}
function formatRupiah(number) {
  let newAmount1 = new Intl.NumberFormat("en-US", { style: "decimal" }).format(
    number
  );
  const formatting = "Rp." + newAmount1 + ",-";
  return formatting;
}
function generateConcatenatedString(data) {
  const {
    Kode_Barang,
    Nama_Barang,
    Harga_Barang,
    QTY_Dus_Barang,
    Status_Barang,
    Dates,
  } = data;

  const formattedDate = new Date(Dates).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

  const concatenatedString = `${Kode_Barang} - ${Nama_Barang}\n| HET: Rp.${Harga_Barang.toLocaleString()}\n| Qty per Dus : ${QTY_Dus_Barang} pcs\n| ${Status_Barang}\nUpdated : ${formattedDate}`;

  return concatenatedString;
}

async function getAllstatus() {
  const data = await sequelize.query(
    "SELECT Menu.Nama as Menu, COUNT(Status.menu_id) as Total FROM Menu LEFT JOIN Status ON Status.menu_id = Menu.menu_id GROUP BY Menu.menu_id; ",
    { type: QueryTypes.SELECT }
  );
  return data;
}
async function getData(data) {
  try {
    // Query a single record from the "Stocks" table by the "Input" column
    const inputData = await Stocks.findOne({
      where: {
        Kode_Barang: data, // Replace with the input value you're searching for
      },
    });
    const Date_Data = await Tanggal_data.findOne();
    if (inputData) {
      // Store the dataValues in a variable
      const dataValues = {
        ...inputData.dataValues,
        Dates: Date_Data.dataValues["Data_Updated_at"],
      };
      // Process the data using the generateConcatenatedString function
      const concatenatedString = generateConcatenatedString(dataValues);

      // Log the processed string
      return concatenatedString;
    } else {
      return "Tidak ada data yang ditemukan\nKemungkinan ID yang anda masukkan salah";
    }
  } catch (error) {
    console.error("Error querying data:", error);
  }
}
async function ClaimHandler(id_Claim, res, sender) {
  const { Respons } = await getClaimData(id_Claim);
  try {
    const fonnteResponse = await sendFonnte(sender, {
      message: Respons,
    });
    res.status(200).send("ok");
  } catch (error) {
    console.error("Error handling request:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function HotlineHandler(id_Hotline, res, sender) {
  const { Respons } = await getHotlineData(id_Hotline);
  try {
    const fonnteResponse = await sendFonnte(sender, {
      message: Respons,
    });
    res.status(200).send("ok");
  } catch (error) {
    console.error("Error handling request:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function Main(id_barang, res, sender) {
  const result = await getData(id_barang);
  try {
    const fonnteResponse = await sendFonnte(sender, {
      message: result,
    });
    res.status(200).send("ok");
  } catch (error) {
    console.error("Error handling request:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

/*
Pertama Ambil Data key yang di proses di index.js
Kedua Ambil data dari database yang sudah di prosee
Ketiga generate invoice pakai data tsb
*/
async function InvoiceHandler(data, res, sender) {
  GetInvoiceData(data)
    .then((data) => {
      return Makeinvoice(data);
    })
    .then((link) =>
      sendFonnte(sender, {
        message: "Invoice Hasbeen generated " + link, //ini sementara
        url: link,
        filename: "Invoice", //nama file juga sementara
      })
    )
    .catch((err) => {
      throw err;
    });
}
module.exports = {
  Main,
  sendFonnte,
  getAllstatus,
  InvoiceHandler,
  getData,
  ClaimHandler,
  HotlineHandler,
};
