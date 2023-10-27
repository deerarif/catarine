const pdf = require("pdf-creator-node");
const fs = require("fs");

// Read the HTML template
const templateHtml = fs.readFileSync("assets/template.html", "utf8");

function Makeinvoice(data) {
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

module.exports = Makeinvoice;
