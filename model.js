const { Stock, sequelize } = require("./database");
const { QueryTypes } = require("sequelize");
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
          Authorization: "NIyTHUqeuLs09T!GwMIv", // Replace 'TOKEN' with your actual authorization token
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
  return `Kode & Nama Barang: ${data["Input"]} - ${
    data["Ket"]
  }\nHarga: ${formatRupiah(data["HET"])}\nQty per Dus : ${
    data["STD DUS"]
  } pcs\n${data["Respon"]}\nUpdated : ${data["Date"].toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }
  )}`;
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
    // Query a single record from the "Stock" table by the "Input" column
    const inputData = await Stock.findOne({
      where: {
        Input: data, // Replace with the input value you're searching for
      },
    });
    if (inputData) {
      // Store the dataValues in a variable
      const dataValues = {
        ...inputData.dataValues,
        Date: new Date(),
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

module.exports = { Main, sendFonnte, getAllstatus };
