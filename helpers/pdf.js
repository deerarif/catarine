const pdf = require("pdf-creator-node");
const fs = require("fs");

// Read the HTML template
const templateHtml = fs.readFileSync("assets/template.html", "utf8");

// Define the data for the invoice

const data = {
  customerCode: "IB0000H1O1 / I01",
  customerName: "HSO-H101 JKT-D. Sartika",
  address: "225 Dewi Sartika Jakarta Timur -",
  phone: "0",
  Npwp: "280075723-21.09.2023",
  NomorSurat: "H800-2023010230",
  TanggalSurat: "21.09.2023",
  JamSurat: "13:26:20",
  NotglSAP: "280075723 / 21.09.2023",
  QTY: "900",
};

function makeinvoice(data) {
  let filename = Math.random() + "_invoice" + ".pdf"; //make random pdf name
  const options = {
    format: "A4",
    orientation: "potrait",
    border: "10mm",
    header: {
      height: "0px",
    },
    footer: {
      height: "50px",
      contents: {
        default: "",
        last:
          '<footer style="height: 100%;"><table style="font-size:1rem;border-bottom: 1px solid black; border-top: 1px solid black; width: 100%;"><tr><td style="width: 17%;">Total QTY :</td><td style="width: auto;">' +
          data.QTY +
          '</td><td style="width: 20%;text-align: right; padding-right: 3%;">' +
          data.QTY +
          "</td></tr></table></footer>",
      },
    },
  };

  // Create a document using the template and data
  const document = {
    html: templateHtml,
    data: data,
    path: "public/" + filename,
    type: "pdf",
  };
  pdf.create(document, options).catch((error) => {
    console.error(error);
  });
  return "https://catarine.com/pulic/" + filename;
}

module.exports = makeinvoice;